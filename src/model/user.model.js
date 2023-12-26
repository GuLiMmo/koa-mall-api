const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

// 创建模型
const User = seq.define('user_form', {
    // idsequelize会自己创建id
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "用户名"
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "账号，唯一"
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: "密码"
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "邮箱"
    },
    usertype: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: "是否为店家，0为不是（默认）：1为是"
    },
    avater: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "头像链接"
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "生日"
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
        comment: "性别，1为男，0为女"
    },
    address: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: "地址"
    },
    addressarr: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: "地址组"
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        commit: "用户是否启用"
    },
}, {
    timestamps: false
})

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
User.sync()

module.exports = User