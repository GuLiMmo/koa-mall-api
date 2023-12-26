const Goods = require("../model/goods.model")
// 使用模糊查询需要先引入Op
const seq = require('sequelize');
const { redisHmGet, redisHmSet, removeRedisKey } = require("../db/redis/rdsConn");
const Op = seq.Op;

class GoodsService {
    // 添加商品
    async createGoodsInfoService(obj) {
        const res = await Goods.create({
            ...obj
        })
        return res ? res.dataValues : null
    }

    // 分页查询商品
    async pagingQueryGoodsService(offset, limit) {
        const { rows } = await Goods.findAndCountAll({
            offset,
            limit,
            where: {
                goods_state: true
            }
        });
        return rows.length !== 0 ? rows : null
    }

    // 单个商品查询
    async singleGoodsQueryService(goods_id) {
        const res = await Goods.findOne({
            where: {
                goods_id
            }
        })
        return res ? res.dataValues : null
    }

    // 商品查找
    async goodsSearchService(searchType, searchInfo) {
        let searchTag = searchType === '宝贝' ? 'goods_title' : 'goods_merchants'
        const res = await Goods.findAll({
            attributes: ['goods_id', 'goods_image', 'goods_title', 'goods_price', 'goods_merchants'],
            where: {
                goods_state: true,
                [searchTag]: {
                    [Op.like]: `%${searchInfo}%`
                }
            }
        })
        return res ? res : null
    }

    // 加入购物车
    async addGoodsCarService(uuid, goodsInfo) {
        // 使用uuid创建存入redis中的key
        const rdsKey = uuid + 'sgoodscar'
        // 读取redis中的数据
        const rdsGoodsList = await redisHmGet(rdsKey) || {}
        // 获取商品列表长度
        const rdsGoodsListLen = Object.keys(rdsGoodsList).length
        // 存入redis当中
        const addGoodsStatus = redisHmSet(rdsKey, rdsGoodsListLen, JSON.stringify(goodsInfo))
        return addGoodsStatus ? true : false
    }

    // 读取redis中购物车的内容
    async getGoodsCarListService(uuid) {
        // 当前账号key
        const rdsKey = uuid + 'sgoodscar'
        const goodsCarList = await redisHmGet(rdsKey)
        let goodsList = []
        let goodsGroup = {}
        if (goodsCarList != null) {
            Object.values(goodsCarList).forEach(item => {
                goodsList.push(JSON.parse(item))
            })
            // 店铺相同为一组
            goodsList.forEach(item => {
                item.goods_nums = item.goods_nums * 1
                if (!goodsGroup[item.store_account]) {
                    goodsGroup[item.store_account] = {
                        storeName: item.goods_merchants,
                        storeAccount: item.store_account,
                        list: [{
                            ...item
                        }]
                    }
                } else {
                    // 判断当前商品是否已经存在
                    const index = goodsGroup[item.store_account].list.findIndex(gi => gi.goods_id === item.goods_id && gi.goods_size === item.goods_size)
                    if (index < 0) {
                        goodsGroup[item.store_account].list.push(item)
                    } else {
                        // 寻找有没有相同尺寸的
                        const index2 = goodsGroup[item.store_account].list.findIndex(gi => gi.goods_id === item.goods_id && gi.goods_size === item.goods_size)
                        if (index2 < 0) {
                            goodsGroup[item.store_account].list.push(item)
                        } else {
                            goodsGroup[item.store_account].list[index].goods_nums = goodsGroup[item.store_account].list[index].goods_nums + item.goods_nums
                        }
                    }
                }
            })
        } else {
            goodsGroup = {}
        }

        return goodsGroup
    }

    // 个人中心货物随机推荐
    async randRemmGoodsService() {
        const res = await Goods.findAll({
            attributes: ['goods_id', 'goods_image', 'goods_title', 'goods_price', 'goods_merchants'],
            // 限制数据数量
            limit: 9,
            // 随机抽取数据
            order: [seq.literal("rand()")],
            where: {
                goods_state: true
            }
        })
        return res ? res : null
    }

    // 删除购物车中某个数据
    async deleteGoodsCarDataService({ goods_id, goods_size, uuid }) {
        console.log(goods_size);
        const rdsKey = uuid + 'sgoodscar'
        try {
            const goodsCarList = await redisHmGet(rdsKey)
            let goods_arr = Object.values(goodsCarList).map(item => JSON.parse(item))
            
            // goods_arr.forEach((item, index) => {
            //     if (item.goods_id === goods_id && item.goods_size === goods_size) {
            //             goods_arr.splice(index, 1)
            //     }
            // })
            const filterData = goods_arr.filter(item => item.goods_id !== goods_id || item.goods_size !== goods_size)
            removeRedisKey(rdsKey)
            filterData.forEach((item, index) => {
                redisHmSet(rdsKey, index, JSON.stringify(item))
            })
            return true
        } catch (error) {
            return false
        }
    }

}

module.exports = new GoodsService()