const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const file = path.join(__dirname, '../db/db.json')

const router = jsonServer.router(file)
const middlewares = jsonServer.defaults()

server.use(middlewares)
// server.use((request, res, next) => {
//   if (isAuthorized(request)) { // add your authorization logic here
//     next() // continue to JSON Server router
//   } else {
//     res.sendStatus(401)
//   }
// })
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
