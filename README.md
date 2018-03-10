# Vue 简易手机商城

## 简介

自从接触了NodeJs之后，一直想结合Vue做一个完整的前端 + 后端商城，原本计划是有移动端、PC端以及管理后台，采用前后端完全分离开发，但是一系列开发下来，发现想完成这个计划是一个不小的工程，其中出现很多意想不到的问题，同时也在不断的学习成长，奈何时间有限，目前就只开发了移动端，以及部分后台(只有接口和数据...)，以后有时间会逐渐完善

## 效果演示

[Vue手机商城](http://114.67.236.62) （请使用手机打开，并不是一个pc端项目 ~~~）

__注:为了更好的体验,需要自己注册一个账号__

为了方便演示，这里提供了两个账号.当然可能存在多个用户同时操作一个账号.

```txt
 账号: admin123  密码: 123456
 账号: root123 密码: 123456
```

## 所使用的技术栈

前端部分:

    IDE: Visual Studio Code
    框架: Vue2.0
    技术栈: vuex 、vue-router 、vue-cli 、ES6 、flexible.js 、axios
    打包工具: webpack3.0
    包管理工具: npm

后端部分:

    语言环境: NodeJs
    框架: express
    数据库: MongoDB / mongoose
    数据库管理: Robo 3T
    数据加密: md5
    包管理工具: npm


## 关于开发环境

前端所有代码通过eslint的standard风格检查，如果报错请注意是否有多余的空格、换行、分号、变量，或者使用了双引号等等

跨域问题，在 config/index.js 可以修改proxyTable中的地址，使用代理来连接接口


## 运行项目

#### 数据库

    1、本地已安装MongoDB
    2、新建库 vueMall
    3、新建两个表分别名为 users 和 goods 存放用户数据和产品数据
    4、分别导入根目录下json文件夹里的数据
    5、启动数据库

    PS：由于篇幅过长，方法请自行百度，谢谢！

#### 后台接口

把整个项目clone到本地
```shell
    git clone https://github.com/yeguangcheng/vueMall.git
```
在vueMall - service目录下安装依赖包(由于文件不多放在了一起，但是依赖是分开的，可以单独运行)
```shell
    cd vueMall
    cd service
    npm install
```
在service/mongodb/db.js下检查数据库地址是否一致，然后启动服务器
```shell
    node service.js
```

#### 前端

回到vueMall目录，安装依赖包
```shell
    cd ../
    npm install
```
在config/index.js 下检查proxyTable中的地址和端口是否和服务器一致，然后启动开发环境
```shell
    npm run dev
```

## 部署生产环境

vueMall目录下
```shell
    npm run build
```
打包的文件在vueMall/dist下，复制到service/data目录下，打开地址
```shell
    http://localhost:3000/  //服务器的地址，不用输多余路由，什么index.html是不用的
```

## 说明

- 如果对您有帮助，您可以点右上角 "Star" 支持一下 十分感谢!
- 如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR

## 已开发的功能

- [x] 注册、登陆、登出、找密功能
- [x] 加入、删除、修改购物车
- [x] 新增、删除收货地址
- [x] 支付功能(模拟支付)
- [x] 商品详情
- [x] 首页滚动加载
- [x] 个人中心-订单列表

__注:其他功能待开发中~~__

## 项目目录

```txt
.
├── build                                       // webpack配置文件
├── config                                      // webpack配置文件
├── dist                                        // 打包文件目录
├── service                                     // 服务器文件
│   ├── data                                    // 静态资源管理
│   ├── mongodb                                 // 数据库配置
│   │   └── db.js                               // 数据库基本配置
│   │   └── goodsListModel.js                   // 产品数据模型
│   │   └── user.js                             // 修改数据函数
│   │   └── userModel.js                        // 用户数据模型
│   ├── router                                  // 路由配置
│   │   └── goods.js                            // 修改产品接口
│   │   └── users.js                            // 修改用户接口
│   ├── util                                    // 公共库
│   │   └── index.js                            // 公共方法
│   ├── package.json                            // 依赖包管理
│   ├── service.js                              // 服务器入口文件
├── src                                         // 源码目录
│   ├── assets                                  // 静态资源目录
│   │   └── css                                 // css文件
│   │   └── images                              // 图片图标
│   │   └── js                                  // js文件
│   ├── components                              // 组件
│   │   └── AddressList.vue                     // 地址列表
│   │   └── Cart.vue                            // 购物车
│   │   └── Classify.vue                        // 分类
│   │   └── FindPassword.vue                    // 找回密码
│   │   └── Header.vue                          // 头部组件
│   │   └── Home.vue                            // 首页
│   │   └── Login.vue                           // 登录
│   │   └── Modal.vue                           // 弹窗
│   │   └── Nav.vue                             // 导航组件
│   │   └── NewAddress.vue                      // 新建地址
│   │   └── Order.vue                           // 确认订单
│   │   └── OrderDetail.vue                     // 订单详情
│   │   └── OrderList.vue                       // 订单列表
│   │   └── Product.vue                         // 产品详情
│   │   └── Register.vue                        // 注册
│   │   └── Success.vue                         // 支付成功
│   ├── router                                  // 路由
│   │   ├── index.js                            // 路由配置
│   ├── store                                   // 状态管理
│   │   ├── store.js                            // vuex配置
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件
├── static                                      // 外部静态资源
├── index.html                                  // 入口html文件
.

```
