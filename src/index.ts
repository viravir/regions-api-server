import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

import Server from './server'

const server = new Server().start()
  .then(port => console.log(`Server is running on port ${port}`))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

export default server
