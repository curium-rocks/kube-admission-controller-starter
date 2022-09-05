import { inject, injectable } from 'inversify'
import { CoreV1Api, V1ContainerStatus, V1Pod } from '@kubernetes/client-node'
import { TYPES } from '../types'
import { ContainerImageInformation } from '../models/kube'

export interface IKubernetes {
  /**
   * Get the complete list of visible container images in a cluster
   */
  getImageList(): Promise<ContainerImageInformation[]>
}

@injectable()
export class Kubernetes implements IKubernetes {
  private readonly api: CoreV1Api

  constructor (@inject(TYPES.K8S.CoreApi)api: CoreV1Api) {
    this.api = api
  }

  async getImageList (): Promise<ContainerImageInformation[]> {
    const pods = await this.api.listPodForAllNamespaces()
    const containerImages : ContainerImageInformation[] = []
    const addContainer = (c: V1ContainerStatus, p: V1Pod) => {
      if (c.image && p.spec?.nodeName && c.containerID) {
        containerImages.push({
          image: c.image,
          imageId: c.imageID,
          node: p.spec?.nodeName,
          containerId: c.containerID
        })
      }
    }
    pods.body.items.forEach((pod) => {
      pod.status?.containerStatuses?.forEach((c) => addContainer(c, pod))
      pod.status?.initContainerStatuses?.forEach((c) => addContainer(c, pod))
      pod.status?.ephemeralContainerStatuses?.forEach((c) => addContainer(c, pod))
    })
    // filter results
    return containerImages
      .filter((c) => c.image != null)
      .filter((c, idx) => containerImages.findIndex((x) => x.image === c.image) === idx)
  }
}
