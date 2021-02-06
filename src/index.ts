import { config as dotenvConfig } from 'dotenv'

import Server from './server'

dotenvConfig()

const server = new Server()
  .start()
  .then((port) => console.log(`Server is running on port ${port}`))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

export default server
