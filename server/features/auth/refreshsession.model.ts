import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const RefreshSession = mongoose.model(
  'RefreshSession',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      authVersion: { type: Number, default: 0 },
      tokenHash: { type: String, required: true, unique: true },
      expiresAt: { type: Date, required: true },
    },
    options,
  ),
)
RefreshSession.schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
