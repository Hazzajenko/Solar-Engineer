const { writeFile } = require('fs')
const { promisify } = require('util')
const dotenv = require('dotenv')

dotenv.config()

const writeFilePromisified = promisify(writeFile)

const targetPath = './src/environments/environment.ts'

const envConfigFile = `export const environment = {
  auth0: {
    domain: '${process.env['AUTH0_DOMAIN']}',
    clientId: '${process.env['AUTH0_CLIENT_ID']}',
    authorizationParams: {
      audience: '${process.env['AUTH0_AUDIENCE']}',
      redirect_uri: '${process.env['AUTH0_CALLBACK_URL']}',
    },
  },
};
`

;(async () => {
  try {
    await writeFilePromisified(targetPath, envConfigFile)
  } catch (err) {
    console.error(err)
    throw err
  }
})()
