import type { FastifyInstance } from "fastify";
import Fastify from 'fastify';


export async function buildApp(): Promise<FastifyInstance> {
    const fastify = Fastify({
        logger: true,
    })

    fastify.get('/', async () => {
        return { hello: 'world', runtime: 'Fastify with Typescript' }
    })

    return fastify
}

