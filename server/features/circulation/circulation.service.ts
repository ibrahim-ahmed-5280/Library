import { queueEmail } from '../email/email.service.js'
import mongoose from 'mongoose'
import { Audit } from '../audit/audit.model.js'
import { Book } from '../inventory/book.model.js'
import { Copy } from '../inventory/copy.model.js'
import { Loan } from './loan.model.js'
import { Notification } from '../notifications/notification.model.js'
import { Reservation } from '../reservations/reservation.model.js'
import { User } from '../members/user.model.js'
import { getPolicy } from '../policies/policy.model.js'
import { ApiError, requireRecord } from '../../shared/errors.js'

export async function issueLoan(memberId: string, copyId: string, actorId: string) {
  const policy = await getPolicy()
  return mongoose.connection.transaction(async (session) => {
    const member = requireRecord(
      await User.findOneAndUpdate(
        { _id: memberId, status: 'active' },
        { $inc: { circulationVersion: 1 } },
        { returnDocument: 'after', session },
      ),
      'Active member not found',
    )
    if (
      (await Loan.countDocuments({ member: member._id, returnedAt: null }).session(session)) >=
      policy.maxLoans!
    )
      throw new ApiError(409, 'This member has reached the borrowing limit')
    if (
      await Loan.exists({
        member: member._id,
        returnedAt: null,
        dueAt: { $lt: new Date() },
      }).session(session)
    )
      throw new ApiError(409, 'Return overdue books before borrowing again')
    const copy = requireRecord(
      await Copy.findOneAndUpdate(
        { _id: copyId, status: 'available' },
        { $set: { status: 'on_loan' } },
        { returnDocument: 'after', session },
      ),
      'This copy is unavailable',
    )
    const book = requireRecord(
      await Book.findOneAndUpdate(
        { _id: copy.book, archived: false },
        { $inc: { circulationVersion: 1 } },
        { session, returnDocument: 'after' },
      ),
      'This title is archived',
    )
    const firstHold = await Reservation.findOne({ book: book._id, status: 'waiting' })
      .sort({ createdAt: 1, _id: 1 })
      .session(session)
    if (firstHold && String(firstHold.member) !== memberId)
      throw new ApiError(409, 'This title is reserved for another member')
    if (firstHold) {
      firstHold.status = 'fulfilled'
      await firstHold.save({ session })
    }
    const [loan] = await Loan.create(
      [
        {
          member: member._id,
          copy: copy._id,
          book: book._id,
          dueAt: new Date(Date.now() + policy.loanDays! * 86400000),
        },
      ],
      { session },
    )
    await Audit.create([{ actor: actorId, action: 'loan.issued', entity: String(loan._id) }], {
      session,
    })
    await Notification.create(
      [
        {
          member: memberId,
          message: `You borrowed ${book.title}. Due ${loan.dueAt.toISOString().slice(0, 10)}.`,
        },
      ],
      { session },
    )
    if (member.emailVerified)
      await queueEmail(
        member.email,
        'Your library loan',
        `You borrowed ${book.title}. Due ${loan.dueAt.toISOString().slice(0, 10)}.`,
        { session },
      )
    return loan
  })
}
export async function returnLoan(loanId: string, actorId: string) {
  return mongoose.connection.transaction(async (session) => {
    const loan = requireRecord(
      await Loan.findOneAndUpdate(
        { _id: loanId, returnedAt: null },
        { $set: { returnedAt: new Date() } },
        { session, returnDocument: 'after' },
      ),
      'Active loan not found',
    )
    await Copy.updateOne({ _id: loan.copy }, { $set: { status: 'available' } }, { session })
    await Book.updateOne({ _id: loan.book }, { $inc: { circulationVersion: 1 } }, { session })
    await User.updateOne({ _id: loan.member }, { $inc: { circulationVersion: 1 } }, { session })
    const hold = await Reservation.findOne({ book: loan.book, status: 'waiting' })
      .sort({ createdAt: 1, _id: 1 })
      .session(session)
    if (hold)
      await Notification.create(
        [
          {
            member: hold.member,
            message:
              'A title you reserved has been returned. Contact the library to arrange collection.',
          },
        ],
        { session },
      )
    await Audit.create([{ actor: actorId, action: 'loan.returned', entity: loanId }], { session })
    const reader = await User.findById(loan.member).session(session)
    if (reader?.emailVerified)
      await queueEmail(
        reader.email,
        'Library return recorded',
        'Your book return has been recorded. Thank you.',
        { session },
      )
    if (hold) {
      const waiting = await User.findById(hold.member).session(session)
      if (waiting?.emailVerified)
        await queueEmail(
          waiting.email,
          'A reserved title was returned',
          'A title you reserved has been returned. Contact the library to arrange collection.',
          { session },
        )
    }
    return loan
  })
}
export async function renewLoan(loanId: string, actorId: string, memberOnly: boolean) {
  const policy = await getPolicy()
  return mongoose.connection.transaction(async (session) => {
    const loan = requireRecord(
      await Loan.findOne({
        _id: loanId,
        returnedAt: null,
        ...(memberOnly ? { member: actorId } : {}),
      }).session(session),
      'Active loan not found',
    )
    await Book.updateOne({ _id: loan.book }, { $inc: { circulationVersion: 1 } }, { session })
    if (loan.dueAt < new Date()) throw new ApiError(409, 'Overdue loans cannot be renewed')
    if (loan.renewals! >= policy.maxRenewals!) throw new ApiError(409, 'Renewal limit reached')
    if (await Reservation.exists({ book: loan.book, status: 'waiting' }).session(session))
      throw new ApiError(409, 'Another reader has reserved this title')
    loan.dueAt = new Date(loan.dueAt.getTime() + policy.renewalDays! * 86400000)
    loan.renewals = loan.renewals! + 1
    await loan.save({ session })
    await Audit.create([{ actor: actorId, action: 'loan.renewed', entity: loanId }], { session })
    const reader = await User.findById(loan.member).session(session)
    if (reader?.emailVerified)
      await queueEmail(
        reader.email,
        'Library loan renewed',
        `Your loan was renewed. New due date: ${loan.dueAt.toISOString().slice(0, 10)}.`,
        { session },
      )
    return loan
  })
}
