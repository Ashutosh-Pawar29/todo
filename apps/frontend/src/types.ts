export interface Todo {
  id: string;
  userid: string;
  title: string;
  desc: string;
  done: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
