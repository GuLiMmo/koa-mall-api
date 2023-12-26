const { createOrderId, readStroeOrder, orderDelivery } = require('../services/order.service')
// 错误类型
const { parameterVerifError, updateError } = require('../constant/error/order.err.type')
const Order = require('../model/order.model')
const { Op } = require('sequelize')

class OrderController {
    // 创建订单
    async createdOrder(ctx) {
        const orderInfo = ctx.request.body
        const res = await createOrderId(orderInfo)
        if (!res) {
            ctx.app.emit('error', parameterVerifError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '创建订单成功',
            result: res
        }
    }
    // 读取所有订单
    async readingAllOrder(ctx) {
        const { merchant_account, limit, offset, keyWord } = ctx.request.body
        if (!merchant_account) {
            ctx.app.emit('error', parameterVerifError, ctx)
            return
        }
        const res = await readStroeOrder(merchant_account, limit, offset, keyWord)
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }
    // 发货
    async OrderDelivery(ctx) {
        const { order_id, order_logistics, buyer_address } = ctx.request.body
        const res = await orderDelivery(order_id, order_logistics, buyer_address)
        if (!res) {
            ctx.app.emit('error', updateError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '更新成功',
            result: ''
        }
    }

    // 买家
    // 读取当前账号已发货的订单
    async shippedGoods(ctx) {
        const { account } = ctx.request.body
        console.log(account);
        const res = await Order.findAll({
            attributes: ['order_id', 'order_goods_info', 'create_time', 'order_logistics'],
            where: {
                [Op.and]: [
                    { order_buyer_account: account },
                    { order_logistics: { [Op.not]: null } }
                ]
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }

    // 查询当前账号所有订单
    async getAllOrder(ctx) {
        const { account, keyWord } = ctx.request.body
        const res = await Order.findAll({
            where: {
                order_buyer_account: account,
                [Op.or]: [
                    {
                        merchant_account: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        order_id: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        order_goods_info: {
                            [Op.like]: `%${keyWord}%`
                        }
                    }
                ]
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }

    async deleteSingleData(ctx) {
        const { order_id } = ctx.request.body
        const res = await Order.destroy({
            where: {
                order_id
            }
        })
        if (!res) {
            ctx.app.emit('error', updateError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '更新成功',
            result: ''
        }
    }
}

module.exports = new OrderController()