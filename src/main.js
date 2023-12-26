const app = require('./app/index')

// 开启端口
app.listen(3000, () => {
    console.log('servies running address：http://127.0.0.1:3000');
})