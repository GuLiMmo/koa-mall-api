const AlipaySdk = require('alipay-sdk').default;

// sdk配置
const alipaySdk = new AlipaySdk({
    //APPID
    appId: '',
    //签名算法
    signType: '',
    //支付宝公钥
    alipayPublicKey: '',
    //应用私钥
	privateKey: '',
	//支付宝网关
    gateway: "" // 沙箱环境的请求网关与正式环境不一样，需要在此更改，如果是使用正式环境则去掉此处的设置
});

module.exports = alipaySdk