/**
 * 用户信息
 */
var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  userId: { type: Number }, //用户ID
  userName: { type: String }, //用户名
  userPwd: { type: String }, //用户密码
  orderList: { type: Array }, //订单列表
  pwdQuestion: { type: String }, //密码提示问题
  pwdAnswer: { type: String }, //密码提示答案
  mobile: { type: String }, //手机号码
  cartList: [ //购物车列表
    {
      productId: { type: Number },
      productName: { type: String },
      productPrice: { type: Number },
      productImg: { type: Array },
      count: { type: Number },
      checked: { type: Number },
      productNum: { type: Number }
    }
  ],
  addressList: [
  {
    addressId: { type: Number },
    userName: { type: String },
    city: { type: String },
    streetName: { type: String },
    postCode: { type: Number },
    tel: { type: Number },
    isDefault: { type: Boolean }
  }]
});

module.exports = mongoose.model('users', UserSchema); //填入集合名字，模型