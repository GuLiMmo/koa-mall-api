// jwt导入
const { verifyToken } = require('../constant/jwt')
const getHeaderToken = require('../constant/getHeaderToken')

// 验证当前用户是否是admin
const isAdmin = async (ctx, next) => {
    const token = getHeaderToken(ctx)
    // 解析token中的数据
    const data = await verifyToken(token)
    const { account } = data
    if (account !== 'w28208907651') {
        return ctx.app.emit('error', { code: '10001', message: '身份验证失败', result: '' }, ctx)
    }
    await next()
}



module.exports = {
    isAdmin
}