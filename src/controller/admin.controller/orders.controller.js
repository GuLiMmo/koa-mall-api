const { Op } = require('sequelize');
const Order = require('../../model/order.model')
const { cloneDeep } = require('lodash')
class orderController {
    async getOrdersList(ctx) {
        const { offset, limit, keyWord } = ctx.query
        const res = await Order.findAndCountAll({
            offset: parseInt(offset - 1),
            limit: parseInt(limit),
            where: {
                [Op.or]: [
                    {
                        order_id: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        merchant_account: {
                            [Op.like]: `%${keyWord}%`
                        },
                    }
                ]
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }
    async getAllOrdersList(ctx) {
        const res = await Order.findAll()
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }
    async deleteSingleOrder(ctx) {
        const { order_id } = ctx.request.body
        const res = await Order.destroy({
            where: {
                order_id
            }
        })
        if (!res) {
            return ctx.app.emit('error', { code: '20001', message: '删除订单失败！！' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '删除订单成功！！'
        }
    }
    async updataOrder(ctx) {
        const { order_id, order_logistics, order_goods_info, order_state } = ctx.request.body
        let Obj = {}
        order_logistics && Object.assign(Obj, { order_logistics })
        order_goods_info && Object.assign(Obj, { order_goods_info })
        order_state && Object.assign(Obj, { order_state })
        const res = await Order.update({ ...Obj },{
            where: {
                order_id
            }
        })
        if (!res[0]) {
            return ctx.app.emit('error', { code: '20001', message: '更新订单失败！！' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '更新订单成功！！'
        }
    }
}

module.exports = new orderController()