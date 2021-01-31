import { NextFunction, Request, Response } from 'express'

const routeNotFoundHandler = (req: Request, res: Response) => {  
  res.sendStatus(404)
}

export default routeNotFoundHandler