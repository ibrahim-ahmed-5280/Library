import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const Policy = mongoose.model(
  'Policy',
  new Schema(
    {
      key: { type: String, unique: true, default: 'library' },
      loanDays: { type: Number, default: 21 },
      maxLoans: { type: Number, default: 5 },
      maxRenewals: { type: Number, default: 2 },
      renewalDays: { type: Number, default: 14 },
    },
    options,
  ),
)
export async function getPolicy() {
  return Policy.findOneAndUpdate(
    { key: 'library' },
    { $setOnInsert: { key: 'library' } },
    { upsert: true, returnDocument: 'after' },
  )
}
