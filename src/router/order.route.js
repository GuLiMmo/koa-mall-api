const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/orders' })
const { 
    createdOrder,
    readingAllOrder,
    OrderDelivery,
    shippedGoods,
    getAllOrder,
    deleteSingleData
} = require('../controller/order.controller')
// 订单中间键导入
const { 
    parameterVerifMid 
} = require('../middleware/order.middleware')

// 创建订单路由
router.post('/createdOrder', parameterVerifMid, createdOrder)

// 查询店铺所有订单
router.post('/readStoreOrder', readingAllOrder)

// 去发货
router.post('/OrderDelivery', OrderDelivery)

// 读取当前账号已发货的订单
router.post('/shippedGoods', shippedGoods)

// 获取所有订单
router.post('/getAllOrder', getAllOrder)

// 删除订单
router.post('/deleteSingleData', deleteSingleData)


module.exports = router