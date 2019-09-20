export interface SocketMessage<ReturnType> {
  ok: boolean;
  e?: string;
  stack?: string;
  d: ReturnType;
}