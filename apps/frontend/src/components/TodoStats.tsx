import React from 'react';
import { ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.done).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon total">
            <ListTodo size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon pending">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <span>Progress Status</span>
            <span>{percentage}% Completed ({completed} of {total})</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
