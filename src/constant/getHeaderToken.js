module.exports = function getHeaderToken(ctx) {
    // 取出token
    const token = ctx.request.header.authorization
    return token
}