const { parameterError } = require("../constant/error/goods.err.type")

// 查询参数问题
const queryParameterMid = async (ctx, next) => {
    const { startNums, endNums }  = ctx.query
    if (!startNums || !endNums) {
        ctx.app.emit('error', parameterError, ctx)
        return
    }
    await next()
}

// 单个商品查询时判断参数问题
const singleGoodsQueryParameterMid = async (ctx, next) => {
    const { id } = ctx.query
    if (!id) {
        ctx.app.emit('error', parameterError, ctx)
        return
    }
    await next()
}

module.exports = {
    queryParameterMid,
    singleGoodsQueryParameterMid
}