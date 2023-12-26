const { addGoodError, goodsQueryError, saveGoodsError, addGoodsCarError, getGoodsCarError, deleteGoodsError } = require("../constant/error/goods.err.type")
const { createGoodsInfoService, pagingQueryGoodsService, singleGoodsQueryService, goodsSearchService, addGoodsCarService, getGoodsCarListService, randRemmGoodsService, deleteGoodsCarDataService } = require("../services/goods.service")
const { redisGet, redisSet, redisHmGet, removeRedisKey, redisHmSet } = require('../db/redis/rdsConn')
const { default: axios } = require("axios")
const Goods = require("../model/goods.model")
const { Op } = require("sequelize")
const uuid = require('node-uuid')
const fs = require('fs')
const path = require('path')
const Store = require('../model/store.model')
class GoodsController {
    // 添加商品
    async createGoodsInfoCon(ctx) {
        const rest = ctx.request.body
        const res = await createGoodsInfoService(rest)
        if (!res) {
            ctx.app.emit("error", addGoodError, ctx)
            return
        }
        ctx.body = {
            code: "10000",
            message: "添加商品成功"
        }
    }
    // 首页货物分页查询
    async HomePageGoodsCon(ctx) {
        const { startNums, endNums } = ctx.query
        const res = await pagingQueryGoodsService(startNums * 1, endNums * 1)
        if (!res) {
            ctx.app.emit('error', goodsQueryError, ctx)
            return
        }
        // 剔除多余项
        res.map((item, index) => {
            let { goods_id, goods_image, goods_title, goods_price } = item
            res[index] = { goods_id, goods_image, goods_title, goods_price }
        })
        ctx.body = {
            code: "10000",
            message: "商品查询成功",
            result: [
                ...res
            ]
        }
    }
    // 单个商品查询
    async singleGoodsQueryCon(ctx) {
        const goods_id = ctx.query.id
        const res = await singleGoodsQueryService(goods_id)
        if (!res) {
            ctx.app.emit('error', goodsQueryError, ctx)
            return
        }
        ctx.body = {
            code: "10000",
            message: "商品查询成功",
            result: {
                ...res
            }
        }
    }
    // 商品浏览历史添加
    async addGoodsHistoryCon(ctx) {
        const { uuid, history } = ctx.request.body
        // 保存到redis中的key
        let key = uuid + 'shistory'
        // 剔除储存信息中的多余项
        let { goods_id, goods_image, goods_title, goods_price } = history
        // 获取当前时间
        const nowDate = new Date()
        let nowYear = nowDate.getFullYear()
        let nowMonth = nowDate.getMonth() + 1
        let nowDay = nowDate.getDate()
        // 将对象转换为str对象之前的对象
        let oldHistory = { goods_id, goods_image, goods_title, goods_price, add_time: `${nowYear}-${nowMonth}-${nowDay}` }
        // 读取redis中是否已经存在当前的key值
        const redisData = await redisGet(key)
        // 如果redis中不存在值，则直接创建数组存入
        try {
            if (!redisData) {
                // 转换为str
                let newHistory = JSON.stringify(oldHistory)
                redisSet(key, `[${newHistory}]`)
            } else {    // 如果存在则先读出，在存
                let newRedisData = JSON.parse(redisData)
                newRedisData.push(oldHistory)
                let strRedisData = JSON.stringify(newRedisData)
                // 将数据存入redis，周期为7天
                console.log(key);
                redisSet(key, strRedisData, 60 * 60 * 60 * 24 * 7)
            }
            ctx.body = {
                code: '10000',
                message: '保存历史记录成功'
            }
        } catch (error) {
            ctx.app.emit('error', saveGoodsError, ctx)
        }
    }
    // 获取浏览历史
    async getGoodsHistoryCon(ctx) {
        const { uuid } = ctx.request.body
        let key = uuid + 'shistory'
        // 获取redis中的数据
        try {
            let redisData = await redisGet(key)
            let newRedisData = JSON.parse(redisData)
            // 将数组当中的每一项转换为str类型
            newRedisData.map((item, index) => {
                newRedisData[index] = JSON.stringify(item)
            })
            // set去重
            let duplicateRemoval = new Set(newRedisData)
            // 转换为普通数组
            let dataArr = Array.from(duplicateRemoval)
            // 将数组中的每一项转为obj
            dataArr.map((item, index) => {
                dataArr[index] = JSON.parse(item)
            })
            // 保存归类的对象
            let timeClassify = {}
            // 将加入时间作为key
            dataArr.map(item => {
                const addTime = item.add_time
                if (typeof timeClassify[addTime] === 'undefined') {
                    timeClassify[addTime] = []
                    timeClassify[addTime].push(item)
                } else {
                    timeClassify[addTime].push(item)
                }
            })
            ctx.body = {
                code: '10000',
                message: '获取商品数据成功',
                result: timeClassify
            }
        } catch (error) {
            ctx.app.emit('error', goodsQueryError, ctx)
        }

    }
    // 商品搜索
    async goodsSearchCon(ctx) {
        const { searchTypeVal, searchInfoVal } = ctx.query
        const res = await goodsSearchService(searchTypeVal, searchInfoVal)
        if (!res) {
            ctx.app.emit('error', saveGoodsError, ctx)
            return
        }
        ctx.body = {
            code: "10000",
            message: "搜索商品成功",
            result: [
                ...res
            ]
        }
    }
    // 加入购物车
    async addGoodsCarCon(ctx) {
        const { uuid, goodsInfo } = ctx.request.body
        const res = await addGoodsCarService(uuid, goodsInfo)
        if (!res) {
            ctx.app.emit('error', addGoodsCarError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "添加购物车成功",
            result: ""
        }
    }
    // 读取redis中购物车的内容
    async getGoodsCarCon(ctx) {
        const { uuid } = ctx.query
        const res = await getGoodsCarListService(uuid)
        if (!res) {
            ctx.app.emit('error', getGoodsCarError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "读取购物车内容成功",
            result: {
                ...res
            }
        }
    }
    // 修改购物车中单件商品的数量
    async editGoodsCarSingleGoods(ctx) {
        const { uuid, goods_id, goods_size, goods_nums } = ctx.request.body
        const rdsKey = uuid + 'sgoodscar'
        try {
            const goodsCarList = await redisHmGet(rdsKey)
            const goods_arr = Object.values(goodsCarList).map(item => JSON.parse(item))
            let filterGoods = goods_arr.filter(item => item.goods_id === goods_id && item.goods_size === goods_size)
            goods_arr.forEach((item, index) => {
                if (item.goods_id === goods_id) {
                    goods_arr.splice(index, 1)
                }
            })
            let nums = parseInt(goods_nums)
            let newGoodsArr = []
            if (filterGoods.length > nums) {
                let arr = filterGoods.splice(0, goods_size)
                newGoodsArr = goods_arr.concat(arr)
            } else if (filterGoods.length < nums) {
                for (let index = 0; index < nums - 1; index++) {
                    filterGoods.push(filterGoods[0])
                }
                newGoodsArr = goods_arr.concat(filterGoods)
            }
            removeRedisKey(rdsKey)
            newGoodsArr.forEach((item, index) => {
                redisHmSet(rdsKey, index, JSON.stringify(item))
            })
            ctx.body = {
                code: '10000',
                message: '修改成功',
                result: ''
            }
        } catch (error) {
            ctx.body = {
                code: '20001',
                message: '修改失败',
                result: error
            }
        }
    }
    // 随机推荐商品
    async randRemmGoodsCon(ctx) {
        const res = await randRemmGoodsService()
        if (!res) {
            ctx.app.emit('error', goodsQueryError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "数据获取成功",
            result: [
                ...res
            ]
        }
    }
    // 物流查询api
    async queryExpressCon(ctx) {
        const { orderNums } = ctx.request.body
        const res = await axios.get(`http://www.kuaidi.com/index-ajaxselectcourierinfo-${orderNums}--KUAIDICODE1666945159391.html`)
        console.log(res);
    }
    // 商品删除
    async deleteSingleGoodsCon(ctx) {
        const { goods_id, uuid, goods_size } = ctx.request.body
        // 读取redis
        const res = await deleteGoodsCarDataService({ goods_id, goods_size, uuid })
        if (!res) {
            ctx.app.emit('error', deleteGoodsError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "当前商品删除成功",
            result: {}
        }
    }
    // 查询商品分类
    async queryGoodsClassify(ctx) {
        console.log(ctx.query);
        const { keyWord } = ctx.query
        const res = await Goods.findAll({
            where: {
                goods_tags: {
                    [Op.like]: `%${keyWord}%`
                }
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }

    // 上传商品
    async uploadGoodsImage(ctx) {
        const { file } = ctx.request.files
        // 文件写入
        const reader = fs.createReadStream(file.filepath);   // 创建文件可读流
        // 重命名上传文件
        const uploadData = new Date() //获取当前时间
        const newFileName = uuid() + '.' + file.originalFilename.split('.')[1]    // 上传文件重命名的名字
        // 写入地址
        const uploadPath = path.join(__dirname, '../uploads/goods') + `/${newFileName}`;
        // 将图片地址放入obj当中
        let url = `http://127.0.0.1:3000/goods/${newFileName}`
        // 创建写入流，将图片写入
        const upStream = fs.createWriteStream(uploadPath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        // 注册成功返回信息
        ctx.body = {
            uuid: uuid(),
            status: 'done',
            name: newFileName,
            url
        }

    }
    // 删除图片
    async deleteGoodsImage(ctx) {
        const { fileName } = ctx.request.body
        fs.unlink(`./src/uploads/goods/${fileName}`, (err, data) => {
            if (err) {
                return ctx.app.emit('error', { code: '20001', message: '删除头图失败' }, ctx)
            }
        })
        ctx.body = {
            code: '10000',
            message: '删除图片成功！'
        }
    }

    async storeAddGoods(ctx) {
        let { goods_image, goods_title, goods_price, goods_nums, goods_tags, goods_size, goods_image_arr, store_account } = ctx.request.body
        goods_nums = parseInt(goods_nums)
        goods_tags = JSON.stringify(goods_tags)
        goods_size = JSON.stringify(goods_size)
        goods_image_arr = JSON.stringify(goods_image_arr)
        const res = await Store.findOne({
            where: {
                business_account: store_account
            }
        })
        if (!res.dataValues) {
            return ctx.app.emit('error', { code: '20001', message: '添加失败' }, ctx)
        }
        let goods_merchants = res.business_name
        const result = await Goods.create({
            goods_image,
            goods_title,
            goods_price,
            goods_nums,
            goods_tags,
            goods_size,
            goods_image_arr,
            store_account,
            goods_merchants
        })
        if (!result.dataValues) {
            return ctx.app.emit('error', { code: '20001', message: '添加失败' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '添加商品成功！！'
        }
    }

    async getPainGoodsList(ctx) {
        const { offset, limit, keyWord, account } = ctx.query
        const res = await Goods.findAndCountAll({
            attributes: ['goods_id', 'goods_nums', 'goods_price', 'goods_tags', 'goods_size', 'goods_merchants', 'goods_image', 'goods_title', 'store_account', 'goods_state', 'goods_image_arr'],
            offset: parseInt(offset - 1),
            limit: parseInt(limit),
            where: {
                store_account: account,
                [Op.or]: [
                    {
                        goods_title: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        goods_merchants: {
                            [Op.like]: `%${keyWord}%`
                        },
                    }
                ]
            }
        })
        res.rows.forEach(item => {
            item.goods_size = JSON.parse(item.goods_size)
            item.goods_tags = JSON.parse(item.goods_tags)
            item.goods_image_arr = JSON.parse(item.goods_image_arr)
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }

    async updataGoodsData(ctx) {
        const { goods_id, goods_title, goods_nums, goods_price, goods_tags, goods_size, goods_image, goods_state } = ctx.request.body
        let obj = {}
        goods_title && Object.assign(obj, { goods_title })
        goods_nums && Object.assign(obj, { goods_nums })
        goods_price && Object.assign(obj, { goods_price })
        goods_tags && Object.assign(obj, { goods_tags: JSON.stringify(goods_tags) })
        goods_size && Object.assign(obj, { goods_size: JSON.stringify(goods_size) })
        goods_image && Object.assign(obj, { goods_image })
        goods_state && Object.assign(obj, { goods_state })
        const res = await Goods.update({ ...obj }, {
            where: {
                goods_id
            }
        })
        if (!res[0]) {
            ctx.app.emit('error', { code: '20001', message: '数据更新失败！' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '数据更新成功！'
        }
    }
}


module.exports = new GoodsController()