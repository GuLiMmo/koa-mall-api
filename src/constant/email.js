const nodemailer = require('nodemailer');
// redis方法导入
const { redisSet } = require('../db/redis/rdsConn')

// 邮件发送封装
const sendEmail = (toEmail, text, code) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: , // SMTP 端口
        auth: {   //发送者的账户和授权码
            user: ', //账户
            pass: '', //smtp授权码，到邮箱设置下获取 xfwadrcnkbcxdijh
        }
    });
    let mailOptions = {
        from: '', // 发送者昵称和地址
        to: toEmail, // 接收者的邮箱地址
        subject: '', // 邮件主题
        text
    };

    //发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        redisSet(toEmail, code, 60)
        console.log('邮件发送成功 ID：', info.messageId);
    });
}

module.exports = sendEmail