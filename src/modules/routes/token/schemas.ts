import { z } from 'zod'

export type TToken = z.infer<typeof tokenSchema>
export const tokenSchema = z.object({
  id: z.string().cuid(),
  token: z.string().uuid(),
  expiresAt: z.nullable(z.date()),
  createdAt: z.date()
})

export type TPaginedTokensSchema = z.infer<typeof paginatedTokensSchema>
export const paginatedTokensSchema = z.object({
  page: z.number(),
  tokens: z.array(tokenSchema)
})

export type TCreateTokenSchema = z.infer<typeof createTokenSchema>
export const createTokenSchema = z.object({
  expiresAt: z.nullable(z.date())
})

export type TSelectTokenSchema = z.infer<typeof selectTokenSchema>
export const selectTokenSchema = z.object({
  id: z.string().cuid()
})
