import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { Todo, FilterStatus } from '../types';

interface TodoListProps {
  todos: Todo[];
  filter: FilterStatus;
  searchQuery: string;
  onToggleComplete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, desc: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  searchQuery,
  onToggleComplete,
  onUpdate,
  onDelete,
}) => {
  const filteredTodos = todos.filter((todo) => {
    // Status Filter
    if (filter === 'active' && todo.done) return false;
    if (filter === 'completed' && !todo.done) return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = todo.title.toLowerCase().includes(q);
      const descMatch = todo.desc.toLowerCase().includes(q);
      return titleMatch || descMatch;
    }

    return true;
  });

  if (todos.length === 0) {
    return (
      <div className="glass-card empty-state">
        <div className="empty-icon">
          <Sparkles size={32} />
        </div>
        <h3 className="empty-title">Your workspace is clean!</h3>
        <p className="empty-subtitle">
          No tasks created yet. Click "New Task" above to organize your day.
        </p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="glass-card empty-state">
        <div className="empty-icon">
          {filter === 'completed' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
        </div>
        <h3 className="empty-title">No matching tasks found</h3>
        <p className="empty-subtitle">
          {searchQuery
            ? `No tasks match your search "${searchQuery}".`
            : `You have no ${filter} tasks right now.`}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
