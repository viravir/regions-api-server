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
    const regions = await this.repository.getAll()

    return regions
  }

  public get = async (params: GetParams): Promise<Region> => {
    const region = await this.repository.get({ id: params.id })

    return region
  }

  public add = async (params: AddParams): Promise<Region> => {
    const existingRegionAtPath = await this.repository.get({ path: params.path })
    if (existingRegionAtPath) {
      throw new Error('Region already exists at provided path')
    }

    const pathPositionGroups = params.path.split('.')
    const addingToExistingNode = pathPositionGroups.length > 1
    if (addingToExistingNode) {
      const parentNodePath = pathPositionGroups.slice(0, pathPositionGroups.length - 1).join('.')
      const parentNode = await this.repository.get({ path: parentNodePath })
      if (!parentNode) {
        throw new Error('Parent node for this region does not exist')
      }
    }

    const region = await this.repository.add({ name: params.name, path: params.path })

    return region
  }

  public update = async (params: UpdateParams): Promise<void> => {
    const regionExists = await this.repository.get({ id: params.id })
    if (!regionExists) {
      throw new Error('Region does not exist')
    }

    const existingRegionAtPath = await this.repository.get({ path: params.path })
    if (existingRegionAtPath) {
      throw new Error('Region already exists at provided path')
    }

    await this.repository.update({ id: params.id, name: params.name, path: params.path })
  }

  public delete = async (params: DeleteParams): Promise<void> => {
    const existingRegionAtPath = await this.repository.get({ id: params.id })
    if (!existingRegionAtPath) {
      throw new Error('Region does not exist')
    }
    await this.repository.delete({ id: params.id })
  }
}

export default RegionsService
