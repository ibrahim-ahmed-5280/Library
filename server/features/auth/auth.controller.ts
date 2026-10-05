import mongoose from 'mongoose'
import { sendSecurityLink } from './recovery.controller.js'
import type { RequestHandler } from 'express'
import argon2 from 'argon2'
import { clearRefresh, hashToken, issueTokens } from '../../shared/middleware/auth.js'
import { ApiError, requireRecord } from '../../shared/errors.js'
import { RefreshSession } from './refreshsession.model.js'
import { User } from '../members/user.model.js'
import { loginSchema, registerSchema } from '../../contracts/schemas.js'

export const postRegister: RequestHandler = async (req, res) => {
  const input = registerSchema.parse(req.body)
  const user = await mongoose.connection.transaction(async (session) => {
    const [created] = await User.create(
      [
        {
          role: 'member',
          name: input.name,
          email: input.email,
          passwordHash: await argon2.hash(input.password),
        },
      ],
      { session },
    )
    await sendSecurityLink(created, 'verify', session)
    return created
  })
  res.status(201).json(await issueTokens(user, res))
}

export const postLogin: RequestHandler = async (req, res) => {
  const input = loginSchema.parse(req.body)
  const user = await User.findOne({ email: input.email }).select('+passwordHash')
  if (
    !user ||
    !(await argon2.verify(user.passwordHash, input.password)) ||
    user.status !== 'active'
  )
    throw new ApiError(401, 'Email or password is incorrect, or the account is unavailable')
  res.json(await issueTokens(user, res))
}

export const postRefresh: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken
  if (typeof token !== 'string') throw new ApiError(401, 'Please sign in')
  const session = await RefreshSession.findOneAndDelete({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  })
  if (!session) {
    clearRefresh(res)
    throw new ApiError(401, 'Session expired')
  }
  const user = requireRecord(
    await User.findOne({ _id: session.user, status: 'active' }),
    'Account unavailable',
  )
  if ((session.authVersion ?? 0) !== (user.authVersion ?? 0))
    throw new ApiError(401, 'Session expired')
  res.json(await issueTokens(user, res))
}

export const postLogout: RequestHandler = async (req, res) => {
  if (typeof req.cookies.refreshToken === 'string')
    await RefreshSession.deleteOne({ tokenHash: hashToken(req.cookies.refreshToken) })
  clearRefresh(res)
  res.status(204).end()
}
