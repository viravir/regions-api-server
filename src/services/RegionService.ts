import RegionRepository from '../repositories/RegionRepository'
import Region from '../types/Region'

type GetParams = {
  id: number
}

type AddParams = {
  name: string
  path: string
}

type UpdateParams = {
  id: number
  name?: string
  path?: string
}

type DeleteParams = {
  id: number
}

class RegionsService {
  private repository: RegionRepository

  constructor(repository: RegionRepository) {
    this.repository = repository
  }

  public getAll = async (): Promise<Region[]> => {
    try {
      const regions = await this.repository.getAll()

      return regions
    } catch (e) {
      throw new Error(e)
    }
  }

  public get = async (params: GetParams): Promise<Region> => {
    try {
      const region = await this.repository.get({ id: params.id })

      return region
    } catch (e) {
      throw new Error(e)
    }
  }

  public add = async (params: AddParams): Promise<Region> => {
    try {
      const existingRegionAtPath = await this.repository.get({ path: params.path })
      if (existingRegionAtPath) {
        throw new Error('Region already exists at provided path')
      }
      const region = await this.repository.add({ name: params.name, path: params.path })

      return region
    } catch (e) {
      throw new Error(e)
    }
  }

  public update = async (params: UpdateParams): Promise<void> => {
    try {
      const existingRegionAtPath = await this.repository.get({ path: params.path })
      if (existingRegionAtPath) {
        throw new Error('Region already exists at provided path')
      }
      await this.repository.update({ id: params.id, name: params.name, path: params.path })
    } catch (e) {
      throw new Error(e)
    }
  }

  public delete = async (params: DeleteParams): Promise<void> => {
    try {
      const existingRegionAtPath = await this.repository.get({ id: params.id })
      if (!existingRegionAtPath) {
        throw new Error('Region does not exist')
      }
      await this.repository.delete({ id: params.id })
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default RegionsService
