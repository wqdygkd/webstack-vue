import express from 'express'
import bodyParser from 'body-parser'
import { customAlphabet } from 'nanoid'

import db from './index.mjs'

const nanoid = customAlphabet('1234567890abcdef', 10)

const app = express()
const routers = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

routers.get('/data', async (req, res) => {
    res.json(await db.getData)
})

routers.post('/add-category', async (req,res) => {
    let { parentId, name, icon } = req.body
    let flag = await db.addCategory({
        id: nanoid(),
        parentId, name, icon
    })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})

routers.post('/update-category', async (req,res) => {
    let { id, parentId, name, icon } = req.body
    let flag = await db.updateCategory({ id, parentId, name, icon })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})

routers.post('/delete-category', async (req,res) => {
    let { id } = req.body
    let flag = await db.deleteCategory({ id })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})

routers.post('/add-web',async (req,res) => {
    let { categoryId,url,logo,  name, desc } = req.body
    let flag = await db.addWeb({
        id: nanoid(),
        categoryId, url,logo, name, desc
    })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})
routers.post('/update-web', async (req,res) => {
    let { id, categoryId,url,logo,  name, desc} = req.body
    let flag = await db.updateWeb({id, categoryId,url,logo,  name, desc })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})

routers.post('/delete-web', async (req,res) => {
    let { id } = req.body
    let flag = await db.deleteWeb({ id })

    if (!flag) return res.json({ code: -1 })
    res.json({ code: 0 })
})

app.use('/', routers)
app.listen(8088, ()=>{
    console.log('server is running...');
})
