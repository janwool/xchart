const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs');

module.exports = (dir) => {
    let ret = []
    if(fs.existsSync(dir)) {
        let files = fs.readdirSync(dir)
        files.map((item) => {
            let infoJson = {}, infoData = {}
            try{
                infoJson = fs.readFileSync(`${dir}/${item}/pageinfo.json`,'utf-8')
                infoData = JSON.parse(infoJson)
            }catch(err) {
                infoData = {}
            }
            ret.push(new HtmlWebpackPlugin({
                title: infoData.title?infoData.title: 'OkayChart',
                meta: {
                    keywords: infoData.keywords ? infoData.keywords : 'OkayChart, 数据可视化, 框架',
                    description: infoData.description ?infoData.description : 'OkayChart 数据可视化基础框架'
                },
                chunks: [`${item}`],
                inject: true,
                template: path.resolve(__dirname, '../template.html'),
                filename: item == 'index' ? 'index.html':`${item}.html`,
                minify: {
                    collapseWhitespace: true,
                    preserveLineBreaks: true
                }
            }))
        })
    }
    return ret
}
