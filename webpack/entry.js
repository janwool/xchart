const fs = require('fs')


module.exports = path => {
    let entry = {}
    if(fs.existsSync(path)){
        let files = fs.readdirSync(path);
        console.log(files);
        files.map(item => {
            let currentPath = `${path}/${item}`
            if(fs.statSync(currentPath).isDirectory()) {
                if(fs.existsSync(`${currentPath}/index.jsx`)) {
                    entry[item] = `${currentPath}/index.jsx`
                } else if (fs.existsSync(`${currentPath}/index.js`)) {
                    entry[item] = `${currentPath}/index.js`
                }

            }
        })
    }
    return entry
}
