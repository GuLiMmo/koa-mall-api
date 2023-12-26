const { DataTypes } = require('sequelize')
// 导入mysql配置文件
const seq = require('../db/mysql/seq')

const Classify = seq.define('classify_form', {
    classify_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    classify_title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    classify_tags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    classify_state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false
})

Classify.sync()



module.exports = Classify