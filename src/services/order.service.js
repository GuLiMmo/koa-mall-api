// Order模型导入
const { Op } = require('sequelize');
const Order = require('../model/order.model')

class OrderService {
    // 创建订单
    async createOrderId(OrederObj) {
        const res = await Order.create({
            ...OrederObj
        })
        return res ? res.dataValues : null
    }
    // 读取卖家所有订单
    async readStroeOrder(merchant_account, limit, offset, keyWord) {
        const res = await Order.findAndCountAll({
            offset: parseInt(offset) - 1,
            limit: parseInt(limit),
            where: {
                merchant_account: {
                    [Op.like]: `%${merchant_account}%`
                },
                [Op.or]: {
                    order_id: {
                        [Op.like]: `%${keyWord}%`
                    },
                    order_buyer_account: {
                        [Op.like]: `%${keyWord}%`
                    },
                }
            }
        });
        return res ? res : null
    }
    // 订单发货
    async orderDelivery(order_id, order_logistics, buyer_address) {
        let obj = {}
        order_logistics && Object.assign(obj, { order_logistics })
        buyer_address && Object.assign(obj, { buyer_address })
        const res = await Order.update({ ...obj }, {
            where: {
                order_id
            }
        });
        return res[0] ? true : false
    }
}

module.exports = new OrderService()