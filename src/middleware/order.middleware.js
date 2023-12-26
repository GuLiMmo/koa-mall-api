// 错误类型导入
const {
    parameterVerifError
} = require('../constant/error/order.err.type')

// 订单参数验证
const parameterVerifMid = async (ctx, next) => {
    const {
        order_buyer_name,
        order_buyer_account,
        create_time,
        goods_image,
        goods_id,
        order_goods,
        buyer_address,
        merchant_account
    } = ctx.request.body
    // 判断参数是否缺失
    if (order_buyer_name || order_buyer_account || create_time || goods_image || goods_id || order_goods || buyer_address || merchant_account) {
        await next()
        return
    }
    ctx.app.emit('error', parameterVerifError, ctx)
}

module.exports = {
    parameterVerifMid
}