const isProd = process.env.NODE_ENV === 'production';
const API_BASE = isProd ? 'https://bokspot-be.onrender.com/api/v1' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1');

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${path} - ${errText}`);
  }
  return res.json();
}

export const api = {
  services: {
    create: (merchantId: string, data: any) => apiFetch(`/services/${merchantId}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/services/${id}`, { method: 'DELETE' }),
    list: (params?: Record<string, string>) => {
      const q = new URLSearchParams(params || {}).toString();
      return apiFetch(`/services${q ? '?' + q : ''}`);
    },
  }
};
