var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../mongodb/goodsListModel.js')

//获取商品列表信息
router.get('/page', function (req, res, next) {
  let page = parseInt(req.query.page); //当前页数
  let pageSize = parseInt(req.query.pageSize); //当前页显示数量
  let sort = req.query.sort; //排序规则，-1降序 1升序
  let skip = (page - 1) * pageSize; //跳过的数量（当前页-1*每页数量）
  let filterPrice = req.query.ltPrice == 0 ? false : true; //根据传参判断是否筛选数据
  let params = {}; //查询条件，空为搜索全部

  //如果筛选数据则将规则添加到params
  if (filterPrice) {
    params.productPrice = {
      $lte: parseInt(req.query.ltPrice),
      $gte: parseInt(req.query.gtPrice)
    }
  }
  //数据库查找数据
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  if (sort != 0) {
    goodsModel.sort({ 'productPrice': sort });
  }
  goodsModel.exec(function (err, doc) {
    //错误返回值
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      //成功返回数据
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

//如果没有任何参数，则返回所有数据
router.get('/', function (req, res, next) {
  // 如果有传入分类则进行存储
  var params = {
    classify : req.query.classify
  }
  // 如果没有则返回所有
  if(!params.classify){
    params = {}
  }
  Goods.find(params, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

router.get('/detail', function (req, res, next) {
  Goods.findOne({productId:req.query.id}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  })
})

module.exports = router