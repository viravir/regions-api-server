import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'joi'

// TODO -> use custom error type
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): any => {
  console.log('Centralized error handler catched an error: ', err)

  const errorStatus = err instanceof ValidationError ? 400 : 500
  const errorMessage = process.env.NODE_ENV === 'production' ? 'Error' : err.message
  const errorDetails = process.env.NODE_ENV === 'production' ? '' : err.stack

  res.status(errorStatus).send(`${errorMessage} ${errorDetails}`)
}

export default errorHandler