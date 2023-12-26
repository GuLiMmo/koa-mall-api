const { Op } = require('sequelize')
const Store = require('../../model/store.model')
const User = require('../../model/user.model')

class storeController {

    async getAllStoreList(ctx) {
        const res = await Store.findAll()
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }

    async getStoreList(ctx) {
        const { offset, limit, keyWord } = ctx.query
        const res = await Store.findAndCountAll({
            offset: parseInt(offset - 1),
            limit: parseInt(limit),
            where: {
                [Op.or]: [
                    {
                        business_name: {
                            [Op.like]: `%${keyWord}%`
                        }
                    },
                    {
                        business_account: {
                            [Op.like]: `%${keyWord}%`
                        },
                    }
                ]
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res,
        }
    }

    async addNewStore(ctx) {
        const { storeName, businessAccount, forbidden } = ctx.request.body
        console.log({
            business_account: businessAccount,
            store_state: forbidden,
            store_name: storeName
        });
        const res = await Store.create({
            business_account: businessAccount,
            store_state: forbidden,
            business_name: storeName,
            create_time: new Date().toLocaleString()
        })
        if (!res.dataValues) {
            return ctx.app.emit('error', { code: '20001', message: '添加店铺失败，请稍后重试！' }, ctx)
        }
        ctx.body = {
            code: '10000',
            message: '添加店铺成功！！'
        }
    }

    async getGlAccount(ctx) {
        const { account } = ctx.query
        const res = await User.findAll({
            attributes: ['uuid', 'username', 'account'],
            where: {
                account: {
                    [Op.like]: `%${account}%`
                }
            }
        })
        ctx.body = {
            code: '10000',
            message: '查询成功',
            result: res
        }
    }

    async deleteStore(ctx) {
        const { id } = ctx.request.body
        const res = await Store.destroy({
            where: {
                store_id: id
            }
        })
        if (!res) {
            ctx.app.emit('error', { code: '20001', message: '删除失败' })
        } else {
            ctx.body = {
                code: '10000',
                message: '删除成功'
            }
        }
    }

    async getSingleStore(ctx) {
        const { id } = ctx.request.body
        const res = await Store.findOne({
            where: {
                store_id: id
            }
        })
        if (!res.dataValues) {
            ctx.app.emit('errosr', { code: '20001', message: '获取失败' })
        } else {
            ctx.body = {
                code: '10000',
                message: '获取成功',
                result: res
            }
        }
    }

    async editStore(ctx) {
        const { id, storeName, forbidden } = ctx.request.body
        let obj = {}
        storeName && Object.assign(obj, { business_name: storeName })
        forbidden && Object.assign(obj, { store_state: forbidden })
        console.log(forbidden);
        const res = await Store.update({ ...obj }, {
            where: {
                store_id: id
            }
        })
        if (!res[0]) {
            ctx.app.emit('error', { code: '20001', message: '更新失败' })
        } else {
            ctx.body = {
                code: '10000',
                message: '更新成功'
            }
        }
    }
}

module.exports = new storeController()