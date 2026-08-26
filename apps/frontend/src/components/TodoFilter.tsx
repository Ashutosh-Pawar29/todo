import React from 'react';
import { Search } from 'lucide-react';
import { FilterStatus } from '../types';

interface TodoFilterProps {
  filter: FilterStatus;
  setFilter: (f: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="glass-card filter-bar">
      <div className="filter-tabs">
        <button
          className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="search-box">
        <div className="input-wrapper">
          <input
            type="text"
            className="input-control input-control-icon"
            style={{ padding: '0.45rem 0.85rem 0.45rem 2.4rem', fontSize: '0.875rem' }}
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={15} className="input-icon" style={{ left: '0.8rem' }} />
        </div>
      </div>
    </div>
  );
};
