module.exports = {
    // 账号或者密码错误
    userFormateError: {
        code: '10001',
        message: "账号密码为空或者格式不合法",
        result: ''
    },
    // 用户存在错误
    userAlreadyExited: {
        code: '10001',
        message: "用户名已存在",
        result: ''
    },
    // 用户注册错误
    userRegisterError: {
        code: '10002',
        message: "注册失败",
        result: ''
    },
    // 图片上传错误
    userUploadAvaterError: {
        code: '10001',
        message: "暂未上传图片",
        result: ''
    },
    // 邮箱发送错误
    emailSendError: {
        code: '10002',
        message: '邮箱为空',
        result: ''
    },
    // 邮箱验证错误
    vaildCodeError: {
        code: '10002',
        message: "验证失败，验证码错误",
        result: ""
    },
    // 用户登录失败
    userLoginError: {
        code: '10001',
        message: "登录失败，账号或者密码错误",
        result: ''
    },
    // 用户邮箱登录但用户不存在
    userEmailLoginError: {
        code: '10001',
        message: "登录失败，账号不存在",
        result: ''
    },
    // 退出账号失败
    userSignOutError: {
        code: '10001',
        message: "退出账号失败，请刷新重试",
        result: ''
    },
    // 查询用户信息失败
    queryUserInfoError: {
        code: '10002',
        message: "查询用户信息失败",
        result: ''
    }
}