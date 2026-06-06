'use client';

import { useEffect, useState } from 'react';
import { dashboardApi, DashboardStats, shipmentsApi, Shipment } from '@/lib/api';

const statusColors: Record<string, string> = {
  Pendente: 'bg-yellow-100 text-yellow-800',
  EmTransito: 'bg-blue-100 text-blue-800',
  Entregue: 'bg-green-100 text-green-800',
  Cancelado: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  Pendente: 'Pendente',
  EmTransito: 'Em Trânsito',
  Entregue: 'Entregue',
  Cancelado: 'Cancelado',
};

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.getStats(), shipmentsApi.getAll()])
      .then(([s, r]) => {
        setStats(s);
        setRecent(r.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral das operações logísticas</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total de Remessas" value={stats.total} color="text-slate-900" />
            <StatCard label="Em Trânsito" value={stats.emTransito} color="text-blue-600" sub="em andamento" />
            <StatCard label="Entregues" value={stats.entregues} color="text-green-600" sub="concluídas" />
            <StatCard label="Pendentes" value={stats.pendentes} color="text-yellow-600" sub="aguardando" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Cancelados" value={stats.cancelados} color="text-red-600" />
            <StatCard label="Motoristas Ativos" value={stats.motoristasAtivos} color="text-slate-800" />
            <StatCard label="Rotas Ativas" value={stats.rotasAtivas} color="text-slate-800" />
          </div>
        </>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Remessas Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Código</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Destinatário</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Motorista</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rota</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-slate-900">{s.codigoRastreio}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.nomeDestinatario}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.motorista?.nome ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.rota?.nome ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[s.status] ?? 'bg-slate-100 text-slate-700'}`}>
                      {statusLabels[s.status] ?? s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
