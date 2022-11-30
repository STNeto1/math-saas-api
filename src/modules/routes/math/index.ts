import {
  FastifyInstance,
  FastifyPluginOptions
} from 'fastify'
import fp from 'fastify-plugin'
import zodToJsonSchema from 'zod-to-json-schema'
import { sumResponseSchema, TTwoNumbersSchema, twoNumbersSchema } from './schemas'


export default fp(
  async (server: FastifyInstance, _: FastifyPluginOptions, next: Function) => {
    server.route({
      url: '/math/sum',
      logLevel: 'warn',
      onRequest: [server.checkToken],
      method: ['POST'],
      schema: {
        body: zodToJsonSchema(twoNumbersSchema, 'twoNumbersSchema'),
        response: {
          200: zodToJsonSchema(sumResponseSchema, 'sumResponseSchema')
        }
      },
      handler: async (request, reply) => {
        const body = request.body as TTwoNumbersSchema

        return reply.status(200).send({
          sum: body.first + body.second
        })
      }
    })

    next()
  }
)
