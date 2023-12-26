const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/goods' })
const {
    createGoodsInfoCon,
    HomePageGoodsCon,
    singleGoodsQueryCon,
    addGoodsHistoryCon,
    goodsSearchCon,
    addGoodsCarCon,
    getGoodsCarCon,
    randRemmGoodsCon,
    getGoodsHistoryCon,
    queryExpressCon,
    deleteSingleGoodsCon,
    editGoodsCarSingleGoods,
    queryGoodsClassify,
    uploadGoodsImage,
    deleteGoodsImage,
    storeAddGoods,
    getPainGoodsList,
    updataGoodsData
} = require('../controller/goods.controller')
const { queryParameterMid, singleGoodsQueryParameterMid } = require('../middleware/goods.middleware')

// 商品添加创建
router.post('/createGoodsInfo', createGoodsInfoCon)

// 首页商品分页查询无限加载
router.get('/productRecommendation', queryParameterMid, HomePageGoodsCon)

// 当个商品详情查询
router.get('/singleGoodsSearch', singleGoodsQueryParameterMid, singleGoodsQueryCon)

// 商品浏览历史添加
router.post('/addBrowingHistory', addGoodsHistoryCon)

// 获取商品浏览历史
router.post('/getBrowingHistory', getGoodsHistoryCon)

// 商品搜索查询
router.get('/goodsSearch', goodsSearchCon)

// 添加购物车
router.post('/addGoodsCar', addGoodsCarCon)

// 读取购物车内容
router.get('/getGoodsCarList', getGoodsCarCon)

// 个人中心随机推荐好物
router.post('/randRemmGoods', randRemmGoodsCon)

// 物流查询
router.post('/queryExpress', queryExpressCon)

// 删除购物车单件商品
router.post('/deleteCarGoods', deleteSingleGoodsCon)

// 设置单件商品数量
router.post('/editGoodsCarSingleGoods', editGoodsCarSingleGoods)

// 查询分类
router.get('/queryGoodsClassify', queryGoodsClassify)

// 添加商品图片
router.post('/uploadGoodsImage', uploadGoodsImage)

// 删除图片
router.post('/deleteGoodsImage', deleteGoodsImage)

// 添加商品提交
router.post('/storeAddGoods', storeAddGoods)

// 商品分页查询
router.get('/getPainGoodsList', getPainGoodsList)

// 更新数据
router.post('/updataGoodsData', updataGoodsData)


module.exports = router