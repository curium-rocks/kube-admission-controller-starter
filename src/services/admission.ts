import { inject, injectable } from 'inversify'
import { TYPES } from '../types'

export interface IAdmission {
  allowAdmission(containerImages: string[]): Promise<boolean>
}

@injectable()
export class Admission implements IAdmission {
  private readonly allowedImages: Set<string>
  private readonly blockedImages: Set<string>
  private readonly strictMode: boolean

  constructor (
    @inject(TYPES.Config.AllowedList)allowedImages: string[],
    @inject(TYPES.Config.BlockedList)blockedImages: string[],
    @inject(TYPES.Config.StrictMode)strictMode: boolean) {
    this.allowedImages = new Set(allowedImages.map((s) => s.toLowerCase()))
    this.blockedImages = new Set(blockedImages.map((s) => s.toLowerCase()))
    this.strictMode = strictMode
  }

  async allowAdmission (containerImages: string[]): Promise<boolean> {
    for (const idx in containerImages) {
      const imageName = containerImages[idx].toLowerCase()
      if (this.blockedImages.has(imageName)) return Promise.resolve(false)
      if (this.strictMode && !this.allowedImages.has(imageName)) return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }
}
