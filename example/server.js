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
    if (!urlInfo) {
      response.writeHead(404)
      response.end()
      return
    }
    validateFiles(urlInfo.pathnames, (err, pathnames) => {
      if (err) {
        response.writeHead(404)
        response.end(err.message)
      } else {
        response.writeHead(200, {
          'Content-Type': urlInfo.mime
        })
        outputFiles(pathnames, response)
      }
    })
  }).listen(port)
}

function parseURL(root, url) {
  var urlArr = url.split('??'),
      dir = urlArr[0]
      
  try {
    var names = urlArr[1].split(',')
  } catch(err) {
    return null
  }

  var pathnames = names.map(name => path.join(root + dir + name))
  
  return {
    mime: MIME[path.extname(pathnames[0])],
    pathnames
  }
}

function validateFiles(pathnames, callback) {
  (function next(i, len) {
    if (i < len) {
      fs.stat(pathnames[i], (err, status) => {
        if (err) {
          callback(err)
        } else {
          if (status.isFile()) {
            next(i+1, len)
          } else {
            callback(new Error())
          }
        }
      })
    } else {
      callback(null, pathnames)
    }
  })(0,pathnames.length)
}

function outputFiles(pathnames, writer) {
  (function next(i, len) {
    if (i < len) {
      var reader = fs.createReadStream(pathnames[i])
      reader.pipe(writer, {end: false})
      reader.on('end', () => {
        next(i+1, len)
      })
    } else {
      writer.end()
    }
  })(0, pathnames.length)
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