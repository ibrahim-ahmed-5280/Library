import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const User = mongoose.model(
  'User',
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true, select: false },
      role: { type: String, enum: ['member', 'librarian', 'admin'], default: 'member' },
      status: { type: String, enum: ['active', 'suspended'], default: 'active' },
      emailVerified: { type: Boolean, default: false },
      avatarId: { type: Schema.Types.ObjectId, ref: 'Cover', default: null },
      authVersion: { type: Number, default: 0 },
      savedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
      circulationVersion: { type: Number, default: 0 },
    },
    options,
  ),
)
