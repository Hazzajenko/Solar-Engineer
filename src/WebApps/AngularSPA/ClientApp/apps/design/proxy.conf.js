const { env } = require('process')

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(';')[0]
  : 'http://localhost:5045'

const PROXY_CONFIG = [
  {
    context: ['/weatherforecast'],
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive',
    },
  },
  {
    context: ['/api'],
    target: 'http://localhost:5001',
    secure: false,
    changeOrigin: true,
    headers: {
      Connection: 'Keep-Alive',
    },
    pathRewrite: {
      '^/api': '',
    },
  },
]
/*
"/api": {
  "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
    "^/api": ""
  }
},*/
module.exports = PROXY_CONFIG
