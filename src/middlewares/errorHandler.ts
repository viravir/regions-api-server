import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'joi'

// TODO -> use custom error type
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.log('Centralized error handler catched an error: ', err)

  const errorStatus = err instanceof ValidationError ? 400 : 500
  const errorMessage = process.env.NODE_ENV === 'production' ? 'Error' : err.message
  const errorDetails = process.env.NODE_ENV === 'production' ? '' : err.stack

  res.status(errorStatus).send(`${errorMessage} ${errorDetails}`)
}

export default errorHandler
