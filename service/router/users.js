var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('../mongodb/userModel.js')
var Goods = require('../mongodb/goodsListModel.js')
var util = require('../util/util.js')
var md5 = require('md5')
var app = express()

var cookieParser = require('cookie-parser')
app.use(cookieParser())


//加入购物车功能
router.post('/addCart', function (req, res, next) {
  if(!req.cookies.userId){
    res.json({
      status: '1',
      msg: '没有登录'
    })
  }

  var userId = req.cookies.userId;
  var productId = parseInt(req.body.productId);
  var params = {
    userId: userId
  }

  //根据用户id查找用户数据
  User.findOne(params, function (err, userData) {
    //获取到用户数据后的回调
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userData) {
        //成功获取数据的回调
        //判断当前用户信息中有无相同的产品
        let goodsItem = false;

        userData.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = true;
            item.productNum++
          }
        })

        //如果存在相同的产品，则数量++然后保存
        if (goodsItem) {
          userData.save(function (err, doc2) {
            //保存成功后的回调
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              if (doc2) {
                //成功获取数据的回调
                res.json({
                  status: '0',
                  msg: '保存成功'
                })
              } else {
                res.json({
                  status: '1',
                  msg: '数量添加失败'
                })
              }
            }
          })
        } else {
          //如果没有则查找对应的产品信息
          Goods.findOne({ productId: productId }, function (err, doc) {
            //获取到产品数据后的回调
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              if (doc) {
                //成功获取数据的回调
                //将得到的产品数据添加数量和加购确认，在用户信息中的购物车列表增加新数组
                doc.checked = 1;
                doc.productNum = 1;
                userData.cartList.push(doc);
                userData.save(function (err, doc2) {
                  //保存成功后的回调
                  if (err) {
                    res.json({
                      status: '1',
                      msg: err.message
                    })
                  } else {
                    if (doc2) {
                      //成功获取数据的回调
                      res.json({
                        status: '0',
                        msg: '保存成功'
                      })
                    } else {
                      res.json({
                        status: '1',
                        msg: '添加购物车失败'
                      })
                    }
                  }
                })
              } else {
                res.json({
                  status: '1',
                  msg: '产品信息为空'
                })
              }
            }
          })
        }
        } else {
          res.json({
            status: '1',
            msg: '数据为空'
          })
        }
      }

  })



})

//获取数据并执行判断的函数
function getDataCallback(err, userData, callback) {
  if (err) {
    res.json({
      status: '1',
      msg: err.message
    })
  } else {
    if (userData) {
      //成功获取数据的回调
      callback(userData)
    } else {
      res.json({
        status: '1',
        msg: '数据为空'
      })
    }
  }
}

//查询密码提示问题接口
router.post('/checkPwdQuestion', function (req, res, next) {
  //接收传递的用户名
  var params = {
    userName: req.body.userName
  }

  User.findOne(params, function (err, data) {
    //如果错误则返回错误信息
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      //如果返回了用户信息则返回密码提示问题
      if (data) {
        //将用户名返回
        res.json({
          status: '0',
          msg: '',
          result: {
            pwdQuestion: data.pwdQuestion
          }
        })
      } else {
        //如果返回信息为空，则表示查询不到信息
        res.json({
          status: '1',
          msg: '没有查询到相关数据'
        })
      }
    }
  })
})

//查询密码提示答案接口
router.post('/inspectPwdAnswer', function (req, res, next) {
  //接收传递的用户名
  var params = {
    userName: req.body.userName,
    pwdAnswer:md5(md5(req.body.pwdAnswer + 27017 + 'ygc'))
  }

  User.findOne(params, function (err, data) {
    //如果错误则返回错误信息
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      //如果返回了用户信息则返回密码提示问题
      if (data) {
        //将用户名返回
        res.json({
          status: '0',
          msg: '验证成功'
        })
      } else {
        //如果返回信息为空，则表示查询不到信息
        res.json({
          status: '1',
          msg: '没有查询到相关数据'
        })
      }
    }
  })
})

//修改密码接口
router.post('/newPwd', function (req, res, next) {

  //接收传递的用户名
  var params = {
    userName: req.body.userName,
    userPwd:md5(md5(req.body.userPwd + 27017 + 'ygc'))
  }

  User.update({ 'userName': params.userName }, { 'userPwd': params.userPwd }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '修改成功'
      })
    }
  })
})

//登录接口
router.post('/login', function (req, res, next) {
  //接收传递的用户名和密码
  var params = {
    userName: req.body.userName,
    userPwd: md5(md5(req.body.userPwd + 27017 + 'ygc'))
  }

  User.findOne(params, function (err, data) {
    //如果错误则返回错误信息
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      //如果返回了用户信息则设置cookie和session
      if (data) {
        res.cookie('userId', data.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', data.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        //将用户名返回
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: data.userName,
            userId: data.userId
          }
        })
      } else {
        //如果返回信息为空，则表示查询不到信息
        res.json({
          status: '1',
          msg: '没有查询到相关数据'
        })
      }

    }

  })
})

//登出接口
router.post('/logout', function (req, res, next) {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  })
  res.cookie("userName", "", {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

//检查登录状态接口
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName,
        userId: req.cookies.userId
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//获取购物车列表
router.get('/cartlist', function (req, res, next) {
  if(!req.cookies.userId){
    res.json({
      status: '1',
      msg: '没有登录'
    })
    return
  }
  var params = {
    userId: req.cookies.userId
  }
  User.findOne(params, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: err.message
      })
    } else {
      if (data.cartList.length >= 0) {
        res.json({
          status: '0',
          msg: '',
          result: data.cartList
        })
      } else{
        res.json({
          status: '1',
          msg: '购物车无数据'
        })
      }
    }
  })
})

//购物车删除接口
router.post('/cart/del', function (req, res, next) {
  var params = {
    userId: req.cookies.userId
  }
  var productId = req.body.productId
  User.update(params, { $pull: { 'cartList': { 'productId': productId } } }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})

//购物车商品数量编辑接口
router.post('/cart/edit', function (req, res, next) {

  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;

  User.update({ 'userId': userId, 'cartList.productId': productId }, { 'cartList.$.productNum': productNum, 'cartList.$.checked': checked }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})

//购物车全选切换接口
router.post('/cart/checkAll', function (req, res, next) {
  var userId = req.cookies.userId;
  var checked = req.body.checked;

  User.findOne({ 'userId': userId }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (data) {
        data.cartList.forEach(item => {
          item.checked = checked;
        })
        data.save(function (err, doc) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            })
          }
        })
      }
    }
  })
})

//获取地址列表接口
router.get('/addressList', function (req, res, next) {
  var params = {
    userId: req.cookies.userId
  }
  User.findOne(params, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: err.message
      })
    } else {
      if (data) {
        res.json({
          status: '0',
          msg: '',
          result: data.addressList
        })
      }
    }
  })
})

//添加地址接口
router.post('/newAddress', function (req, res, next) {
  var params = {
    userId: req.cookies.userId
  }
  var newObj = {
    userName: req.body.userName,
    streetName: req.body.streetName,
    tel: req.body.tel,
    city: req.body.city,
    isDefault: req.body.isDefault
  }
  User.findOne(params, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: err.message
      })
    } else {
      var addressList = data.addressList;
      newObj.addressId = 10000 + addressList.length;
      addressList.push(newObj)
      if (newObj.isDefault) {
        addressList.forEach(function (item) {
          if (item.addressId == newObj.addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        })
      }
      data.save(function(err,doc){
        if (err) {
          res.json({
            status: '1',
            msg: '',
            result: err.message
          })
        } else {
          res.json({
            status: '0',
            msg: '添加成功'
          })
        }
      })
    }
  })
})

//设置地址列表接口
router.post('/setDefault', function (req, res, next) {
  var params = {
    userId: req.cookies.userId
  }
  var addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1',
      msg: 'addressId is null',
      result: ''
    })
  }

  User.findOne(params, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: err.message
      })
    } else {
      var addressList = data.addressList;
      addressList.forEach(function (item) {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      })
      data.save(function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: '',
            result: err.message
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      })
    }
  })
})

//删除地址列表接口
router.post('/delAddress', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = parseInt(req.body.addressId);
  User.update({ userId: userId }, { $pull: { 'addressList': { 'addressId': addressId } } }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})

//创建订单接口
router.post('/payMent', function (req, res, next) {
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  User.findOne({ userId: userId }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      //获取当前用户的地址信息
      var address = '';
      var goodsList = [];

      data.addressList.forEach(function (item) {
        if (addressId == item.addressId) {
          address = item;
        }
      })
      //获取用户购物车的购买商品
      for (var i = 0; i < data.cartList.length; i++){
        if (data.cartList[i].checked == '1') {
          goodsList.push(data.cartList[i])
          data.cartList.splice(i,1)
          i--
        }
      }
      var platform = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy--MM--dd-- hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2

      //创建订单
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      //保存订单
      data.orderList.push(order);
      data.save(function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          var lastOrder = doc.orderList[doc.orderList.length - 1]
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: lastOrder.orderId,
              orderTotal: lastOrder.orderTotal
            }
          })
        }
      })
    }
  })
})

//根据订单ID查询订单信息
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId;
  var orderId = req.query.orderId;
  User.findOne({ userId: userId }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = data.orderList;
      if(!orderId){
        res.json({
          status: '0',
          msg: '',
          result: orderList
        })
        return
      }
      if (orderList.length > 0) {
        var orderTotal = 0;
        var orderDetail = null
        orderList.forEach(function (item) {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
            orderDetail = item
          }
        })
        res.json({
          status: '0',
          msg: '',
          result: {
            orderDetail: orderDetail,
            orderTotal: orderTotal
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '',
          result: '无此订单'
        })
      }
    }

  })
})


//查询购物车数量
router.get('/getCartCount', function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, function (err, data) {
      if (err) {
        res.json({
          status: '1',
          msg: '',
          result: ''
        })
      } else {
        var cartList = data.cartList;
        var cartCount = 0;
        cartList.forEach(function (item) {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    })
  }
})

//注册用户接口
router.post('/addUsers', function (req, res, next) {
  User.find({}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 判断用户是否已经存在
      for(i=0;i<data.length;i++){
        if(data[i].userName == req.body.userName){
          res.json({
            status: '2',
            msg: '用户已存在'
          })
          return;
        }
      }
      var date = new Date()
      var user = new User({
        userId: date.getFullYear().toString() + parseInt(Math.random() * 100000) + data.length, //用户ID
        userName: req.body.userName, //用户名
        userPwd: md5(md5(req.body.userPwd + 27017 + 'ygc')), //用户密码
        orderList: [], //订单列表
        mobile: req.body.mobile, // 手机号码
        pwdQuestion: req.body.pwdQuestion, //密码提示问题
        pwdAnswer: md5(md5(req.body.pwdAnswer + 27017 + 'ygc')), //密码提示答案
        cartList: [], //购物车列表
        addressList: []
      });

      user.save(function (err, data) {

        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        }
        else {
          res.json({
            status: '0',
            msg: '添加用户成功'
          })
        }
      })
    }
  }) 
})







module.exports = router