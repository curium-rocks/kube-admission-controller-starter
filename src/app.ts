import { Container } from 'inversify'
import { Server } from './server'
import { FastifyServerOptions } from 'fastify'

export default async function main (container: Container, options?: FastifyServerOptions, host?: string, port? : number) : Promise<Server> {
  return Promise.resolve(new Server(container, options || {
    logger: true
  }, host || '0.0.0.0', port || 3000))
}

if (require.main === module) {
  const appContainer = require('./inversify.config').appContainer
  main(appContainer).then((server) => {
    process.on('SIGINT|SIGTERM', async () => {
      await server.close()
    })
  }).catch((err) => {
    console.error(`Error while running: ${err}`)
  })
}
