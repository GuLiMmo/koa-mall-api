const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mallsql', 'root', '12345678', {
    host: 'localhost',
    dialect: 'mysql' /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
});

sequelize.authenticate().then(res => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log('数据库连接失败：', err);
})

module.exports = sequelize