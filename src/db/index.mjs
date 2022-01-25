import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// db.data ||= { data: [] }
// db.data = db.data || { posts: [] } // for node < v15.x

// You can also use this syntax if you prefer
// const { data } = db.data
// data.push({
//     a: 1
// })

// Write db.data content to db.json
// await db.write()

async function getData(val) {
    await db.read()
    return db.data
}

async function addCategory(val) {
    await db.read()
    const { category,web } = db.data
    let { parentId, id } = val

    if (parentId) {
        let flag = category.some(item => {
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

    category.push(val)
    await db.write()
    return true
}

async function updateCategory(val) {
    await db.read()
    const { category } = db.data
    let target = category.find(item => item.id === val.id)
    if (!target) return false
    for(let key in val) {
        if (key === 'id') continue
        if (val[key] === undefined) continue
        target[key] = val[key]
    }

    await db.write()
    return true
}

async function deleteCategory(val) {
    await db.read()
    const { category } = db.data
    let index = category.findIndex(item => item.id === val.id)
    if (index === -1) return false
    category.splice(index, 1)
    await db.write()
    return true
}

async function addWeb(val) {
    await db.read()
    const { web } = db.data
    web.push(val)
    await db.write()
    return true
}

async function updateWeb(val) {
    await db.read()
    const { web } = db.data
    let target = web.find(item => item.id === val.id)
    if (!target) return false
    for(let key in val) {
        if (key === 'id') continue
        if (val[key] === undefined) continue
        target[key] = val[key]
    }

    await db.write()
    return true
}

async function deleteWeb(val) {
    await db.read()
    const { web } = db.data
    let index = web.findIndex(item => item.id === val.id)
    if (index === -1) return false
    web.splice(index, 1)
    await db.write()
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
