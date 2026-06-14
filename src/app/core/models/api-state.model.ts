export type ViewStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiState<T> {
  data: T;
  error: string | null;
  status: ViewStatus;
}
