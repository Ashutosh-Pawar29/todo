import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Edit2, Trash2, X, Save } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, desc: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.desc);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDesc.trim());
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.desc);
    setIsEditing(false);
  };

  return (
    <div className={`glass-card todo-item ${todo.done ? 'done' : ''}`}>
      <div className="todo-content">
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-control"
              style={{ fontSize: '0.95rem', padding: '0.4rem 0.6rem' }}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="input-control"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem', minHeight: '60px' }}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h4 className="todo-title" style={{ margin: 0 }}>{todo.title}</h4>
              <span className={`status-badge ${todo.done ? 'badge-completed' : 'badge-pending'}`}>
                {todo.done ? 'Completed' : 'Pending'}
              </span>
            </div>
            {todo.desc && <p className="todo-desc">{todo.desc}</p>}
          </>
        )}
      </div>

      <div className="todo-actions" style={{ gap: '0.5rem' }}>
        {isEditing ? (
          <>
            <button
              className="btn btn-icon btn-sm"
              onClick={handleSave}
              disabled={loading}
              title="Save changes"
            >
              <Save size={15} color="#10b981" />
            </button>
            <button
              className="btn btn-icon btn-sm"
              onClick={handleCancel}
              title="Cancel"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            {/* Status Toggle Button with dynamic label */}
            <button
              className={`btn btn-sm ${todo.done ? 'btn-status-completed' : 'btn-status-action'}`}
              onClick={() => !loading && onToggleComplete(todo.id)}
              title={todo.done ? 'Click to mark as incomplete' : 'Click to mark as done'}
            >
              {todo.done ? (
                <>
                  <RotateCcw size={14} />
                  <span>Mark Incomplete</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Mark as Done</span>
                </>
              )}
            </button>

            <button
              className="btn btn-icon btn-sm"
              onClick={() => setIsEditing(true)}
              title="Edit Task"
            >
              <Edit2 size={14} />
            </button>

            <button
              className="btn btn-danger btn-sm btn-icon"
              onClick={() => onDelete(todo.id)}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
