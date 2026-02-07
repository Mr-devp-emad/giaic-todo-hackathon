const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';

export const api = {
  async getTasks() {
    const response = await fetch(`${BASE_URL}/api/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },
  
  async get(url: string) {
    const response = await fetch(`${BASE_URL}/api${url}`);
    if (!response.ok) throw new Error(`GET ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async post(url: string, data: any) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async patch(url: string, data: any) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PATCH ${url} failed`);
    const result = await response.json();
    return { data: result };
  },

  async delete(url: string) {
    const response = await fetch(`${BASE_URL}/api${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`DELETE ${url} failed`);
    if (response.status === 204) return { data: null };
    const result = await response.json();
    return { data: result };
  }
};

export default api;
