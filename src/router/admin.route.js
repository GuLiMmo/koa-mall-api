const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/admin' })
// 管理员中间键导入
const { isAdmin } = require('../middleware/admin.moddleware')
const { getUsersList, editUserInfo, deleteUserInfo } = require('../controller/admin.controller/users.controller')
const { getOrdersList, getAllOrdersList, deleteSingleOrder, updataOrder } = require('../controller/admin.controller/orders.controller')
const { getGoodsList, allGoodsData, deleteSingleGoods, getSingleGoodsData, editGoodsInfo } = require('../controller/admin.controller/goods.controller')
const { getStoreList, getAllStoreList, addNewStore, getGlAccount, deleteStore, getSingleStore, editStore } = require('../controller/admin.controller/store.controller')
const { mockEchartsData } = require('../controller/admin.controller/echarts.controller')

// 读取用户列表
router.get('/getUsersList', isAdmin, getUsersList)

// 订单列表读取
router.get('/getOrdersList', isAdmin, getOrdersList)
// 读取所有商品
router.get('/getAllOrdersList', isAdmin, getAllOrdersList)
// 删除订单
router.post('/deleteSingleOrder', isAdmin, deleteSingleOrder)
// 更新订单
router.post('/updataOrder', isAdmin, updataOrder)



// 商品列表读取
router.get('/getGoodsList', isAdmin, getGoodsList)
// 读取所有商品
router.get('/getAllGoodsList', isAdmin, allGoodsData)
// 获取单个商品信息
router.get('/getSingleGoods', isAdmin, getSingleGoodsData)
// 删除单个商品
router.post('/deleteSingleDelete', isAdmin, deleteSingleGoods)
// 编辑商品信息
router.post('/editGoodsInfo', isAdmin, editGoodsInfo)

// 店铺相关
router.get('/getStoreList', isAdmin, getStoreList)
router.get('/getAllStoreList', isAdmin, getAllStoreList)
// 添加店铺
router.post('/addNewStore', isAdmin, addNewStore)
// 关联账户查询
router.get('/getGlAccount', isAdmin, getGlAccount)
// 店铺删除
router.post('/deleteStore', isAdmin, deleteStore)
// 获取店铺信息
router.post('/getSingleStore',isAdmin, getSingleStore)
// 修改店铺信息
router.post('/editStore', isAdmin, editStore)
// 修改个人信息
router.post('/editUserInfo', isAdmin, editUserInfo)
// 删除用户
router.post('deleteUserInfo', isAdmin, deleteUserInfo)

// echarts数据
router.get('/mockEchartsData', isAdmin, mockEchartsData)

module.exports = router