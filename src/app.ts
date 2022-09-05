import { Container } from 'inversify'
import { ContainerImageInformation } from './models/kube'
import { IKubernetes } from './services/kubernetes'
import { TYPES } from './types'

export default async function main (appContainer: Container, printToConsole: boolean) : Promise<ContainerImageInformation[]> {
  const kubernetes = appContainer.get<IKubernetes>(TYPES.Services.Kubernetes)
  const images = await kubernetes.getImageList()
  if (printToConsole) {
    console.log(images)
  }
  return images
}

if (require.main === module) {
  const appContainer = require('./inversify.config').appContainer
  main(appContainer, true).catch((err) => {
    console.error(`Error while running: ${err}`)
  })
}
