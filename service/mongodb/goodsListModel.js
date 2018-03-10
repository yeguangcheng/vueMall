/**
 * 商品列表
 */
var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var productSchema = new Schema({
  productId: { type: String }, //商品ID
  productName: { type: String }, //商品名称
  productPrice: { type: Number }, //商品价格
  productImg: { type: Array }, //商品图片
  count: { type: Number },
  checked: { type: Number },
  productNum: { type: Number }
});

module.exports = mongoose.model('goods', productSchema);