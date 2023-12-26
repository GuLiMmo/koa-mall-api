const { Op } = require('sequelize')
const User = require('../../model/user.model')

class usersController {
    async getUsersList(ctx) {
        const res = await User.findAll({
            attributes: ['account', 'avater', 'address', 'email', 'gender', 'state', 'username', 'usertype', 'uuid'],
            where: {
                account: {
                    [Op.ne]: 'w28208907651'
                }
            }
        })
        res.forEach(item => {
            item.address = !!item.address ? JSON.parse(item.address) : ''
        })
        ctx.body = {
            code: '10000',
            message: '数据查询成功',
            result: res
        }
    }
    async editUserInfo(ctx) {
        const { uuid, state, username, password, usertype } = ctx.request.body
        let obj = {}
        state && Object.assign(obj, { state })
        username && Object.assign(obj, { username })
        password && Object.assign(obj, { password })
        usertype && Object.assign(obj, { usertype })
        const res = await User.update({...obj}, {
            where: {
                uuid
            }
        })
        if (!res[0]) {
            return ctx.app.emit('error', { code: '20001', message: '修改用户信息失败' })
        }
        ctx.body = {
            code: '10000',
            message: '修改用户信息成功'
        }
    }

    async deleteUserInfo(ctx) {
        const { uuid } = ctx.request.body
        const res = await User.destroy({
            where: {
                uuid
            }
        })
        if (!res[0]) {
            return ctx.app.emit('error', { code: '20001', message: '删除用户信息失败' })
        }
        ctx.body = {
            code: '10000',
            message: '删除用户信息成功'
        }
    }
}

module.exports = new usersController()