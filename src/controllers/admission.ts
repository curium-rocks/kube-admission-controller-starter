import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { IAdmission } from '../services/admission'
import { TYPES } from '../types'

export function AdmissionController (instance: FastifyInstance, opts: FastifyPluginOptions, done: Function) {
  instance.log.info('Registering AdmissionController')
  const admissionService = instance.inversifyContainer.get<IAdmission>(TYPES.Services.Admission)
  const processStats : Record<string, unknown> = {}
  processStats.requestsServed = 0

  instance.post('/', async (req, reply) => {
    const body: any = req.body
    reply.send({
      uid: body.uid,
      allowed: await admissionService.allowAdmission([])
    })
    processStats.requestsServed = (processStats.requestsServed as number) + 1
  })

  instance.get('/meta', async (req, reply) => {
    reply.send(processStats)
  })
  done()
  instance.log.info('Finished Registering AdmissionController')
}
