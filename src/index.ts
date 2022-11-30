import { fastify, FastifyInstance } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'

import authRoutes from './modules/routes/auth'
import tokenRoutes from './modules/routes/token'
import configPlugin from './plugins/config'
import jwtPlugin from './plugins/jwt'
import prismaPlugin from './plugins/prisma'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({ logger: true })

server.register(configPlugin)
server.register(prismaPlugin)
server.register(jwtPlugin)

server.register(authRoutes)
server.register(tokenRoutes)

const start = async () => {
  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0'
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

process.on('uncaughtException', (error) => {
  console.error(error)
})
process.on('unhandledRejection', (error) => {
  console.error(error)
})

start()
