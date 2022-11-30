import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { JwtPayload } from '../auth/schemas'
import {
  createTokenSchema,
  paginatedTokensSchema,
  selectTokenSchema,
  TCreateTokenSchema,
  TSelectTokenSchema
} from './schemas'

export default fp(
  async (server: FastifyInstance, _: FastifyPluginOptions, next: Function) => {
    server.route({
      url: '/token/generate',
      logLevel: 'warn',
      onRequest: [server.authenticate],
      method: ['POST'],
      schema: {
        body: zodToJsonSchema(createTokenSchema, 'createTokenSchema')
      },
      handler: async (request, reply) => {
        const payload = request.user as JwtPayload

        const user = await server.prisma.user.findUnique({
          where: {
            id: payload.sub
          }
        })

        if (!user) {
          return reply.status(401).send({
            message: 'Unauthorized'
          })
        }

        const body = request.body as TCreateTokenSchema
        await server.prisma.accessToken.create({
          data: {
            userId: user.id,
            expiresAt: body.expiresAt
          }
        })

        return reply.status(201).send()
      }
    })

    server.route({
      url: '/token/list',
      logLevel: 'warn',
      method: ['GET'],
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: zodToJsonSchema(paginatedTokensSchema, 'paginatedTokensSchema')
        }
      },
      handler: async (request, reply) => {
        const payload = request.user as JwtPayload

        const user = await server.prisma.user.findUnique({
          where: {
            id: payload.sub
          }
        })

        if (!user) {
          return reply.status(401).send({
            message: 'Unauthorized'
          })
        }

        const tokens = await server.prisma.accessToken.findMany({
          where: {
            userId: user.id
          },
          skip: 0,
          take: 10
        })

        return reply.send({
          page: 1,
          tokens
        })
      }
    })

    server.route({
      url: '/token/delete/:id',
      logLevel: 'warn',
      method: ['DELETE'],
      onRequest: [server.authenticate],
      schema: {
        params: zodToJsonSchema(selectTokenSchema, 'selectTokenSchema')
      },
      handler: async (request, reply) => {
        const payload = request.user as JwtPayload

        const user = await server.prisma.user.findUnique({
          where: {
            id: payload.sub
          }
        })

        if (!user) {
          return reply.status(401).send({
            message: 'Unauthorized'
          })
        }

        const { id } = request.params as TSelectTokenSchema
        const token = await server.prisma.accessToken.findFirst({
          where: {
            userId: user.id,
            id
          }
        })

        if (!token) {
          return reply.status(404).send({
            message: 'Token not found'
          })
        }

        await server.prisma.accessToken.delete({
          where: {
            id
          }
        })

        return reply.status(204).send()
      }
    })

    next()
  }
)
