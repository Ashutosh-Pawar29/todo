import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { TodoStats } from './components/TodoStats';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Toast } from './components/Toast';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Todo, FilterStatus, ToastMessage } from './types';

export const AppContent: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getTodos(token);
      setTodos(data);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated, token, fetchTodos]);

  const handleAddTodo = async (title: string, desc: string) => {
    if (!token) return;
    try {
      const res = await api.createTodo(token, title, desc);
      setTodos((prev) => [res.todo, ...prev]);
      addToast('success', 'Task created successfully!');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to create task');
      throw err;
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!token) return;
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const newDoneState = !target.done;

    // Optimistic update
    const previousState = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: newDoneState } : t))
    );

    try {
      await api.markAsDone(token, id, newDoneState);
      if (newDoneState) {
        addToast('success', 'Task marked as completed! 🎉');
      } else {
        addToast('info', 'Task marked as active.');
      }
    } catch (err: any) {
      // Rollback on error
      setTodos(previousState);
      addToast('error', err.message || 'Failed to update status');
    }
  };

  const handleUpdateTodo = async (id: string, title: string, desc: string) => {
    if (!token) return;
    try {
      const res = await api.updateTodo(token, id, title, desc);
      setTodos((prev) => prev.map((t) => (t.id === id ? res.todo : t)));
      addToast('success', 'Task updated successfully');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update task');
      throw err;
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!token) return;
    const previousState = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTodo(token, id);
      addToast('info', 'Task deleted');
    } catch (err: any) {
      setTodos(previousState);
      addToast('error', err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="container">
        {!isAuthenticated ? (
          <AuthCard onSuccess={(msg) => addToast('success', msg)} />
        ) : (
          <div>
            <div className="dashboard-header">
              <h1 className="welcome-title">My Task Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Organize, track, and accomplish your daily targets effortlessly.
              </p>
            </div>

            <TodoStats todos={todos} />

            <TodoForm onAdd={handleAddTodo} />

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
              </div>
            ) : (
              <TodoList
                todos={todos}
                filter={filter}
                searchQuery={searchQuery}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            )}
          </div>
        )}
      </main>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
