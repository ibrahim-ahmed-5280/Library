import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const Notification = mongoose.model(
  'Notification',
  new Schema(
    {
      member: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
    },
    options,
  ),
)
