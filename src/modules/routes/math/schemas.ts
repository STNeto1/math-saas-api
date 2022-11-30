import { z } from 'zod'

export type TTwoNumbersSchema = z.infer<typeof twoNumbersSchema>
export const twoNumbersSchema = z.object({
  first: z.number(),
  second: z.number()
})

export type TSumResponseSchema = z.infer<typeof sumResponseSchema>
export const sumResponseSchema = z.object({
  sum: z.number()
})
