const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

const HeadImg = seq.define('headImg_form', {
    headImg_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: '头图id'
    },
    headImg_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '头图名称'
    },
    headImg_url: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '头图地址'
    }
}, {
    timestamps: false
})

// 更新数据表
HeadImg.sync()


module.exports = HeadImg