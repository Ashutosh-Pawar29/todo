import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface TodoFormProps {
  onAdd: (title: string, desc: string) => Promise<void>;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onAdd(title.trim(), desc.trim());
      setTitle('');
      setDesc('');
      setIsExpanded(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper" style={{ marginBottom: isExpanded ? '1rem' : '0' }}>
          <input
            type="text"
            className="input-control"
            placeholder="Add a new task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            required
          />
        </div>

        {isExpanded && (
          <>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <textarea
                className="input-control"
                placeholder="Add optional description or notes..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setDesc('');
                }}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {!isExpanded && (
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsExpanded(true)}
            >
              <Sparkles size={14} />
              <span>New Task</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
