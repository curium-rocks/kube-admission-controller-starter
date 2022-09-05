import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { TYPES } from './types'
import { IKubernetes, Kubernetes } from './services/kubernetes'
import { CoreV1Api, KubeConfig } from '@kubernetes/client-node'
import { K8sClientBuilder } from './entities/kube'
import { Admission, IAdmission } from './services/admission'

const appContainer = new Container()

appContainer.bind<IKubernetes>(TYPES.Services.Kubernetes).to(Kubernetes)
appContainer.bind<IAdmission>(TYPES.Services.Admission).to(Admission)

appContainer.bind<KubeConfig>(TYPES.K8S.Config).toDynamicValue((context: interfaces.Context) => {
  const config = new KubeConfig()
  config.loadFromDefault()
  return config
})
appContainer.bind<CoreV1Api>(TYPES.K8S.CoreApi).toDynamicValue((context: interfaces.Context) => {
  const builder = new K8sClientBuilder(CoreV1Api)
  return builder.buildClient(context.container.get<KubeConfig>(TYPES.K8S.Config)) as CoreV1Api
})

export { appContainer }
