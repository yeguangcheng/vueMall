<!-- 确认订单 -->
<template>
  <div class="order">
    <header-top>
      确认订单
    </header-top>
    <div class="address">
      <div class="list">
        <router-link to="/addressList">
          <div class="empty" v-if="empty">
              <div class="icon"></div>
              <p class="tips">请新建收货地址以确保商品顺利到达</p>
          </div>
          <div class="content" v-for="item in defaultAddress" :key="item.id">
            <div class="name">
              <p>{{item.userName}}<span>{{item.tel}}</span></p>
            </div>
            <div class="street">
              {{item.city}}{{item.streetName}}
            </div>
            <i class="fa fa-angle-right"></i>
          </div>
        </router-link>
      </div>
    </div>
    <ul class="pay">
      <li>
        微信支付  <span>推荐使用 更安全便捷</span><i :class="{check:true,cur:pay==='wx'}" @click="pay='wx'"></i>
      </li>
      <li>
        支付宝  <span>支付订单，赢1999元红包</span><i :class="{check:true,cur:pay==='zfb'}" @click="pay='zfb'"></i>
      </li>
    </ul>
    <ul class="product">
      <li v-for="item in cartList" :key="item.id">
        <div class="pic">
          <img :src="item.productImg[0]" alt="">
        </div>
        <div class="title">
          <h6>{{item.productName}}</h6>
          <span class="count">x<em>{{item.productNum}}</em></span>
        </div>
        <div class="price">
          {{item.productPrice}}元
        </div>
      </li>
    </ul>
    <div class="detailed">
      <p>商品价格：<span>{{total}}元</span></p>
      <p>配送费用：<span>0.00</span></p>
    </div>
    <div class="total">
      <div class="total-price">
        共<span>{{curCount}}</span>件 合计：<b>{{total}}</b>元
      </div>
      <div class="submit" @click="orderPay">
        去付款
      </div>
    </div>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="closeModal">确定</button>
      </div>
    </modal>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
import Modal from './Modal'
export default {
  data () {
    return {
      cartList: [], // 购物车列表
      total: 0, // 总金额
      curCount: 0, // 总件数
      defaultAddress: [], // 默认地址
      pay: 'wx', // 支付方式
      empty: true,
      modalText: ''
    }
  },
  components: {
    HeaderTop,
    Modal
  },
  methods: {
    // 获取购物车列表
    getCartList() {
      var _this = this
      axios
        .get('/api/user/cartlist')
        .then(function(res) {
          if (res.data.status === '0') {
            if (res.data.result.length === 0) {
              _this.$router.push('/cart')
              _this.empty = true
              return ''
            }
            _this.total = 0
            _this.curCount = 0
            // 计算选中总金额和数量
            res.data.result.forEach(item => {
              if (item.checked === 1) {
                _this.total += item.productPrice * item.productNum
                _this.curCount += item.productNum
                _this.cartList.push(item)
                _this.empty = false
              }
            })
          } else {
            _this.empty = true
            this.$router.push('/cart')
          }
        })
    },
    // 获取地址列表
    getAddressList() {
      var _this = this
      axios
        .get('/api/user/addressList')
        .then(function(res) {
          if (res.data.status === '0') {
            if (res.data.result.length === 0) {
              _this.empty = true
              return ''
            }
            var addressList = res.data.result
            addressList.forEach(item => {
              if (item.isDefault === true) {
                _this.defaultAddress.push(item)
              }
            })
            _this.empty = false
          }
        })
    },
    // 跳转支付
    orderPay() {
      if (!this.empty && this.total > 0) {
        var _this = this
        axios
          .post('/api/user/payMent', {
            orderTotal: _this.total,
            addressId: _this.defaultAddress[0].addressId
          })
          .then(function(res) {
            if (res.data.status === '0') {
              _this.$router.push('/success')
            }
          })
      } else {
        this.modalText = '请添加收货地址'
        this.$store.commit('controlModal', true)
      }
    },
    // 关闭弹窗
    closeModal() {
      this.$store.commit('controlModal', false)
    }
  },
  created() {
    this.getCartList()
    this.getAddressList()
    this.$store.commit('changeLink', 'cart')
  }
}
</script>
<style scoped>
.order{
  background: #f5f5f5;
  min-height: 100%;
  padding-bottom: 20px;
}
.order .address{
  margin-top: 100px;
  background: url('src/assets/images/address_bk.jpg');
  padding:10px 0;
}
.order .address .list{
  background: #fffaf4;
}
.order .address .list a{
  display: block;
  min-height: 160px;
}
.order .address .list .content{
  position: relative;
  padding-bottom: 20px;
  padding:0 50px;
  background: #fff;
}
.order .address .list .empty{
  min-height: 160px;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.order .address .list .content .name{
  font-size: 28px;
  height: 100px;
  line-height: 100px;
  color: #ff6700;
}
.order .address .list .content .name span{
  color: #555;
  margin-left: 50px;
}
.order .address .list .content .street {
  font-size: 26px;
  padding-right: 150px;
}
.order .address .list .content i{
  position: absolute;
  right: 30px;
  bottom: 30px;
  font-size: 38px;
}
.order .address .list .icon{
  width: 60px;
  height: 60px;
  background: url('src/assets/images/info_add.png') no-repeat;
  background-size: 100% 100%;
  margin-right: 10px;
}
.order .address .list .tips{
  font-size: 32px;
}
.order .pay{
  background: #fff;
  margin-top: 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding:0 30px;
}
.order .pay li{
  height: 100px;
  line-height: 100px;
  border-bottom: 1px solid #e5e5e5;
  text-indent: 80px;
  font-size: 26px;
  position: relative;
}
.order .pay li:last-child{
  border: none;
}
.order .pay li .check{
  position: absolute;
  right: 0px;
  top: 50%;
  margin-top: -22px;
  width: 44px;
  height: 44px;
  border: 1px solid #ccc;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.order .pay li .check.cur{
  background: url('src/assets/images/check_press.png') no-repeat center center;
  background-size: 100% 100%;
  border: 1px solid #ff6700;
}
.order .pay li:nth-child(1){
  background: url('src/assets/images/pay_wx.png') no-repeat 0 center;
  background-size: 50px 50px;
}
.order .pay li:nth-child(2){
  background: url('src/assets/images/pay_zfb2.png') no-repeat 0 center;
  background-size: 50px 50px;
}
.order .product {
  margin-top: 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #fff;
  margin-bottom:0;
}
.order .product li{
  display: flex;
  align-items: center;
  margin:20px;
  border-bottom: 1px solid #e5e5e5;
}
.order .product li:last-child{
  border: none;
}
.order .product li .pic{
  width: 120px;
  height: 120px;
}
.order .product li .pic img{
  width: 100%;
  height: 100%;
}
.order .product li .title{
  padding:0 10px;
  width: 480px;
}
.order .product li .title h6{
  font-size: 26px;
  font-weight: normal;
  width: 100%;
  height: 70px;
}
.order .product li .title .count em{
  font-style: normal;
}
.order .product li .price{
  width: 100px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}
.order .detailed{
  margin-top: 20px;
  background: #fff;
  border-top:1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 130px;
  padding: 0 30px;
  margin-bottom: 100px;
}
.order .detailed p {
  font-size: 26px;
  font-weight: bold;
}
.order .detailed p span{
  font-weight: normal;
}
.total {
  height: 100px;
  line-height: 100px;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom:0;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
}
.total .total-price {
  font-size: 33px;
  width: 400px;
  text-indent:20px;
  color: #ff6700;
}
.total .total-price span{
  font-size: 33px;
}
.total .submit{
  background: #ff6700;
  text-align: center;
  font-size: 32px;
  color: #fff;
  width: 350px;
}
</style>
