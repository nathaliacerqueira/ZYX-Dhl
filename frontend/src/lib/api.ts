const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Motoristas ---
export interface Driver {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  email: string;
  status: string;
  createdAt: string;
}

export const driversApi = {
  getAll: () => request<Driver[]>('/api/motoristas'),
  getById: (id: number) => request<Driver>(`/api/motoristas/${id}`),
  create: (data: Omit<Driver, 'id' | 'createdAt'>) =>
    request<Driver>('/api/motoristas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Driver) =>
    request<Driver>(`/api/motoristas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/motoristas/${id}`, { method: 'DELETE' }),
};

// --- Rotas ---
export interface Route {
  id: number;
  nome: string;
  origem: string;
  destino: string;
  distanciaKm: number;
  tempoEstimadoHoras: number;
  status: string;
  createdAt: string;
}

export const routesApi = {
  getAll: () => request<Route[]>('/api/rotas'),
  getById: (id: number) => request<Route>(`/api/rotas/${id}`),
  create: (data: Omit<Route, 'id' | 'createdAt'>) =>
    request<Route>('/api/rotas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Route) =>
    request<Route>(`/api/rotas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/rotas/${id}`, { method: 'DELETE' }),
};

// --- Remessas ---
export interface Shipment {
  id: number;
  codigoRastreio: string;
  motoristaId: number;
  rotaId: number;
  status: string;
  pesoKg: number;
  descricao: string;
  nomeRemetente: string;
  nomeDestinatario: string;
  enderecoDestino: string;
  createdAt: string;
  entregueEm?: string;
  motorista?: Driver;
  rota?: Route;
}

export const shipmentsApi = {
  getAll: () => request<Shipment[]>('/api/remessas'),
  getById: (id: number) => request<Shipment>(`/api/remessas/${id}`),
  create: (data: Omit<Shipment, 'id' | 'createdAt' | 'motorista' | 'rota'>) =>
    request<Shipment>('/api/remessas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Omit<Shipment, 'motorista' | 'rota'>) =>
    request<Shipment>(`/api/remessas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/remessas/${id}`, { method: 'DELETE' }),
};

// --- Dashboard ---
export interface DashboardStats {
  total: number;
  motoristasAtivos: number;
  rotasAtivas: number;
  pendentes: number;
  emTransito: number;
  entregues: number;
  cancelados: number;
}

export const dashboardApi = {
  getStats: () => request<DashboardStats>('/api/remessas/stats'),
};
