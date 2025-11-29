import { Capacitor } from "@capacitor/core";
import{
  CapacitorSQLite,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",})
export class SQLiteService {
  private db!: SQLiteDBConnection;
  private memoryUsers: any[] = [];

  async initDB() {
    try {
      if (!(CapacitorSQLite as any)?.createConnection) {
        console.warn('Plugin SQLite não está disponível.');
        return;
      }
      if (Capacitor.getPlatform() === "web") {
        console.warn('SQLite não suportado na plataforma web. Usando armazenamento em memória.');
        return;
      }
      const dbConn = await CapacitorSQLite.createConnection({
        database: "users_db",
        version: 1,
        encrypted: false,
        mode: "no-encryption",
        readonly: false,
      }) as unknown as SQLiteDBConnection | undefined;

      if(!dbConn) {
        console.error('Falha ao criar conexão com o banco de dados.');
        return;
      }
      
      this.db = dbConn;
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE
        );
      `);
    } catch (error) {
      console.error('Erro ao inicializar o BD', error );
    }
  }
  async addUser(name: string, email: string) {
    if (!this.db) {
      this.memoryUsers.push({ id: Date.now(), name, email });
      return;
    }
    const sql = `INSERT INTO users (name, email) VALUES (?, ?);`;
    await this.db.run(sql, [name, email]);
  }
  async getUsers() {
    if (!this.db) {
      return this.memoryUsers;
    }
    const res = await this.db.query(`SELECT * FROM users;`);
    return res.values || []; 
  }
  async deleteUser(id: number) {
    if (!this.db) {
      this.memoryUsers = this.memoryUsers.filter(user => user.id !== id);
      return;
    }
    await this.db.run(`DELETE FROM users WHERE id = ?;`, [id]);
  }
}