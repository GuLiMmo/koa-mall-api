// app.js
const koa = require('koa');
const http = require('http');
const { Server } = require('socket.io');
const app = new koa();
// 创建http服务，使用socket.io
const server = http.createServer(app.callback());
const io = new Server(server, {
    serveClient: false,
    cors: {
        origin: '*', // from the screenshot you provided
        methods: ['GET', 'POST'],
    },
});

// 保存所有用户消息
let chatList = []
// 保存当前所有用户(聊天)
let userList = {}
// 广播
let broadcastsUsers = {}
let broadcastsMsg = []
let broadcastsRoomName = 'broadcastsRoomName'
// 连接进来时触发
io.on('connection', socket => {
    console.log(socket.id + '连接成功');

    // 添加用户
    socket.on('addUser', (username, id) => {
        userList[username] = id
        // io.emit('GloabMessage', userList)
    })

    // 判断商家用户是否在线
    socket.on('isStoreOnline', (account) => {
        Object.keys(userList).map(item => {
            let onlineMsg = ''
            if (item !== account) {
                onlineMsg = '当前商家不在线，请店家上线后联系'
            } else {
                onlineMsg = '请发送你要询问的问题'
            }
            socket.emit('isUserOnline', onlineMsg)
        })
    })

    // 给指定用户发送信息
    socket.on('sendMessage', (account, message) => {
        // 指定发送的人
        socket.to(userList[account]).emit('oppositeSideMsg', message)
    })

    // 用户连接广播
    socket.on('joinBroadcasts', (account, id) => {
        console.log(account, id);
        // 将用户添加进用户列表
        broadcastsUsers[account] = id
    })

    // 发送全部用户
    socket.on('getBroadcastUsersList', (account) => {
        socket.to(userList[account]).emit('getBroadcastUsers', Object.keys(broadcastsUsers))
    })

    // 全体广播
    socket.on('allBroadcasts', (Msg) => {
        socket.emit('getBroadcastsMsg', Msg)
    })

    // 断开连接
    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
})


server.listen(3030, () => {
    console.log(`监听地址: http://localhost:3030`);
})