const p = process.env

export default {
  listenPort: p.PORT || 3003,
  dbConnectionUrl: p.DB_URL,
  dbTableName: p.DB_TABLE_NAME,
  maxDbConnections: 20,
  maxDbQueryTime: 30000,
  bodyLimits: {
    maxJsonSize: '1mb'
  }
}
