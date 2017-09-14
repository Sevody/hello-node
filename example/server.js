var fs = require('fs'),
    path = require('path'),
    http = require('http')

var MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript'
}

function main(argv) {
  var configPath = path.resolve(__dirname, argv[0])
  var config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      root = config.root
      port = config.port
  
  http.createServer((request, response) => {
    var urlInfo = parseURL(root, request.url)

    combineFiles(urlInfo.pathnames, (err, data) => {
      if (err) {
        response.writeHead(404)
        response.end(err.message)
      } else {
        response.writeHead(200, {
          'Content-Type': urlInfo.mime
        })
        response.end(data)
      }
    })
  }).listen(port)
}

function parseURL(root, url) {
  var urlArr = url.split('??'),
      dir = urlArr[0],
      names = urlArr[1].split(',')

  var pathnames = names.map(name => path.join(root + dir + name))
  
  return {
    mime: MIME[path.extname(pathnames[0])],
    pathnames
  }
}

function combineFiles(pathnames, callback) {
  var output = [];

  (function next(count, len) {
      pathnames.forEach(function(pathname) {
        fs.readFile(pathname, (err, data) => {
          if (err) {
            callback(err)
          } else {
            output.push(data)
            if (++count === len) {
              callback(null, Buffer.concat(output))
            }
            next(count, len)
          }
        })        
      });
  })(0, pathnames.length)
}

main(process.argv.slice(2))