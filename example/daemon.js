var cp = require('child_process')
function spawn(server, config) {
  var worker = cp.spawn('node', [ server, config ])
  worker.on('exit', function(code) {
    if (code !== 0) {
      spawn(server, config)
    }
  })
}
function main(argv) {
  spawn('example/server.js', argv[0])
  process.on('exit', function() {
    worker.kill()
    process.exit(0)
  })
}

main(process.argv.slice(2))