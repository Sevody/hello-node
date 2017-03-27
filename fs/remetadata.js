const fs = require('fs')
const path = require('path')
const ffmetadata = require('ffmetadata')

function remetadata(dir) {
    fs.readdirSync(dir).map((filename) => {
        const filepath = path.join(dir, filename)
        let data = {
            title: filename.split('.')[0],
            artist: '丸尾达',
            album: '新编日语教程'
        }
        let atmpath = path.join(dir, '../nico.png')
        let op = {
            "id3v2.3": true,
            attachments: [atmpath]
        }
        ffmetadata.write(filepath, data, op, (err) => {
            if (err) throw err
            else console.log('rewrite', op)
        })
        // ffmetadata.read(filepath, (err, data) => {
        //     if (err) throw err
        //     else console.log('rewrite', data)
        // })
    })
}

remetadata(process.argv[2])
