import pkg from 'pg'; 
import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
};

export default query;
