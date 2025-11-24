import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // UTC-6 (Central Standard Time) for all connections, works locally and on Railway
  timezone: '-06:00',
});

export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const [results] = await pool.execute(sql, params);
  return results as T;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await pool.getConnection();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default pool;
