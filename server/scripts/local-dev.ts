import { randomBytes } from 'node:crypto'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

// Explicit development mode: real MongoDB with ephemeral data, never a mock API.
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.JWT_SECRET = process.env.JWT_SECRET || randomBytes(48).toString('hex')
process.env.MONGOMS_DOWNLOAD_DIR = resolve('.cache/mongodb-binaries')
const mongo = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: 'wiredTiger' },
})
process.env.MONGODB_URI = mongo.getUri('biblioteca')
const { app } = await import('../app.js')
const { seedCatalog } = await import('./seed.js')
const { User } = await import('../features/members/user.model.js')
const { getPolicy } = await import('../features/policies/policy.model.js')
const { default: argon2 } = await import('argon2')
await mongoose.connect(process.env.MONGODB_URI)
await seedCatalog()
await getPolicy()
const password = process.env.LOCAL_TEST_ADMIN_PASSWORD || randomBytes(12).toString('base64url')
await User.create({
  name: 'Library Administrator',
  email: 'admin@biblioteca.local',
  passwordHash: await argon2.hash(password),
  role: 'admin',
})
const apiPort = Number(process.env.PORT || 4000)
const apiServer = app.listen(apiPort, '127.0.0.1', () =>
  console.log(
    `Local development API: http://localhost:${apiPort}\nTemporary administrator: admin@biblioteca.local\nTemporary password: ${password}\nThis development database is discarded when the process stops.`,
  ),
)
const frontend = process.argv.includes('--api-only')
  ? null
  : spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
      stdio: 'inherit',
      windowsHide: true,
    })
let stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  frontend?.kill()
  apiServer.close()
  await mongoose.disconnect()
  await mongo.stop()
  process.exit()
}
process.on('SIGINT', () => {
  void stop()
})
process.on('SIGTERM', () => {
  void stop()
})
frontend?.on('exit', () => {
  void stop()
})
