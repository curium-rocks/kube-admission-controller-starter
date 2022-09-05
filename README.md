# Typescript-Kube-Template
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=coverage)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_kube-starter-template&metric=bugs)](https://sonarcloud.io/summary/new_code?id=curium-rocks_kube-starter-template)

This template provides a few things to kick start a project that interacts with the kubernetes api. In it's current form when you run `npm start` the project will connect to the kubernetes cluster set as your default context and build a deduplicated list of the container image information and print it to the terminal.
- [Kubernetes-client/client-node](https://github.com/kubernetes-client/javascript)
- [Jest](https://github.com/facebook/jest)
- [Github Action CI](.github/workflows/ci.yaml)
- [Renovate](https://github.com/renovatebot/renovate)
- [Eslint (with standard config)](https://github.com/standard/eslint-config-standard)
- [Typescript](https://github.com/Microsoft/TypeScript)
- [InversifyJS](https://github.com/inversify/InversifyJS)
- [Sonar Project File](./sonar-project.properties)
- [Dockerfile](./Dockerfile)

## NPM Scripts
The following scripts are included in the NPM project configuration
- `lint`lints the source code using eslint
- `lint:fix` automatically fixes any lint errors that can be fixed automatically
- `test` uses jest to run test suites
- `build` compiles the typescript into js and places it in the `dist` folder
- `start` runs the compiled js in `dist`

## Structure
### [Services](./src/services/)
This is meant to include service abstractions, ideally each service should provide an interface/contract 
exposing the functionality that other things in the application need.
### [Entities](./src/entities/)
Currently this is setup to house factories or other items to provide instances of third party things/modules that will be bound by the InversifyJS IoC container so they can be injected into other things with `@inject()`

### [Models](./src/models/)
This houses interfaces/models with little to no logic, the intent is these items can be passed/returned from the abstractions in services and avoid tight coupling to third party types.

### [types.ts](./src/types.ts)
This defines symbols for each type that will be configured in the IoC container, these are used to identify the type when using `@inject(TYPES.Services.Kubernetes)` for example. For more information refer to [inversify](https://github.com/inversify/InversifyJS).


### [inversify.config.ts](./src/inversify.config.ts)
This file maps the types defined in `./src/types.ts` to interface types. For more information refer to [inversify](https://github.com/inversify/InversifyJS).

## After Using as Template Todo List
1) [ ] Update Sonar Project Properties For [Sonar Cloud](https://sonarcloud.io)
2) [ ] Add SONARQUBE_KEY secret to your repo or org if not already present
3) [ ] Point badges in README.md to correct location for you repo
3) [ ] Update [renovate.json](./renovate.json) to meet desired behavior for your needs, docs can be found [here](https://docs.renovatebot.com).
4) [ ] Update this readme to reflect your project name and info