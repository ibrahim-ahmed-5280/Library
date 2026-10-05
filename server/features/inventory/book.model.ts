import mongoose, { Schema } from 'mongoose'
const options = { timestamps: true }
export const Book = mongoose.model(
  'Book',
  new Schema(
    {
      title: { type: String, required: true },
      author: { type: String, required: true },
      isbn: { type: String, required: true, unique: true },
      genre: String,
      year: Number,
      description: String,
      coverId: { type: Schema.Types.ObjectId, ref: 'Cover', default: null },
      archived: { type: Boolean, default: false },
      circulationVersion: { type: Number, default: 0 },
    },
    options,
  ),
)
