let fs = require('fs')
let path = require('path')
const prefix = '新编日语教程第五册'
function rename(target) {
    let dist = path.join(target, prefix)
    fs.mkdir(dist, 0755)
    fs.readdir(target, (err, Arrfilename) => {
        console.log("ArrFilename:", Arrfilename)
        if (err) console.log(err)
        Arrfilename.map(filename => {
            console.log("filename:", filename)
            let newFilename = `${prefix}${filename}`
            console.log("newFilename:", newFilename)
            let filepath = path.join(target, filename)
            if (fs.statSync(filepath).isDirectory()) return
            let newFilepath = path.join(dist, newFilename)
            fs.rename(filepath, newFilepath, (err, nfn) => {
                if (err) console.log(err)
            })
        })
    })
}
rename(process.argv[2])
