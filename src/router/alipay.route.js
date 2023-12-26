const koaRouter = require('koa-router')
const { paymentCon } = require('../controller/alipay.controller')
const { redisHmGet, removeRedisKey } = require('../db/redis/rdsConn')
const router = new koaRouter({ prefix: '/pay' })
const { produceOrder } = require('../services/alipay.service')


// 支付接口
router.post('/payment', paymentCon)

// notify
router.post('/notify', (ctx) => {
    // console.log(ctx);
    // ctx.body = ctx
    console.log(1 + ctx.query);
})

// 支付成功调用
router.get('/paySuccess/:order_id', async (ctx) => {
    const { order_id } = ctx.params
    if (!order_id) return await ctx.redirect('http://127.0.0.1:5175/#/payError')
    // // // 去redis中获取订单信息
    let orderData = await redisHmGet(order_id)
    let newOrderData = {}
    for (const key in orderData) {
        newOrderData[key] = JSON.parse(orderData[key])
    }
    const { storeAccount, orderGoodsInfo, userBasicInfo } = orderData
    const { username, account, address } = JSON.parse(userBasicInfo)
    const res = await produceOrder({ order_id, username, account, address, orderGoodsInfo, storeAccount })
    if (res) {
        removeRedisKey(order_id)
        await ctx.redirect(`http://127.0.0.1:5175/#/paySuccess/${order_id}`)
    } else {
        await ctx.redirect('http://127.0.0.1:5175/#/payError')
    }
})

// 支付失败
router.post('/payError', async ctx => {
    await ctx.redirect('http://127.0.0.1:5175/#/payError')
})


module.exports = router