import type { FastifyInstance, FastifyRequest } from "fastify";
import query from "../config/db.js";

export async function commodityAnalyticsRoutes(fastify: FastifyInstance) {

    fastify.get('/api/analytics/overview', async (request, reply) => {
        try {
            const sqlquery =  `
            WITH ranked_prices AS (
            SELECT 
                c.id,
                c.name,
                c.specification,
                c.unit, 
                p.price,
                p.period_of,
                ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY p.date DESC) as rn
                FROM commodities c
                JOIN price_logs p ON c.id = p.commodity_id
                )
                SELECT * FROM ranked_prices WHERE rn <= 2;
                `;

            const result = await query(sqlquery);
            return { success: true, data: result.rows };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch analytics overview' });
        }
    });

    fastify.get('/api/analytics/overview/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        try {
            const { id } = request.params;
            const result = await query(
                `SELECT price, period_of, market, FROM price_logs WHERE commodity_id = $1 ORDER BY period_of ASC`,
                [id]
            );
            return { success: true, data: result.rows };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch history' });
        }
    });

    
}