import express, { Application } from 'express'
import bodyParser from 'body-parser'

import cfg from './config'
import errorHandler from './middlewares/errorHandler'
import pool from './db/dbConnector'
import regionsRouter from './routers/RegionsRouter'
import routeNotFoundHandler from './middlewares/routeNotFoundHandler'

class Server {
  private app: Application;

  constructor() {
    this.app = express()
    this.applyMiddlewares()
    this.dbConnect()
    this.setupRouter()
    this.setupRouteNotFoundHandler()
    this.setupErrorHandler()
  }

  private applyMiddlewares(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json({ limit: cfg.bodyLimits.maxJsonSize }))
  }

  private dbConnect(): void {
    pool.connect(function (err) {
      if (err) throw new Error(err.message)
      console.log('Connected to db')
    })
  }

  private setupRouter(): void {
    this.app.use('/regions', regionsRouter)
  }

  private setupErrorHandler(): void {
    this.app.use(errorHandler)
  }

  private setupRouteNotFoundHandler(): void {
    this.app.use('*', routeNotFoundHandler)
  }

  public start = () => new Promise((resolve, reject) => {
    this.app.listen(Number(cfg.listenPort), () => {
      resolve(Number(cfg.listenPort))
    }).on('error', (err) => reject(err))
  })
}

export default Server