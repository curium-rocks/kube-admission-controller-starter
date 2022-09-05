import { injectable } from 'inversify'

export interface IAdmission {
  allowAdmission(containerImages: string[]): Promise<boolean>
}

@injectable()
export class Admission implements IAdmission {
  allowAdmission (containerImages: string[]): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
