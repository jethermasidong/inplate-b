import type { FastifyInstance } from "fastify";
import Fastity from 'fastify';


export async function buildApp(): Promise<FastifyInstance> {
    const fastify = Fastity({
        logger: true,
    })

    fastify.get('/', async () => {
        return { hello: 'world', runtime: 'Fastify with Typescript' }
    })

    return fastify
}

