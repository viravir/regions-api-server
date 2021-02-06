import { Request, Response } from 'express'

const routeNotFoundHandler = (req: Request, res: Response): void => {
  res.sendStatus(404)
}

export default routeNotFoundHandler
