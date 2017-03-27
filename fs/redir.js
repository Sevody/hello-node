let fs = require('fs')
let path = require('path')
const dist = '新编日语教程'
function travel(dir, cb) {
    fs.readdirSync(dir).forEach(file => {
        let filename = path.join(dir, file)
        if (fs.statSync(filename).isDirectory()) {
            travel(filename, cb)
        } else {
            return cb(filename)
        }
    })
}

function main(src, target) {
    let targetDir = path.join(target, dist)
    fs.mkdirSync(targetDir)
    travelCustom(src)
    function travelCustom(dir) {
        fs.readdirSync(dir).forEach(file => {
            let filename = path.join(dir, file)
            if (fs.statSync(filename).isDirectory()) {
                travelCustom(filename)
            } else {
                if (filename.indexOf(dist) !== -1) {
                    let distName = path.join(targetDir, file)
                    return fs.renameSync(filename, distName)
                }
            }
        })
    }
}

main(process.argv[2],process.argv[3])
