const TYPES = {
  Services: {
    Kubernetes: Symbol.for('Kubernetes'),
    Admission: Symbol.for('Admission')
  },
  Config: {
    AllowedList: Symbol.for('AllowedList'),
    BlockedList: Symbol.for('BlockedList'),
    StrictMode: Symbol.for('StrictMode')
  },
  K8S: {
    Config: Symbol.for('Config'),
    CoreApi: Symbol.for('CoreApi')
  }
}
export { TYPES }
