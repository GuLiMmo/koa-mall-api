const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/email' })

const { sendCode, vaildCode } = require('../controller/email.controller')

// 发送邮件验证码
router.post('/sendCode', sendCode)

// 邮箱验证码验证
router.post('/vaildCode', vaildCode)


module.exports = router