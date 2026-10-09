import { buildApp } from "./app.js";

const server = async () => {
    const app = await buildApp()

    try {
        await app.listen({ port:3000, host: '0.0.0.0' })
        console.log('Server is running on http://localhost:3000')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

server()