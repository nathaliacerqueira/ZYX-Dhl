'use client';

import { useEffect, useState } from 'react';
import { routesApi, type Route } from '@/lib/api';

const statusColors: Record<string, string> = {
  Ativa: 'bg-green-100 text-green-800',
  Inativa: 'bg-gray-100 text-gray-700',
};

interface FormData {
  id?: number;
  nome: string;
  origem: string;
  destino: string;
  distanciaKm: string;
  tempoEstimadoHoras: string;
  status: string;
}

const emptyForm: FormData = { nome: '', origem: '', destino: '', distanciaKm: '', tempoEstimadoHoras: '', status: 'Ativa' };

export default function RotasPage() {
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

  const load = () => {
    setLoading(true);
    routesApi.getAll()
      .then(setRoutes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (r: Route) => {
    setForm({
      id: r.id,
      nome: r.nome,
      origem: r.origem,
      destino: r.destino,
      distanciaKm: String(r.distanciaKm),
      tempoEstimadoHoras: String(r.tempoEstimadoHoras),
      status: r.status,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { setFormError('Nome é obrigatório'); return; }
    if (!form.origem.trim()) { setFormError('Origem é obrigatória'); return; }
    if (!form.destino.trim()) { setFormError('Destino é obrigatório'); return; }
    const distancia = parseFloat(form.distanciaKm);
    const tempo = parseFloat(form.tempoEstimadoHoras);
    if (isNaN(distancia) || distancia <= 0) { setFormError('Distância inválida'); return; }
    if (isNaN(tempo) || tempo <= 0) { setFormError('Tempo estimado inválido'); return; }
    setSaving(true);
    setFormError('');
    try {
      const payload = { nome: form.nome, origem: form.origem, destino: form.destino, distanciaKm: distancia, tempoEstimadoHoras: tempo, status: form.status };
      if (form.id) {
        await routesApi.update(form.id, { id: form.id, createdAt: '', ...payload });
      } else {
        await routesApi.create(payload);
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
      await routesApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rotas</h1>
          <p className="text-slate-500 mt-1">Gerencie as rotas de entrega ZYX</p>
        </div>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
          + Nova Rota
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">Erro ao carregar rotas: {error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Nome</th>
                  <th className="px-6 py-3 text-left font-semibold">Origem</th>
                  <th className="px-6 py-3 text-left font-semibold">Destino</th>
                  <th className="px-6 py-3 text-left font-semibold">Distância</th>
                  <th className="px-6 py-3 text-left font-semibold">Tempo Est.</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.nome}</td>
                    <td className="px-6 py-4 text-slate-700">{r.origem}</td>
                    <td className="px-6 py-4 text-slate-700">{r.destino}</td>
                    <td className="px-6 py-4 text-slate-600">{r.distanciaKm.toLocaleString('pt-BR')} km</td>
                    <td className="px-6 py-4 text-slate-600">{r.tempoEstimadoHoras}h</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[r.status] ?? 'bg-slate-100 text-slate-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(r)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Editar</button>
                      <button onClick={() => { setDeleteId(r.id); setDeleteError(''); }} className="text-red-600 hover:text-red-800 font-medium text-sm">Excluir</button>
                    </td>
                  </tr>
                ))}
                {routes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Nenhuma rota cadastrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{form.id ? 'Editar Rota' : 'Nova Rota'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nome da rota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origem *</label>
                <input type="text" value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cidade de origem" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destino *</label>
                <input type="text" value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Cidade de destino" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distância (km) *</label>
                  <input type="number" step="0.1" min="0" value={form.distanciaKm} onChange={(e) => setForm({ ...form, distanciaKm: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tempo Est. (h) *</label>
                  <input type="number" step="0.5" min="0" value={form.tempoEstimadoHoras} onChange={(e) => setForm({ ...form, tempoEstimadoHoras: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-60">
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
            <p className="text-slate-600 text-sm mb-4">Deseja realmente excluir esta rota? Esta ação não pode ser desfeita.</p>
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
