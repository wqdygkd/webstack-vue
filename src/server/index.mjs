import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Low, JSONFile } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Use JSON file for storage
const file = join(__dirname, '../db/db.json')
const adapter = new JSONFile(file)
const database = new Low(adapter)

// Read data from JSON file, this will set db.data content
await database.read()

// db.data ||= { data: [] }
// db.data = db.data || { posts: [] } // for node < v15.x

// You can also use this syntax if you prefer
// const { data } = db.data
// data.push({
//     a: 1
// })

// Write db.data content to db.json
// await db.write()

async function getData (value) {
  await database.read()
  return database.data
}

async function addCategory (value) {
  await database.read()
  const { category, web } = database.data
  const { parentId, id } = value

  if (parentId) {
    const flag = category.some(item => {
      return item.parentId === parentId
    })

    if (!flag) {
      web.map(item => {
        if (item.categoryId === parentId) {
          item.categoryId = id
        }
        return item
      })
    }
  }

  category.push(value)
  await database.write()
  return true
}

async function updateCategory (value) {
  await database.read()
  const { category } = database.data
  const target = category.find(item => item.id === value.id)
  if (!target) return false
  for (const key in value) {
    if (key === 'id') continue
    if (value[key] === undefined) continue
    target[key] = value[key]
  }

  await database.write()
  return true
}

async function deleteCategory (value) {
  await database.read()
  const { category } = database.data
  const index = category.findIndex(item => item.id === value.id)
  if (index === -1) return false
  category.splice(index, 1)
  await database.write()
  return true
}

async function addWeb (value) {
  await database.read()
  const { web } = database.data
  web.push(value)
  await database.write()
  return true
}

async function updateWeb (value) {
  await database.read()
  const { web } = database.data
  const target = web.find(item => item.id === value.id)
  if (!target) return false
  for (const key in value) {
    if (key === 'id') continue
    if (value[key] === undefined) continue
    target[key] = value[key]
  }

  await database.write()
  return true
}

async function deleteWeb (value) {
  await database.read()
  const { web } = database.data
  const index = web.findIndex(item => item.id === value.id)
  if (index === -1) return false
  web.splice(index, 1)
  await database.write()
  return true
}

export default {
  getData,
  addCategory,
  updateCategory,
  deleteCategory,
  addWeb,
  updateWeb,
  deleteWeb
}
