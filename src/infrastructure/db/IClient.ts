// src/ports/database.port.ts

export interface DatabasePort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T extends any[] = any>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(fn: (db: DatabasePort) => Promise<T>): Promise<T>;
}
