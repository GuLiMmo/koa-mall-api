const jwt = require('jsonwebtoken')
const { redisGet, redisSet } = require('../db/redis/rdsConn')

// 密钥
const secretkey = 'my_token'

// 创建token
const createToken = (data) => {
    let tokenInfo = {}
    tokenInfo.data = data || {} //存入token的数据
    let token = jwt.sign(tokenInfo, secretkey) // 创建token
    // 将token存入redis
    redisSet(data.uuid + 'stoken', token, 60 * 60 * 60 * 24 * 3)
    return token
}

// 验证token合法性
const verifyToken = async (token) => {
    let { data } = jwt.verify(token, secretkey)
    // 获取redis中的token查看是否存在
    let res = await redisGet(data.uuid + "stoken")
    if (!!res) {
        return data
    } else {
        return false
    }
}


module.exports = { createToken, verifyToken }