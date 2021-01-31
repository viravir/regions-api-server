import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

import RegionService from '../services/RegionService'

// TODO -> use better validation against injections
const getParamsValidator = Joi.object({
  id: Joi.number().integer().min(0).required(),
})

// TODO -> use better validation against injections
const addParamsValidator = Joi.object({
  name: Joi.string().max(200).required(),
  // TODO -> add pattern
  path: Joi.string().required()
})

// TODO -> use better validation against injections
const updateParamsValidator = Joi.object({
  id: Joi.number().integer().min(0).required(),
  name: Joi.string().max(200).optional(),
  path: Joi.string().pattern(/([0-9]*\.)*/).optional()
})
  .with('id', [])
  .or('name', 'path')

// TODO -> use better validation against injections
const deleteParamsValidator = Joi.object({
  id: Joi.number().integer().min(0).required(),
})

class RegionsController {
  private service: RegionService;
  
  constructor(service: RegionService) {
    this.service = service
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regions = await this.service.getAll()

      res.json(regions)
    } catch(e) {
      next(e)
    }
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validGetParams = await getParamsValidator.validateAsync(req.params)

      const region = await this.service.get(validGetParams)

      if (!region) {
        return res.sendStatus(404)
      }

      res.json(region)
    } catch(e) {
      next(e)
    }
  }

  public add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validAddParams = await addParamsValidator.validateAsync(req.body)

      const region = await this.service.add(validAddParams)

      res.json(region)
    } catch(e) {
      if (e.message.match('Region already exists at provided path')) {
        return res.status(400).send(e.message)
      }
      next(e)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const validUpdateParams = await updateParamsValidator.validateAsync({ id, ...req.body })

      await this.service.update(validUpdateParams)

      res.sendStatus(200)
    } catch(e) {
      next(e)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validDeleteParams = await deleteParamsValidator.validateAsync(req.params)

      await this.service.delete(validDeleteParams)

      res.sendStatus(200)
    } catch(e) {
      next(e)
    }
  }
}

export default RegionsController