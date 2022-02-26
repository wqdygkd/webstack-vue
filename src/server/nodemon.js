const nodemon = require('nodemon')

nodemon({
  script: 'src/server/server.mjs',
  ext: 'js mjs json'
})

nodemon.on('start', function () {
  console.log('App has started')
}).on('quit', function () {
  console.log('App has quit')
  throw Error
}).on('restart', function (files) {
  console.log('App restarted due to:', files)
})
