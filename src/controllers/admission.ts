import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { IAdmission } from '../services/admission'
import { TYPES } from '../types'

export function AdmissionController (instance: FastifyInstance, opts: FastifyPluginOptions, done: Function) {
  instance.log.info('Registering AdmissionController')
  const admissionService = instance.inversifyContainer.get<IAdmission>(TYPES.Services.Admission)
  instance.post('/', async (req, reply) => {
    const body = req.body as any
    reply.send({
      uid: body.uid,
      allowed: await admissionService.allowAdmission([])
    })
  })
  done()
  instance.log.info('Finished Registering AdmissionController')
}
