const { where, Op } = require('sequelize')
const Goods = require('../../model/goods.model')

class goodsController {
    async getGoodsList(ctx) {
        const { offset, limit, keyWord } = ctx.query
        const res = await Goods.findAndCountAll({
            attributes: ['goods_id', 'goods_nums', 'goods_price', 'goods_size', 'goods_merchants', 'goods_image', 'goods_title', 'store_account', 'goods_state'],
            offset: parseInt(offset - 1),
            limit: parseInt(limit),
            where: {
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
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }
    async allGoodsData(ctx) {
        const res = await Goods.findAll({
            attributes: ['goods_id', 'goods_nums', 'goods_price', 'goods_size', 'goods_merchants', 'goods_image', 'goods_title', 'store_account', 'goods_state'],
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }
    async deleteSingleGoods(ctx) {
        const { goodsId } = ctx.request.body
        const res = await Goods.destroy({
            where: {
                goods_id: goodsId
            }
        })
        ctx.body = {
            code: '10000',
            message: '删除成功',
            result: ''
        }
    }
    // 修改商品的上下架状态
    async changeGoodsState(ctx) {
    }
    async getSingleGoodsData(ctx) {
        const goods_id = ctx.query.goods_Id
        const res = await Goods.findOne({
            attributes: ['goods_id', 'goods_image', 'goods_title', 'goods_price', 'goods_nums', 'goods_state'],
            where: {
                goods_id
            }
        })
        if (!res) {
            ctx.app.emit('error', goodsQueryError, ctx)
            return
        }
        ctx.body = {
            code: "10000",
            message: "商品查询成功",
            result: {
                ...res.dataValues
            }
        }
    }
    async editGoodsInfo(ctx) {
        const { goods_id, goods_title, goods_nums, goods_price, goods_state } = ctx.request.body
        let editObj = {}
        goods_title && Object.assign(editObj, { goods_title })
        goods_nums && Object.assign(editObj, { goods_nums })
        goods_price && Object.assign(editObj, { goods_price })
        goods_state && Object.assign(editObj, { goods_state })
        const res = await Goods.update({...editObj},{
            where: {
                goods_id
            }
        })
        if (!res[0]) {
            return ctx.app.emit('error', { code: '20001', message: '更新商品信息失败' })
        }
        ctx.body = {
            code: '10000',
            message: '更新商品信息成功'
        }
    }
}

module.exports = new goodsController()