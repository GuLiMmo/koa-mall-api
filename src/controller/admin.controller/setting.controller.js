const headImg = require('../../model/headImg.model')
const Classify = require('../../model/classify.model')
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid')

class settingController {
    async getHeadImgList(ctx) {
        const res = await headImg.findAll()
        ctx.body = {
            code: '10000',
            message: '获取头图列表成功',
            result: res
        }
    }
    async getClassifyTags(ctx) {
        const res = await Classify.findAll()
        const classifyList = {}
        res.forEach(item => {
            if (!classifyList[item.tags] && typeof classifyList[item.tags] === 'undefined') {
                classifyList[item.tags] = [item]
            } else {
                classifyList[item.tags].push(item)
            }
        })
        ctx.body = {
            code: '10000',
            message: '获取商品分类成功',
            result: res
        }
    }
    // 上传头图
    async uploadHeadImg(ctx) {
        const { file } = ctx.request.files
        // 创建文件可读流
        const readerStream = fs.createReadStream(file.filepath)
        // 重新命名文件
        const newFileName = uuid() + '.' + file.originalFilename.split('.')[1]    // 上传文件重命名的名字
        // 写入地址
        const uploadPath = path.join(__dirname, '../../uploads/headImage') + `/${newFileName}`;
        const url = `http://127.0.0.1:3000/headImage/${newFileName}`
        const res = await headImg.create({
            headImg_name: newFileName,
            headImg_url: url
        })
        if (res.dataValues) {
            // 创建写入流，将图片写入
            const upStream = fs.createWriteStream(uploadPath);
            // 可读流通过管道写入可写流
            readerStream.pipe(upStream);
            ctx.body = {
                code: "10000",
                message: "上传成功",
                imageInfo: {
                    headImg_name: newFileName,
                    headImg_url: url
                }
            }
            return
        }
        ctx.app.emit('error', { code: '20001', message: '出现未知错误！！', result: '' }, ctx)
    }
    // 删除头图
    async deleteHeadImage(ctx) {
        const { id, name } = ctx.request.body
        fs.unlink(`./src/uploads/headImage/${name}`, (err, data) => {
            if (err) {
                return ctx.app.emit('error', { code: '20001', message: '删除头图失败' }, ctx)
            }
        })
        const res = await headImg.destroy({
            where: {
                headImg_id: id
            }
        })
        if (!res) {
            return ctx.app.emit('error', { code: '20001', message: '删除头图失败' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '删除头图成功',
            result: ''
        }
    }

}

module.exports = new settingController()