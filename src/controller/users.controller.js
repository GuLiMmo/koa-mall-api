// services导入
const {
    userRegisterError,
    userLoginError,
    userEmailLoginError,
    userSignOutError,
    queryUserInfoError
} = require('../constant/error/user.err.type')
const {
    createUser,
    userNormalLogin,
    userEmailLoginQuery,
    userUuidQeury,
    getUserAddressService,
    addUserAddressService,
    changeDefaultAddressService,
    getBasicUserInfoService,
    changeAccountInfoService
} = require('../services/user.service')
// fs 文件模块导入
const fs = require('fs')
// path模块导入
const path = require('path')
const { removeRedisKey } = require('../db/redis/rdsConn')

class UserController {
    // 用户注册
    async register(ctx) {
        let { file, ...rest } = ctx.request.body
        // 文件写入
        const reader = fs.createReadStream(file.filepath);   // 创建文件可读流
        // 重命名上传文件
        const uploadData = new Date() //获取当前时间
        const newFileName = uploadData.getTime() + '.' + file.originalFilename.split('.')[1]    // 上传文件重命名的名字
        // 写入地址
        const uploadPath = path.join(__dirname, '../uploads/images') + `/${newFileName}`;
        // 将图片地址放入obj当中
        rest.avater = `http://127.0.0.1:3000/images/${newFileName}`
        // sql写入
        const res = await createUser(rest)
        if (res) {
            // 创建写入流，将图片写入
            const upStream = fs.createWriteStream(uploadPath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            // 注册成功返回信息
            ctx.body = {
                code: "10000",
                message: "注册成功"
            }
            return
        }
        ctx.app.emit("error", userRegisterError, ctx)
    }
    // 用户正常登录
    async normalLogin(ctx) {
        const { account, password } = ctx.request.body
        const res = await userNormalLogin(account, password)
        if (res) {
            ctx.body = {
                code: '10000',
                message: '登录成功',
                result: {
                    ...res
                }
            }
            return
        }
        ctx.app.emit("error", userLoginError, ctx)
    }
    // 用户邮箱登录
    async emailLogin(ctx) {
        console.log('最后一步');
        const { account, email } = ctx.request.body
        const res = await userEmailLoginQuery({ account, email })
        if (!res) {
            ctx.app.emit('error', userEmailLoginError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "登录成功",
            result: {
                ...res
            }
        }
    }
    // 退出登录
    async signOutAccountCon(ctx) {
        const { uuid } = ctx.request.body
        const res = await removeRedisKey(uuid + 'stoken')
        if (!res) {
            ctx.app.emit('error', userSignOutError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: "退出登录成功"
        }
    }
    // 获取用户单个地址
    async getUserAddressCon(ctx) {
        const { uuid } = ctx.request.body
        const res = await getUserAddressService(uuid)
        if (!res) {
            ctx.app.emit('error', queryUserInfoError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '查询用户信息成功',
            result: {
                ...res
            }
        }
    }
    // 添加收货地址
    async addRecrivGoodsAddressCon(ctx) {
        const { uuid, address, addressarr } = ctx.request.body;
        let addressArray = JSON.parse(addressarr) || []
        addressArray.push(address)
        const res = await addUserAddressService({ uuid, address, addressArray })
        if (!res) {
            ctx.app.emit('error', { code: '10001', message: '添加地址失败', result: '' }, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '添加地址成功',
            result: {
                ...address
            }
        }
    }
    // 修改收货地址
    async changeRecrivGoodsAddressCon(ctx) {
        const { uuid, address } = ctx.request.body
        const res = await changeDefaultAddressService(uuid, address)
        if (!res) {
            ctx.app.emit('error', { code: '10002', message: '修改地址失败', result }, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '修改地址成功',
            result: ''
        }
    }
    // 用户token认证
    async vaildToken(ctx) {
        const { uuid } = ctx.request.body
        const res = await userUuidQeury(uuid)
        if (!res) {
            ctx.app.emit('error', { code: '10001', message: 'uuid错误，请重新登录' }, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: 'token暂未过期',
            result: {
                ...res,
                token: ctx.header['authorization']
            }
        }
    }
    // 获取个人基本信息
    async getBasicUserInfoCon(ctx) {
        const { uuid } = ctx.request.body
        const res = await getBasicUserInfoService(uuid)
        if (!res) {
            ctx.app.emit('error', queryUserInfoError, ctx)
            return
        }
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }
    // 修改个人信息
    async modifyUserInfo(ctx) {
        let { avaterFile, ...rest } = ctx.request.body
        // 处理头像上传
        const reader = fs.createReadStream(avaterFile.filepath);   // 创建文件可读流
        // 重命名上传文件
        const uploadData = new Date() //获取当前时间
        const newFileName = uploadData.getTime() + '.' + avaterFile.originalFilename.split('.')[1]    // 上传文件重命名的名字
        // 写入地址
        const uploadPath = path.join(__dirname, '../uploads/images') + `/${newFileName}`;
        // 将图片地址放入obj当中
        rest.avater = `http://127.0.0.1:3000/images/${newFileName}`
        // 数据库更新
        const res = await changeAccountInfoService(rest)
        if (!res) {
            ctx.app.emit('error', { code: '10002', message: '更新个人资料失败' }, ctx)
            return
        }
        // 创建写入流，将图片写入
        const upStream = fs.createWriteStream(uploadPath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        // 注册成功返回信息
        ctx.body = {
            code: "10000",
            message: "更新成功"
        }
    }
}

module.exports = new UserController()