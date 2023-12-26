const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/setting' })
const { isAdmin } = require('../middleware/admin.moddleware')
const { getHeadImgList, getClassifyTags, uploadHeadImg, deleteHeadImage } = require('../controller/admin.controller/setting.controller')

// 获取头图
router.get('/getHeadImage', getHeadImgList)

// 获取分类
router.get('/getClassifyTags', getClassifyTags)

// 修改头图
router.post('/editHeadImage', isAdmin, uploadHeadImg)
// 图片删除
router.post('/deleteHeadImage', isAdmin, deleteHeadImage)

// 修改分类标签
router.post('/editClassifyTags', isAdmin)

module.exports = router