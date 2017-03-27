var fs = require('fs')

function copy (src, dist) {
    fs.writeFileSync(dist, new Buffer([0xee, 0x15, 0x6c, 0x6c, 0x3f]))
}

function streamCopy (src, dist) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dist))
}
function main (argv) {
    copy(argv[0], argv[1])
}


main(process.argv.slice(2))
