import { Todo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = (token?: string | null): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['token'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async signup(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.msg || 'Signup failed');
    }
    return data as { message: string; token: string };
  },

  async signin(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.msg === 'invalid username' || data.msg === 'invalid password') {
      throw new Error(data.msg);
    }
    if (!res.ok) {
      throw new Error(data.msg || data.message || 'Signin failed');
    }
    return data as { msg: string; token: string };
  },

  async getTodos(token: string) {
    const res = await fetch(`${API_BASE_URL}/todo`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || data.msg === 'invalid token sent please login again') {
      throw new Error(data.msg || 'Failed to fetch todos');
    }
    return (data.todos || []) as Todo[];
  },

  async createTodo(token: string, title: string, desc: string) {
    const res = await fetch(`${API_BASE_URL}/todo`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ title, desc }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to create todo');
    }
    return data as { msg: string; todo: Todo };
  },

  async updateTodo(token: string, id: string, title: string, desc: string) {
    const res = await fetch(`${API_BASE_URL}/todo`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ id, title, desc }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to update todo');
    }
    return data as { msg: string; todo: Todo };
  },

  async markAsDone(token: string, id: string, done: boolean) {
    const res = await fetch(`${API_BASE_URL}/MarkAsDone`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ id, done }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to update todo status');
    }
    return data as { msg: string; todo: Todo };
  },

  async deleteTodo(token: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/todo`, {
      method: 'DELETE',
      headers: getHeaders(token),
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to delete todo');
    }
    return data as { msg: string; todo: Todo };
  },
};
