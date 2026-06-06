'use client';

import { useEffect, useState } from 'react';
import { shipmentsApi, driversApi, routesApi, type Shipment, type Driver, type Route } from '@/lib/api';

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

interface FormData {
  id?: number;
  codigoRastreio: string;
  motoristaId: string;
  rotaId: string;
  status: string;
  pesoKg: string;
  descricao: string;
  nomeRemetente: string;
  nomeDestinatario: string;
  enderecoDestino: string;
  entregueEm?: string;
}

const emptyForm: FormData = {
  codigoRastreio: '', motoristaId: '', rotaId: '', status: 'Pendente',
  pesoKg: '', descricao: '', nomeRemetente: '', nomeDestinatario: '', enderecoDestino: '',
};

export default function RemessasPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([shipmentsApi.getAll(), driversApi.getAll(), routesApi.getAll()])
      .then(([s, d, r]) => {
        setShipments(s);
        setDrivers(d);
        setRoutes(r);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    const trackingCode = `ZYX${Date.now().toString().slice(-9)}`;
    setForm({ ...emptyForm, codigoRastreio: trackingCode });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (s: Shipment) => {
    setForm({
      id: s.id,
      codigoRastreio: s.codigoRastreio,
      motoristaId: String(s.motoristaId),
      rotaId: String(s.rotaId),
      status: s.status,
      pesoKg: String(s.pesoKg),
      descricao: s.descricao ?? '',
      nomeRemetente: s.nomeRemetente,
      nomeDestinatario: s.nomeDestinatario,
      enderecoDestino: s.enderecoDestino,
      entregueEm: s.entregueEm,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codigoRastreio.trim()) { setFormError('Código de rastreio é obrigatório'); return; }
    if (!form.motoristaId) { setFormError('Selecione um motorista'); return; }
    if (!form.rotaId) { setFormError('Selecione uma rota'); return; }
    if (!form.nomeRemetente.trim()) { setFormError('Nome do remetente é obrigatório'); return; }
    if (!form.nomeDestinatario.trim()) { setFormError('Nome do destinatário é obrigatório'); return; }
    if (!form.enderecoDestino.trim()) { setFormError('Endereço de destino é obrigatório'); return; }
    const peso = parseFloat(form.pesoKg);
    if (isNaN(peso) || peso < 0) { setFormError('Peso inválido'); return; }
    setSaving(true);
    setFormError('');
    try {
      const payload: any = {
        codigoRastreio: form.codigoRastreio,
        motoristaId: parseInt(form.motoristaId),
        rotaId: parseInt(form.rotaId),
        status: form.status,
        pesoKg: peso,
        descricao: form.descricao,
        nomeRemetente: form.nomeRemetente,
        nomeDestinatario: form.nomeDestinatario,
        enderecoDestino: form.enderecoDestino,
      };
      if (form.id) {
        await shipmentsApi.update(form.id, { id: form.id, createdAt: '', ...payload });
      } else {
        await shipmentsApi.create(payload);
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await shipmentsApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filterStatus ? shipments.filter((s) => s.status === filterStatus) : shipments;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Remessas</h1>
          <p className="text-slate-500 mt-1">Gerencie e rastreie todas as remessas ZYX</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors">
          + Nova Remessa
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">Erro ao carregar remessas: {error}</div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'Pendente', 'EmTransito', 'Entregue', 'Cancelado'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filterStatus === s ? 'bg-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === '' ? 'Todos' : statusLabels[s]}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} registros</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Código</th>
                  <th className="px-4 py-3 text-left font-semibold">Remetente</th>
                  <th className="px-4 py-3 text-left font-semibold">Destinatário</th>
                  <th className="px-4 py-3 text-left font-semibold">Motorista</th>
                  <th className="px-4 py-3 text-left font-semibold">Rota</th>
                  <th className="px-4 py-3 text-left font-semibold">Peso</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Data</th>
                  <th className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-mono text-blue-700 font-medium text-xs">{s.codigoRastreio}</td>
                    <td className="px-4 py-4 text-slate-700">{s.nomeRemetente}</td>
                    <td className="px-4 py-4 text-slate-700">{s.nomeDestinatario}</td>
                    <td className="px-4 py-4 text-slate-600">{s.motorista?.nome ?? `#${s.motoristaId}`}</td>
                    <td className="px-4 py-4 text-slate-600">{s.rota?.nome ?? `#${s.rotaId}`}</td>
                    <td className="px-4 py-4 text-slate-600">{s.pesoKg} kg</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[s.status] ?? 'bg-slate-100 text-slate-700'}`}>
                        {statusLabels[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                      {s.entregueEm && (
                        <div className="text-green-600">
                          Entregue: {new Date(s.entregueEm).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                      <button onClick={() => { setDeleteId(s.id); setDeleteError(''); }} className="text-red-600 hover:text-red-800 font-medium text-sm">Excluir</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      {filterStatus ? `Nenhuma remessa com status "${statusLabels[filterStatus]}"` : 'Nenhuma remessa cadastrada'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{form.id ? 'Editar Remessa' : 'Nova Remessa'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código de Rastreio *</label>
                <input type="text" value={form.codigoRastreio} onChange={(e) => setForm({ ...form, codigoRastreio: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motorista *</label>
                  <select value={form.motoristaId} onChange={(e) => setForm({ ...form, motoristaId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Selecione...</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rota *</label>
                  <select value={form.rotaId} onChange={(e) => setForm({ ...form, rotaId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Selecione...</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>{r.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="Pendente">Pendente</option>
                    <option value="EmTransito">Em Trânsito</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" min="0" value={form.pesoKg} onChange={(e) => setForm({ ...form, pesoKg: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="0.0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Remetente *</label>
                <input type="text" value={form.nomeRemetente} onChange={(e) => setForm({ ...form, nomeRemetente: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Empresa ou pessoa remetente" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Destinatário *</label>
                <input type="text" value={form.nomeDestinatario} onChange={(e) => setForm({ ...form, nomeDestinatario: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Pessoa ou empresa destinatária" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço de Destino *</label>
                <input type="text" value={form.enderecoDestino} onChange={(e) => setForm({ ...form, enderecoDestino: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Rua, número, cidade" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder="Descrição do conteúdo..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-60">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Confirmar Exclusão</h2>
            <p className="text-slate-600 text-sm mb-4">Deseja realmente excluir esta remessa? Esta ação não pode ser desfeita.</p>
            {deleteError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{deleteError}</div>}
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancelar</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-60">
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
