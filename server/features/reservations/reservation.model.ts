import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const Reservation = mongoose.model(
  'Reservation',
  new Schema(
    {
      member: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
      status: { type: String, enum: ['waiting', 'fulfilled', 'cancelled'], default: 'waiting' },
    },
    options,
  ),
)
Reservation.schema.index(
  { member: 1, book: 1 },
  { unique: true, partialFilterExpression: { status: 'waiting' } },
)
