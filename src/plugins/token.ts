import { isBefore } from 'date-fns'
import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  onRequestHookHandler
} from 'fastify'
import fp from 'fastify-plugin'

import { parseQueryParams } from '../utils/parse-query-params'

declare module 'fastify' {
  interface FastifyInstance {
    checkToken: onRequestHookHandler
  }
}

const jwtPlugin: FastifyPluginAsync = fp(async (server, _) => {
  server.decorate(
    'checkToken',
    async (request: FastifyRequest, reply: FastifyReply) => {
      let valid = false
      const token = extractTokenFromSources(request)

      if (!token) {
        return reply.code(401).send({
          message: 'No token provided',
          status_code: 401
        })
      }

      try {
        const dbToken = await server.prisma.accessToken.findFirst({
          where: {
            token
          }
        })

        if (Boolean(dbToken)) {
          if (Boolean(dbToken?.expiresAt)) {            
            valid = isBefore(new Date(), dbToken?.expiresAt ?? new Date(-1))
          } else {
            valid = true
          }
        }

        if (!valid) {
          return reply.code(401).send({
            message: 'Token is invalid',
            status_code: 401
          })
        }
      } catch (error) {
        return reply.code(401).send({
          message: 'Error while checking token',
          status_code: 401
        })
      }
    }
  )
})

export default jwtPlugin

const extractTokenFromSources = (request: FastifyRequest): string | null => {
  const headers = request.headers
  const token = headers['x-token']
  if (Boolean(token) && typeof token === 'string') {
    return token
  }

  const params = parseQueryParams(request.raw.url ?? '')
  const urlToken = params['token']
  if (Boolean(urlToken)) {
    return urlToken
  }

  return null
}
