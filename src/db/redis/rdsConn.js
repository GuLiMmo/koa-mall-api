const redis = require('redis')
const { redisConfig } = require('./rdsConfig')
// 创建redis连接
// redisClient = redis.createClient(redisConfig)
redisClient = redis.createClient({
    url: "redis://@192.168.145.130:6379"
})

redisClient.on('error', err => {
    console.log(err)
})

// 设置值(string)
const redisSet = (key, val, ...args) => {
    try {
        if (typeof val === 'object') {
            val = JSON.stringify(val)
        }
        redisClient.set(key, val)
        if (args[0]) {
            // 设置redis中key的过期时间
            redisClient.expire(key, args[0])
        }
        return true
    } catch (error) {
        return false
    }
}

// 读取值(string)
const redisGet = (key) => {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            // 出错
            if (err) {
                reject(err)
                return
            }
            // 值为空
            if (val == null) {
                resolve(null)
                return
            }
            resolve(val)
        })
    })
    return promise
}

// 设置值(对象)
const redisHmSet = (key, index, val, ...args) => {
    try {
        redisClient.hmset(key, index, val, redis.print)
        if (args[0]) {
            redisClient.expire(key, 60 * 60 * 60 * 24 * args[0])
        }
        return true
    } catch (error) {
        return false
    }
}

// 取值(对象)
const redisHmGet = (key) => {
    const promise = new Promise((resolve, reject) => {
        redisClient.hgetall(key, (err, val) => {
            // 出错
            if (err) {
                reject(err)
                return
            }
            // 值为空
            if (val == null) {
                resolve(null)
                return
            }
            resolve(val)
        })
    })
    return promise
}

// 移除key
const removeRedisKey = (key) => {
    return redisClient.del(key, (err, val) => {
        if (err) {
            return false
        } else {
            if (!!val) {
                return false
            } else {
                return true
            }
        }
    })
}

module.exports = {
    redisSet,
    redisGet,
    redisHmSet,
    redisHmGet,
    removeRedisKey,
}