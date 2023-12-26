const Order = require('../model/order.model')
class AliPayService {
    async produceOrder({ order_id, username, account, address, orderGoodsInfo, storeAccount }) {
        const newTime = new Date().toLocaleString()
        const res = await Order.create({
            order_id,
            order_buyer_name: username,
            order_buyer_account: account,
            create_time: newTime,
            order_goods_info: JSON.stringify(orderGoodsInfo),
            buyer_address: address,
            merchant_account: JSON.stringify(storeAccount)
        })
        return res ? res.dataValues : null
    }

}

module.exports = new AliPayService()