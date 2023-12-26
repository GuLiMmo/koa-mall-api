const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/users' })

const { 
    register, 
    normalLogin, 
    emailLogin, 
    vaildToken, 
    signOutAccountCon, 
    getUserAddressCon, 
    addRecrivGoodsAddressCon, 
    changeRecrivGoodsAddressCon, 
    modifyUserInfo, 
    getBasicUserInfoCon 
} = require('../controller/users.controller')

// 账号验证中间件导入
const { 
    userValidator, 
    verfiyUser, 
    uploadAvater, 
    vaildEmailCode, 
    emailQuery, 
    tokenIsCorrect, 
    addAddressParameters, 
    getAddressArr, 
    dataProcessingEdit 
} = require('../middleware/user.middleware')

// 注册接口
router.post('/register', userValidator, verfiyUser, uploadAvater, register)

// 账号密码登录接口
router.post('/normalLogin', normalLogin)

// 邮箱登录接口
router.post('/emailLogin', vaildEmailCode, emailQuery, emailLogin)

// 退出登录接口
router.post('/signOutAccount', signOutAccountCon)

// 用户地址获取
router.post('/getDefaultAddress',getUserAddressCon),

// 单个地址添加
router.post('/addReceiveGoodsAddress', addAddressParameters, getAddressArr, addRecrivGoodsAddressCon)

// 修改用户默认地址
router.post('/changeDefaultAddress', changeRecrivGoodsAddressCon)

// 用户token验证接口
router.post('/vaildToken', tokenIsCorrect, vaildToken)

// 修改用户信息结构
router.post('/modifyUserInfo',dataProcessingEdit, modifyUserInfo)

// 获取账号基本信息
router.post('/getBasicUserInfo', getBasicUserInfoCon)


module.exports = router