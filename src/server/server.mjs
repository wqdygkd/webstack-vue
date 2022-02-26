import express from 'express'
import bodyParser from 'body-parser'
import { customAlphabet } from 'nanoid'

import database from './index.mjs'

const nanoid = customAlphabet('1234567890abcdef', 10)

const app = express()
const routers = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

routers.get('/data', async (request, res) => {
  res.json(await database.getData)
})

routers.post('/add-category', async (request, res) => {
  const { parentId, name, icon } = request.body
  const flag = await database.addCategory({
    id: nanoid(),
    parentId,
    name,
    icon
  })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})

routers.post('/update-category', async (request, res) => {
  const { id, parentId, name, icon } = request.body
  const flag = await database.updateCategory({ id, parentId, name, icon })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})

routers.post('/delete-category', async (request, res) => {
  const { id } = request.body
  const flag = await database.deleteCategory({ id })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})

routers.post('/add-web', async (request, res) => {
  const { categoryId, url, logo, name, desc } = request.body
  const flag = await database.addWeb({
    id: nanoid(),
    categoryId,
    url,
    logo,
    name,
    desc
  })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})
routers.post('/update-web', async (request, res) => {
  const { id, categoryId, url, logo, name, desc } = request.body
  const flag = await database.updateWeb({ id, categoryId, url, logo, name, desc })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})

routers.post('/delete-web', async (request, res) => {
  const { id } = request.body
  const flag = await database.deleteWeb({ id })

  if (!flag) return res.json({ code: -1 })
  res.json({ code: 0 })
})

routers.post('/upload-logo', async (request, res) => {
  // TODO:
})

app.use('/', routers)
app.listen(8088, () => {
  console.log('server is running...')
})
