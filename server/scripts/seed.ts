import mongoose from 'mongoose'
import { config } from '../config/env.js'
import { Book } from '../features/inventory/book.model.js'
import { Copy } from '../features/inventory/copy.model.js'
import { allModels } from '../models.js'

const titles = [
  {
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    isbn: '9780385474542',
    genre: 'Fiction',
    year: 1958,
    description:
      'The story of Okonkwo and his community in late nineteenth-century Nigeria, exploring tradition, change, and the consequences of colonial rule.',
  },
  {
    title: 'A Room of One’s Own',
    author: 'Virginia Woolf',
    isbn: '9780156787338',
    genre: 'Essays',
    year: 1929,
    description:
      'An extended essay on women, writing, and the material conditions that make creative work possible.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Personal growth',
    year: 2018,
    description:
      'A practical exploration of how small changes and repeatable systems shape everyday habits.',
  },
  {
    title: 'The River and the Source',
    author: 'Margaret A. Ogola',
    isbn: '9789966466507',
    genre: 'Fiction',
    year: 1994,
    description:
      'A Kenyan family saga following generations of women through changing social expectations and personal challenges.',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    genre: 'Personal growth',
    year: 2020,
    description:
      'Stories about the decisions, expectations, and emotions that influence how people think about money.',
  },
  {
    title: 'We Should All Be Feminists',
    author: 'Chimamanda Ngozi Adichie',
    isbn: '9781101911761',
    genre: 'Essays',
    year: 2014,
    description:
      'A concise essay examining gender expectations and offering a personal perspective on equality.',
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9780156012195',
    genre: 'Children',
    year: 1943,
    description:
      'A small traveler visits different worlds and asks questions about friendship, responsibility, and what matters.',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    isbn: '9781455586691',
    genre: 'Personal growth',
    year: 2016,
    description: 'A guide to making space for focused work in a world of interruptions.',
  },
]
export async function seedCatalog() {
  for (const model of allModels) await model.init()
  for (const [index, title] of titles.entries()) {
    const book = await Book.findOneAndUpdate(
      { isbn: title.isbn },
      { $setOnInsert: title },
      { upsert: true, returnDocument: 'after' },
    )
    for (let copy = 1; copy <= 2; copy++)
      await Copy.updateOne(
        { barcode: `BIB-${String(index + 1).padStart(4, '0')}-${copy}` },
        {
          $setOnInsert: {
            book: book._id,
            shelf: `${title.genre.slice(0, 3).toUpperCase()} ${index + 1}`,
            status: 'available',
          },
        },
        { upsert: true },
      )
  }
}
if (process.argv[1]?.endsWith('seed.ts')) {
  try {
    await mongoose.connect(config.MONGODB_URI)
    await seedCatalog()
    console.log('Sample catalog seeded. Existing titles and copies were preserved.')
  } finally {
    await mongoose.disconnect()
  }
}
