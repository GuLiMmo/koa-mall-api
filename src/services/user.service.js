// user模型导入
const User = require('../model/user.model')
// token生成包导入
const { createToken } = require('../constant/jwt')


class UserService {
    // 创建用户
    async createUser(obj) {
        const res = await User.create({
            ...obj
        })
        return res ? res.dataValues : null
    }
    // 获取用户信息
    async getUserInfo(account, email) {
        let whereOpt = {}
        account && Object.assign(whereOpt, { account })
        email && Object.assign(whereOpt, { email })
        const res = await User.findOne({
            where: whereOpt
        })
        return res ? res.dataValues : null
    }
    // 查询用户
    async userNormalLogin(act, password) {
        const res = await User.findOne({
            where: {
                account: act,
                password,
                state: true
            }
        })
        if (res) {
            const { uuid, username, account, avater, usertype } = res.dataValues
            const token = createToken({ uuid, username, account, usertype })
            return { uuid, username, account, avater, usertype, token }
        }
        return null
    }
    // 邮箱查询用户
    async userEmailLoginQuery({ email, act }) {
        let whereOpt = {}
        email && Object.assign(whereOpt, { email })
        act && Object.assign(whereOpt, { account: act })
        const res = await User.findOne({
            where: {
                ...whereOpt,
                state: true
            }
        })
        if (res) {
            const { uuid, username, account, avater, usertype } = res.dataValues
            const token = createToken({ uuid, username, account, usertype })
            return { uuid, username, account, avater, usertype, token }
        }
        return null
    }
    // 通过uuid查询用户基本信息
    async userUuidQeury(uuid) {
        const res = await User.findOne({
            where: {
                uuid
            }
        })
        if (res) {
            const { uuid, username, account, avater, usertype, address } = res.dataValues
            return { uuid, username, account, avater, usertype, address }
        }
        return null
    }
    // 通过uuid查询用户地址
    async getUserAddressService(uuid) {
        const res = await User.findOne({
            attributes: ['address', 'addressarr'],
            where: {
                uuid
            }
        })
        // 将数组转成object格式
        Object.keys(res.dataValues).map(key => {
            res.dataValues[key] = JSON.parse(res.dataValues[key])
        })
        return res ? res.dataValues : null
    }
    // 添加地址地址
    async addUserAddressService({ uuid, address, addressArray }) {
        // 地址对象
        let personInfoObj = JSON.stringify(address)
        let addressArrayStr = JSON.stringify(addressArray)
        const res = await User.update({
            address: personInfoObj,
            addressarr: addressArrayStr
        }, {
            where: {
                uuid
            }
        })
        return res[0] ? true : false
    }
    // 读取地址组
    async getAddressArrService(uuid) {
        const res = await User.findOne({
            attributes: ['addressarr'],
            where: {
                uuid
            }
        })
        return res ? res.dataValues : null
    }
    // 修改默认地址
    async changeDefaultAddressService(uuid, address) {
        let addressStr = JSON.stringify(address)
        const res = await User.update({
            address: addressStr
        }, {
            where: {
                uuid
            }
        })
        return res[0] ? true : false
    }
    // 获取账号基本信息
    async getBasicUserInfoService(uuid) {
        const res = await User.findOne({
            attributes: ['uuid', 'username', 'password', 'avater', 'gender', 'birthday'],
            where: {
                uuid
            }
        })
        return res ? res.dataValues : null
    }
    // 修改账号信息
    async changeAccountInfoService(rest) {
        const { uuid, ...args } = rest
        const res = await User.update({ ...args }, {
            where: {
                uuid
            }
        })
        return res[0] ? true : false
    }
}

module.exports = new UserService()