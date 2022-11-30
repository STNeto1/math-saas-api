import { z } from 'zod'

export type TTwoNumbersSchema = z.infer<typeof twoNumbersSchema>
export const twoNumbersSchema = z.object({
  first: z.number(),
  second: z.number()
})

export type TTwoNumbersWithGtZeroSchema = z.infer<typeof twoNumbersWithGtZero>
export const twoNumbersWithGtZero = z.object({
  first: z.number(),
  second: z.number().gt(0)
})

export type TSumResponseSchema = z.infer<typeof sumResponseSchema>
export const sumResponseSchema = z.object({
  sum: z.number()
})

export type TSubtractionResponseSchema = z.infer<typeof subtractionResponseSchema>
export const subtractionResponseSchema = z.object({
  subtraction: z.number()
})

export type TMultiplicationResponseSchema = z.infer<typeof multiplicationResponseSchema>
export const multiplicationResponseSchema = z.object({
  multiplication: z.number()
})

export type TDivisionResponseSchema = z.infer<typeof divisionResponseSchema>
export const divisionResponseSchema = z.object({
  division: z.number()
})
