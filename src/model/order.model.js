const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

const Order = seq.define('order_form', {
    // 订单账号
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "订单号"
    },
    // 买家昵称
    order_buyer_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "买家昵称"
    },
    // 买家账号
    order_buyer_account: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "买家账号"
    },
    // 订单创建时间
    create_time: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "订单创建时间"
    },
    // 订单商品信息
    order_goods_info: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "订单商品信息"
    },
    // 买家地址
    buyer_address: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "买家地址"
    },
    // 订单状态
    order_state: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1,
        comment: "订单付款状态，0为未付款，1为付款，2为退款"
    },
    // 物流号
    order_logistics: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "物流单号"
    },
    // 商家账号
    merchant_account: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "商家账号"
    }
}, {
    timestamps: false
})

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
Order.sync({
    alter: true
})

module.exports = Order