// 错误类型导入
const { userFormateError, userAlreadyExited, userUploadAvaterError, vaildCodeError, userEmailLoginError, queryUserInfoError } = require('../constant/error/user.err.type')
const getHeaderToken = require('../constant/getHeaderToken')
const { redisGet } = require('../db/redis/rdsConn')
const { getUserInfo, userEmailLoginQuery, getAddressArrService } = require('../services/user.service')

// 验证用户名密码是否合法
const userValidator = async (ctx, next) => {
    const { account, password } = ctx.request.body
    const accountReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/i
    const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{9,16}$/i
    if (!accountReg.test(account) || !pwdReg.test(password)) {
        // 错误抛出
        ctx.app.emit('error', userFormateError, ctx)
        return
    }
    await next()
}

// 验证注册账号和邮箱库中是否存在
const verfiyUser = async (ctx, next) => {
    console.log(ctx.request.body);
    const { account, email } = ctx.request.body
    if (await getUserInfo(account, email)) {
        ctx.app.emit('error', userAlreadyExited, ctx)
        return
    }
    await next()
}

// 判断是否上传头像
const uploadAvater = async (ctx, next) => {
    const file = ctx.request.files.avater
    if (typeof file === 'undefined') {
        ctx.app.emit('error', userUploadAvaterError, ctx)
        return
    }
    ctx.request.body.file = file
    await next()
}

// 判断邮箱验证码是否正常
const vaildEmailCode = async (ctx, next) => {
    const { email, code } = ctx.request.body
    const rdsCode = await redisGet(email)
    if (rdsCode !== code) {
        ctx.app.emit('error', vaildCodeError, ctx)
        return
    }
    await next()
}

// 使用邮箱查询第一遍
const emailQuery = async (ctx, next) => {
    const { email } = ctx.request.body
    const res = await userEmailLoginQuery({ email })
    if (!res) {
        ctx.app.emit('error', userEmailLoginError, ctx)
        return
    }
    const { account } = res
    ctx.request.body.account = account
    await next()
}

// 通过uuid查询用户，先查询token是否被修改
const tokenIsCorrect = async (ctx, next) => {
    const { uuid } = ctx.request.body
    // 获取请求头的token
    const token = getHeaderToken(ctx)
    // 获取redis中的token
    const rdsKey = uuid + 'stoken'
    const rdsToken = await redisGet(rdsKey)
    if (token === rdsToken) {
        await next()
        return
    }
    ctx.app.emit('error', { code: '10001', message: 'token过期，请重新登录' }, ctx)
}

// 判断添加用户地址信息参数是否有问题
const addAddressParameters = async (ctx, next) => {
    const { uuid, address } = ctx.request.body;
    if (!uuid || !address) {
        ctx.app.emit('error', { code: '10001', message: '添加地址参数错误', result: '' }, ctx)
        return
    }
    await next()
}

// 将地址添加到地址组中
const getAddressArr = async (ctx, next) => {
    const { uuid } = ctx.request.body;
    const res = await getAddressArrService(uuid)
    if (!res) {
        ctx.app.emit('error', queryUserInfoError, ctx)
        return
    }
    ctx.request.body.addressarr = res.addressarr
    await next()
}

const dataProcessingEdit = async (ctx, next) => {
    const rest = ctx.request.body
    const avaterFile = ctx.request.files.avater
    console.log();
    if (typeof avaterFile === 'undefined') {
        ctx.request.body = {
            ...rest
        }
    } else {
        ctx.request.body = {
            ...rest,
            avaterFile
        }
    }
    
    await next()
}

module.exports = {
    userValidator,
    verfiyUser,
    uploadAvater,
    vaildEmailCode,
    emailQuery,
    tokenIsCorrect,
    addAddressParameters,
    getAddressArr,
    dataProcessingEdit
}