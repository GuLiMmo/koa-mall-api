const koa = require('koa')
const cors = require("@koa/cors"); //跨域处理
const app = new koa()
app.use(cors())

// 错误处理导入
const errHandler = require('./errHandler');

// 文件上传处理
const static = require('koa-static');
const path = require('path')

// post请求处理中间件
const koaBody = require('koa-body')
app.use(koaBody({
    multipart: true,
    formidable: {
        // 上传存放的路劲
        // uploadDir: path.join(__dirname,'../upload/image'),
        // // 保持后缀名
        // keepExtensions: true,
        // 设置上传文件大小最大限制，默认2M
        // maxFileSize: 2*1024*1024,
        onError(err) {
            console.log(err)
        }
    }
}))

// 错误统一处理
// errHandler
app.on('error', (err, ctx) => {
    ctx.body = err
})

// 用户路由导入
const userRoute = require('../router/user.route');
// 邮件路由导入
const emailRoute = require('../router/email.route')
// 商品路由导入
const goodsRoute = require('../router/goods.route')
// 订单路由导入
const orderRoute = require('../router/order.route')
// 支付路由导入
const payRoute = require('../router/alipay.route')
// 管理员路由导入
const adminRoute = require('../router/admin.route')
// 系统设置
const settingRoute = require('../router/setting.route')

// 路由注册
app.use(userRoute.routes()).use(userRoute.allowedMethods())
app.use(emailRoute.routes()).use(emailRoute.allowedMethods())
app.use(goodsRoute.routes()).use(goodsRoute.allowedMethods())
app.use(orderRoute.routes()).use(orderRoute.allowedMethods())
app.use(payRoute.routes()).use(payRoute.allowedMethods())
app.use(adminRoute.routes()).use(adminRoute.allowedMethods())
app.use(settingRoute.routes()).use(settingRoute.allowedMethods())
// 静态文件公开地址
app.use(static(path.join(__dirname, '../uploads')));

module.exports = app