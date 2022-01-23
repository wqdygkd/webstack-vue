import express from 'express'
import db from './index.mjs'
const app = express()

const routers = express.Router()
//使用express路由获得本地数据
routers.get('/data',(req,res) => {
    res.json({
        data: db.data
    })
})

app.use('/', routers)
app.listen(8081, ()=>{
    console.log('mock data is running...');
})
