import { Container } from 'inversify'

export default async function main (appContainer: Container) : Promise<void> {

}

if (require.main === module) {
  const appContainer = require('./inversify.config').appContainer
  main(appContainer).catch((err) => {
    console.error(`Error while running: ${err}`)
  })
}
