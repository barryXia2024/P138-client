# P138项目 API模块

本模块提供C端项目（客户端）的API请求功能，包括请求配置、环境设置和接口定义。



主要的配置常量包括：

- `BASEURL` - API基础URL（C端和B端共用同一个URL）
- `H5_URL` - C端H5页面URL
- `H5_Business_URL` - B端H5页面URL
- `USER_INFO_KEY` - 用户信息存储键
- `STORAGE_KEY` - 登录凭证存储键
- `defaultImage` - 默认图片URL

> 注意：为了兼容旧代码，我们保留了以下向后兼容的导出：
> - `Business_BASEURL` 实际上与 `BASEURL` 指向相同的值
> - `H5_Client_URL` 实际上与 `H5_URL` 指向相同的值
> 
> 在新代码中，推荐直接使用`BASEURL`和`H5_URL`。 