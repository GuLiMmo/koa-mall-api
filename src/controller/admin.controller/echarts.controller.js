const uuid = require("node-uuid")
const Goods = require("../../model/goods.model")
const Order = require("../../model/order.model")
const Store = require("../../model/store.model")
const User = require("../../model/user.model")

class echartsController {
    async mockEchartsData(ctx) {
        // 模拟日期
        const now = new Date()
        let day = now.getDay()
        let weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        let echartDate = []
        let clickCount = 0
        for (let index = 15; index > 0; index--) {
            // 生成随机数
            const random = Math.floor(Math.random() * 100)
            day--
            if (day === 0) {
                day = 6
            }
            clickCount += random
            echartDate.unshift({ count: random, time: weeks[day] })
        }
        // 点击数模拟
        let clickCountNums = { clickCount, echartDate }
        // 查询订单数量，用户数量、商品数量
        const orderData = await Order.findAndCountAll()
        const GoodsData = await Goods.findAndCountAll()
        const UserData = await User.findAndCountAll()
        const storeData = await Store.findAndCountAll()
        // 订单模拟
        // 获取当前当前日期
        const nowDate = new Date().toLocaleString().split(' ')[0]
        // 添加虚拟订单
        let orderList = []
        for (let index = 0; index <= 100; index++) {
            let strIndex = null
            if (index.toString().length == 1) {
                strIndex = '00' + index.toString()
            } else if (index.toString().length == 2) {
                strIndex = '0' + index.toString()
            } else {
                strIndex = index
            }
            orderList.push({
                orderId: uuid(),
                title: 'RB-' + nowDate + '-' + strIndex,
                date: nowDate
            })
        }

        ctx.body = {
            code: '10000',
            message: '获取数据成功',
            result: {
                statisticData: [
                    { title: '全站订单数', values: orderData.count },
                    { title: '全站商品数', values: GoodsData.count },
                    { title: '全站用户数', values: UserData.count },
                    { title: '全站商户数', values: storeData.count },
                ],
                clickCountNums: { title: '全站访问数', values: clickCountNums },
                orderList
            }
        }
    }
}

module.exports = new echartsController()