// nanoid导入
const uuid = require("node-uuid");
// 支付宝sdk导入
const alipaySdk = require('../constant/alipay');
const aliPayMent = require('./alipay.controller/aliPayment');

class aliPayController {
    async paymentCon(ctx) {
        // 生成订单id
        const order_id = uuid.v1()
        // 解析订单价格、订单标题
        const { order_price, order_title, order_goods_info, store_account, username, account, address } = ctx.request.body
        // 订单基本信息
        const orderBasicInfo = JSON.stringify({
            username,
            account,
            address,
            order_title
        })
        const res = aliPayMent(order_id, order_price, order_title, orderBasicInfo, order_goods_info, store_account)
        //返回一个promise
        const result = await alipaySdk.exec(
            'alipay.trade.page.pay',
            {},
            { formData: res },
        );
        //对接支付宝成功，支付宝返回的数据
        ctx.body = result
    }
}

module.exports = new aliPayController()