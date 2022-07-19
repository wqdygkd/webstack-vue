const nodemon = require('nodemon')

nodemon({
  script: 'src/server/json-server.js',
  ext: 'js mjs json'
})
// nodemon(('--routes routes.json "js json" src/server/json-server.js'))

nodemon.on('start', function () {
  console.log('App has started')
}).on('quit', function () {
  console.log('App has quit')
  throw Error
}).on('restart', function (files) {
  console.log('App restarted due to:', files)
})
