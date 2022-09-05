import { describe, it, beforeEach, expect, jest } from '@jest/globals'
import 'reflect-metadata'
import { ContainerImageInformation } from '../src/models/kube'
import { IKubernetes, Kubernetes } from '../src/services/kubernetes'
import { CoreV1Api, Response, V1ContainerStatus, V1PodList, V1PodSpec } from '@kubernetes/client-node'
import { Container } from 'inversify'
import { TYPES } from '../src/types'

interface ExportImageInfoFunc {
  (container: Container, print: boolean): Promise<ContainerImageInformation[]>
}

describe('app', () => {
  let app: ExportImageInfoFunc
  let container: Container
  let mockedApi: jest.Mocked<CoreV1Api>
  beforeEach(() => {
    container = new Container()
    mockedApi = new CoreV1Api() as jest.Mocked<CoreV1Api>
    container.bind<CoreV1Api>(TYPES.K8S.CoreApi).toConstantValue(mockedApi)
    container.bind<IKubernetes>(TYPES.Services.Kubernetes).to(Kubernetes)
    app = require('../src/app').default
  })
  it('Should provide a list of container information', async () => {
    // intercept the pod list command and replace with our test data
    jest.spyOn(mockedApi, 'listPodForAllNamespaces').mockImplementation(() => {
      return Promise.resolve({
        response: {} as Response,
        body: {
          items: [{
            spec: {
              nodeName: 'TEST_NODE'
            } as V1PodSpec,
            status: {
              initContainerStatuses: [{
                containerID: 'TEST_INIT_CONTAINER_ID',
                imageID: 'TEST_INIT_IMAGE_ID',
                image: 'TEST_INIT_IMAGE'
              }] as V1ContainerStatus[],
              ephemeralContainerStatuses: [{
                containerID: 'TEST_EPH_CONTAINER_ID',
                imageID: 'TEST_EPH_IMAGE_ID',
                image: 'TEST_EPH_IMAGE'
              }] as V1ContainerStatus[],
              containerStatuses: [{
                containerID: 'TEST_CONTAINER_ID',
                imageID: 'TEST_IMAGE_ID',
                image: 'TEST_IMAGE'
              }] as V1ContainerStatus[]
            }
          }]
        } as V1PodList
      } as unknown as any)
    })
    const imageInfo = await app(container, false)
    expect(imageInfo.length).toBeGreaterThan(0)
    imageInfo.forEach((info) => {
      expect(info.containerId).toBeDefined()
      expect(info.image).toBeDefined()
      expect(info.imageId).toBeDefined()
      expect(info.node).toBeDefined()
    })
  })
  it('Should not provide duplicate container information', (done) => {
    // intercept and replace with response that has dupes, confirm it de-dupes
    jest.spyOn(mockedApi, 'listPodForAllNamespaces').mockImplementation(() => {
      return Promise.resolve({
        response: {} as Response,
        body: {
          items: [{
            spec: {
              nodeName: 'TEST_NODE'
            } as V1PodSpec,
            status: {
              initContainerStatuses: [{
                containerID: 'TEST_INIT_CONTAINER_ID',
                imageID: 'TEST_INIT_IMAGE_ID',
                image: 'TEST_INIT_IMAGE'
              }, {
                containerID: 'TEST_INIT_CONTAINER_ID_2',
                imageID: 'TEST_INIT_IMAGE_ID_2',
                image: 'TEST_INIT_IMAGE'
              }] as V1ContainerStatus[]
            }
          }]
        } as V1PodList
      } as unknown as any)
    })
    app(container, false).then((imageInfo) => {
      const imageSet = new Set<string>()
      for (const idx in imageInfo) {
        const info = imageInfo[idx]
        if (imageSet.has(info.image)) {
          return done(new Error('Found duplicate'))
        }
        imageSet.add(info.image)
      }
      done()
    }).catch(done)
  })
})
