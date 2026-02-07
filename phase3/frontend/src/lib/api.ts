const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  if (typeof document === 'undefined') return {};
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async getTasks() {
    const response = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { ...getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },
  
  async get(url: string) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      headers: { ...getAuthHeader() }
    });
    if (!response.ok) throw new Error(`GET ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async post(url: string, data: any) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async patch(url: string, data: any) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PATCH ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async delete(url: string) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!response.ok) throw new Error(`DELETE ${url} failed`);
    if (response.status === 204) return { data: null };
    const result = await response.json();
    return { data: result };
  }
};

export default api;
