const { redisHmSet } = require('../../db/redis/rdsConn')
// 支付宝自定的formData
const AlipayFormData = require('alipay-sdk/lib/form').default;


const aliPayMent = (order_id, order_price, order_title, userBasicInfo, orderGoodsInfo, storeAccount) => {
    //开始对接支付宝API
    const formData = new AlipayFormData()
    //调用 setMethod 并传入 get ， 会返回可以跳转到支付页面的url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
        //订单号
        outTradeNo: order_id,
        //写死的
        productCode: 'FAST_INSTANT_TRADE_PAY',
        //价格
        totalAmount: order_price,
        //商品名称
        subject: order_title,
        //商品详情
        body: '商品详情'
    });
    // 当支付完成后，当前页面跳转的地址
    // 将要传递的数据存入redis之中
    redisHmSet(order_id, 'userBasicInfo', userBasicInfo)
    redisHmSet(order_id, 'storeAccount', storeAccount)
    redisHmSet(order_id, 'orderGoodsInfo', orderGoodsInfo)
    formData.addField('returnUrl', `http://localhost:3000/pay/paySuccess/${order_id}`);
    return formData
}

module.exports = aliPayMent