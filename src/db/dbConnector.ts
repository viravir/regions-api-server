import { Pool } from 'pg'

import cfg from '../config'

export default new Pool({
  max: cfg.maxDbConnections,
  connectionString: cfg.dbConnectionUrl,
  idleTimeoutMillis: cfg.maxDbQueryTime,
})
