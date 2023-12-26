const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

const Goods = seq.define('goods_form', {
    goods_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    goods_image: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "首页展示图片"
    },
    goods_title: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "商品标题"
    },
    goods_price: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "商品价格"
    },
    goods_nums: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "商品数量"
    },
    goods_merchants: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "店家"
    },
    goods_comments: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: "商品评论"
    },
    goods_tags: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "商品标签"
    },
    goods_size: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "商品参数"
    },
    goods_image_arr: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "商品图片组"
    },
   store_account: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "商家账号"
    },
    goods_state: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: '当前商品状态'
    }
}, {
    timestamps: false
})



// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
Goods.sync({
    alter: true
})

module.exports = Goods