import Fastify from 'fastify';
export async function buildApp() {
    const fastify = Fastify({
        logger: true,
    });
    fastify.get('/', async () => {
        return { hello: 'world', runtime: 'Fastify with Typescript' };
    });
    return fastify;
}
//# sourceMappingURL=app.js.map