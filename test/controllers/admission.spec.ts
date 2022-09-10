import { describe, it, beforeEach, jest, expect } from '@jest/globals'
import 'reflect-metadata'
import Fastify, { FastifyInstance } from 'fastify'
import { Admission, IAdmission } from '../../src/services/admission'
import fastifyInversifyPlugin from '../../src/inversify.fastify.plugin'
import { AdmissionController } from '../../src/controllers/admission'
import { Container } from 'inversify'
import { TYPES } from '../../src/types'

describe('controllers/admission', () => {
  let fastify: FastifyInstance
  let container: Container
  let mockAdmissionService: jest.Mocked<IAdmission>
  beforeEach(() => {
    fastify = Fastify()
    container = new Container()
    mockAdmissionService = jest.mocked<IAdmission>(new Admission([], [], false))
    container.bind<IAdmission>(TYPES.Services.Admission).toConstantValue(mockAdmissionService)
    fastify.register(fastifyInversifyPlugin, {
      container
    })
    fastify.register(AdmissionController, {
      prefix: '/api/v1/admission'
    })
  })
  it('Should block images on disallow list', async () => {
    jest.spyOn(mockAdmissionService, 'allowAdmission').mockImplementation((images) => {
      return Promise.resolve(false)
    })
    const result = await fastify.inject({
      method: 'POST',
      payload: {
        uid: 'blocked-uid'
      },
      url: '/api/v1/admission'
    })
    expect(result.statusCode).toBe(200)
    const responseBody = JSON.parse(result.body)
    expect(responseBody.uid).toEqual('blocked-uid')
    expect(responseBody.allowed).toBeFalsy()
  })
  it('Should allow images not ondisallow list', async () => {
    jest.spyOn(mockAdmissionService, 'allowAdmission').mockImplementation((images) => {
      return Promise.resolve(true)
    })
    const result = await fastify.inject({
      method: 'POST',
      payload: {
        uid: 'allowed-uid'
      },
      url: '/api/v1/admission'
    })
    expect(result.statusCode).toBe(200)
    const responseBody = JSON.parse(result.body)
    expect(responseBody.uid).toEqual('allowed-uid')
    expect(responseBody.allowed).toBeTruthy()
  })
  it('Should track requests served', async () => {
    jest.spyOn(mockAdmissionService, 'allowAdmission').mockImplementation((images) => {
      return Promise.resolve(true)
    })
    const testReqResp = await fastify.inject({
      method: 'POST',
      payload: {
        uid: 'meta-uid'
      },
      url: '/api/v1/admission'
    })
    expect(testReqResp.statusCode).toEqual(200)
    const metaFetchResult = await fastify.inject({
      method: 'GET',
      url: '/api/v1/admission/meta'
    })
    const resp = JSON.parse(metaFetchResult.body)
    expect(resp.requestsServed).toBeGreaterThan(0)
  })
})
