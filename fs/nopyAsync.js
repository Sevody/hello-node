var fs = require('fs')

function nopy2(src, dist) {
    var rs = fs.createReadStream(src);
    var ws = fs.createWriteStream(dist);

    rs.on('data', chunk => {
        if (ws.write(chunk) === false) {
            rs.pause()
        }
    })

    ws.on('end', () => {
        ws.end()
    })

    ws.on('drain', () => {
        rs.resume()
    })
}

function main(args) {
    nopy2(args[0], args[1])
}

main(process.argv.slice(2))
