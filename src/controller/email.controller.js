// SMTP邮箱方法封装导入
const sendEmail = require('../constant/email')
const { emailSendError, vaildCodeError } = require('../constant/error/user.err.type')
const { redisGet } = require('../db/redis/rdsConn')

class emailController {
    // 邮件发送
    async sendCode(ctx) {
        const { email } = ctx.request.body
        // 邮箱验证
        if (email === '') {
            ctx.app.emit('error', emailSendError, ctx)
        } else {
            // 生成验证码
            const code = Math.ceil(Math.random() * (999999 - 100000) + 100000)
            sendEmail(email, `验证码：${code}，请及时填写，验证码在60秒后失效`, code)
            ctx.body = {
                code: '10000',
                message: '邮件发送成功',
            }
        }
    }
    async vaildCode(ctx) {
        const { email, code } = ctx.request.body
        // 获取redis中的验证码
        const rdsCode = await redisGet(email)
        if (code === rdsCode) {
            ctx.body = {
                code: "10000",
                message: "验证通过"
            }
        } else {
            ctx.app.emit("error", vaildCodeError, ctx)
        }

    }
}

module.exports = new emailController()