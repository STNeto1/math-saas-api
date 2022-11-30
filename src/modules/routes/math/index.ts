import {
  FastifyInstance,
  FastifyPluginOptions
} from 'fastify'
import fp from 'fastify-plugin'
import zodToJsonSchema from 'zod-to-json-schema'
import { divisionResponseSchema, multiplicationResponseSchema, subtractionResponseSchema, sumResponseSchema, TTwoNumbersSchema, TTwoNumbersWithGtZeroSchema, twoNumbersSchema, twoNumbersWithGtZero } from './schemas'


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

    server.route({
      url: '/math/subtraction',
      logLevel: 'warn',
      onRequest: [server.checkToken],
      method: ['POST'],
      schema: {
        body: zodToJsonSchema(twoNumbersSchema, 'twoNumbersSchema'),
        response: {
          200: zodToJsonSchema(subtractionResponseSchema, 'subtractionResponseSchema')
        }
      },
      handler: async (request, reply) => {
        const body = request.body as TTwoNumbersSchema

        return reply.status(200).send({
          subtraction: body.first - body.second
        })
      }
    })

    server.route({
      url: '/math/multiplication',
      logLevel: 'warn',
      onRequest: [server.checkToken],
      method: ['POST'],
      schema: {
        body: zodToJsonSchema(twoNumbersSchema, 'twoNumbersSchema'),
        response: {
          200: zodToJsonSchema(multiplicationResponseSchema, 'multiplicationResponseSchema')
        }
      },
      handler: async (request, reply) => {
        const body = request.body as TTwoNumbersSchema

        return reply.status(200).send({
          multiplication: body.first * body.second
        })
      }
    })

    server.route({
      url: '/math/division',
      logLevel: 'warn',
      onRequest: [server.checkToken],
      method: ['POST'],
      schema: {
        body: zodToJsonSchema(twoNumbersWithGtZero, 'twoNumbersWithGtZero'),
        response: {
          200: zodToJsonSchema(divisionResponseSchema, 'divisionResponseSchema')
        }
      },
      handler: async (request, reply) => {
        const body = request.body as TTwoNumbersWithGtZeroSchema

        return reply.status(200).send({
          division: body.first / body.second
        })
      }
    })

    next()
  }
)
