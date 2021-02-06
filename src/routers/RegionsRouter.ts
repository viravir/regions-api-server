import { Router } from 'express'

import RegionRepository from '../repositories/RegionRepository'
import RegionService from '../services/RegionService'
import RegionsController from '../controllers/RegionsController'

const router = Router()

const controller = new RegionsController(new RegionService(new RegionRepository()))

router.get('', controller.getAll)
router.get('/:id', controller.get)
router.post('', controller.add)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
