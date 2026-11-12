import type { FastifyInstance, FastifyRequest } from "fastify";
import { getCommodityTimeSeries, getMarketInflationOverview } from "../scripts/dataChart.js";
import { query } from "../config/db.js";

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
                c.category,
                p.price,
                p.period_of,
                ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY p.period_of DESC) as rn
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
                `SELECT price, period_of, market FROM price_logs WHERE commodity_id = $1 ORDER BY period_of ASC`,
                [id]
            );
            return { success: true, data: result.rows };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch history' });
        }
    });

    fastify.get('/api/analytics/trend/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        try {
            const commodityId = parseInt(request.params.id, 10);
            const timeSeriesData = await getCommodityTimeSeries(commodityId);

            if (!timeSeriesData) {
                return reply.code(404).send({ error: 'Commodity time series not found' });
            }

            return { success: true, data: timeSeriesData };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch commodity time series' });
        }
    });

    fastify.get('/api/analytics/market-inflation', async (request, reply) => {
        try {
            const inflationData = await getMarketInflationOverview();
            return { success: true, data: inflationData };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch market inflation overview' });
        }
    });

    
}