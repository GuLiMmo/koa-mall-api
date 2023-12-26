const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

const Store = seq.define('store_form',{
    store_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: '店铺id'
    },
    business_account: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '店铺账号'
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '店铺名称'
    },
    store_state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '店铺状态'
    },
    create_time: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '店铺创建时间'
    }
},{
    timestamps: false
})

Store.sync({
    alter: true
})

module.exports = Store