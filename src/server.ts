import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { Container } from 'inversify'
import { appContainer } from './inversify.config'
import { AdmissionController } from './controllers/admission'
import fastifyInversifyPlugin from './inversify.fastify.plugin'
import fastifyUnderPressurePlugin from '@fastify/under-pressure'
export class Server {
  private readonly container: Container
  private readonly fastify: FastifyInstance

  constructor (container: Container, options: FastifyServerOptions, port: number) {
    this.container = container
    this.fastify = Fastify(options)
    this.registerPlugins()
    this.registerControllers()
    this.fastify.listen({
      port
    }).catch((err) => {
      this.fastify.log.error(`Error occurred while attempting to listen on port ${port}, error message: ${err.message}`)
    })
  }

  private registerPlugins () {
    this.fastify.register(fastifyInversifyPlugin, {
      container: appContainer,
      disposeOnClose: false,
      disposeOnResponse: false
    })
    this.fastify.register(fastifyUnderPressurePlugin, {
      maxEventLoopDelay: 1000,
      maxHeapUsedBytes: 100000000,
      maxRssBytes: 100000000,
      maxEventLoopUtilization: 0.98,
      message: 'Unavailable',
      retryAfter: 50,
      exposeStatusRoute: true
    })
  }

  private registerControllers () {
    this.fastify.register(AdmissionController, {
      prefix: 'api/v1/admission'
    })
  }
}
