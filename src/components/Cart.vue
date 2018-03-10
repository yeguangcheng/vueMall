<!-- 购物车 -->
<template>
  <div>
    <header-top>
      购物车
    </header-top>
    <div class="empty-tips" v-if="empty">
      <div class="shop">
        <img src="../assets/images/shop.png" alt="">
      </div>
      <p class="title">空空如也~</p>
      <p class="content">快去买买买给自己一个惊喜吧</p>
      <router-link to="home" class="gohome">
        去逛逛
      </router-link>
    </div>
    <ul class="cart-list" v-if="!empty">
      <li v-for="item in cartList" :key="item.id">
        <div :class="{'check':true, 'empty':item.checked == '0'}" @click="editCartList(item.productId, item.productNum,!item.checked)">
        </div>
        <div class="product-pic">
          <router-link :to="'/product?id=' + item.productId">
            <img :src="item.productImg" alt="">
          </router-link>
        </div>
        <div class="product-title">
          <h6>{{item.productName}}</h6>
          <div class="price">售价:<span>{{item.productPrice}}</span>元</div>
          <div class="count">
            <div class="reduce" @click="editCartList(item.productId, item.productNum - 1, item.checked)"></div>
            <input type="text" :value="item.productNum">
            <div class="add" @click="editCartList(item.productId, item.productNum + 1, item.checked)"></div>
          </div>
          <div class="delete" @click="confirmDel(item.productId)">
          </div>
        </div>
      </li>
    </ul>
    <div :class="{'total':true,'show':!empty}">
      <div :class="{check:true,all:!all}" @click="checkAll">
      </div>
      <div class="total-price">
        合计：¥ <span>{{total}}</span>元
      </div>
      <div class="submit" @click="settle">
        结算({{curCount}})
      </div>
    </div>
    <bottom-nav v-if="empty"></bottom-nav>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="delProduct">确定</button>
        <button @click="closeModal" class="cancel">取消</button>
      </div>
    </modal>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
import Modal from './Modal'
import BottomNav from './Nav'
export default {
  data () {
    return {
      empty: true, // 购物车列表是否为空,true为空 false为有
      cartList: [], // 购物车列表
      modalText: '', // 弹窗组件内容
      delProductId: 0, // 待删除的商品id
      all: true
    }
  },
  computed: {
    login() {
      return this.$store.state.loginStatus
    },
    total() {
      var num = 0
      this.cartList.forEach(item => {
        if (item.checked === 1) {
          num += item.productPrice * item.productNum
        }
      })
      return num
    },
    curCount() {
      var count = 0
      this.cartList.forEach(item => {
        if (item.checked === 1) {
          count++
        }
      })
      return count
    }
  },
  components: {
    HeaderTop,
    Modal,
    BottomNav
  },
  created() {
    // 载入组件时初始化导航信息
    this.$store.commit('increment', 'cart')
    // 获取服务器中的购物车列表
    this.getCartList()
    this.$store.commit('changeLink', 'home')
  },
  methods: {
    // 获取购物车列表
    getCartList() {
      var _this = this
      axios
        .get('/api/user/cartlist')
        .then(function(res) {
          if (res.data.status === '0') {
            // 如果列表为空则打开空开关
            if (res.data.result.length === 0) {
              _this.empty = true
              _this.all = false
              return ''
            }
            // 更新列表
            _this.cartList = res.data.result
            // 更新全选按钮
            var checkAll = 0
            _this.cartList.forEach(item => {
              if (item.checked === 1) {
                checkAll = 1
              }
            })
            _this.all = checkAll
            _this.empty = false
          } else {
            _this.empty = true
          }
        })
    },
    // 购物车列表编辑
    editCartList(id, num, checked) {
      // 商品数量最小为1
      if (num <= 1) {
        num = 1
      }
      // 清空已存的价格和数量
      var checkFlag = checked ? 1 : 0
      var checkAll = 0
      // 修改本地数据
      this.cartList.forEach(item => {
        // 更新产品数量和选中状态
        if (item.productId === id) {
          item.productNum = num
          item.checked = checkFlag
        }
        // 更新全选状态
        if (item.checked === 1) {
          checkAll = 1
        }
      })
      this.all = checkAll
      // 发送请求修改数据
      axios
        .post('/api/user/cart/edit', {
          productId: id,
          productNum: num,
          checked: checked
        })
        .then(function(res) {
          if (res.data.status === '0') {
            // _this.getCartList()
          } else {
            console.log('未知错误，请重试')
          }
        })
    },
    // 调用弹窗确认是否删除
    confirmDel(id) {
      this.delProductId = id
      this.$store.commit('controlModal', true)
      this.modalText = '确认删除该商品？'
    },
    // 关闭弹窗
    closeModal() {
      this.$store.commit('controlModal', false)
    },
    // 删除商品
    delProduct() {
      var _this = this
      axios
        .post('/api/user/cart/del', {
          productId: _this.delProductId
        })
        .then(function(res) {
          if (res.data.status === '0') {
            var ary = _this.cartList
            ary.forEach((item, index) => {
              if (item.productId === _this.delProductId) {
                ary.splice(index, 1)
                _this.cartList = ary
                return ''
              }
            })
            _this.closeModal()
          } else {
            _this.getCartList()
            _this.closeModal()
            console.log('未知错误，请重试')
          }
        })
    },
    // 商品结算
    settle() {
      if (this.total > 0 || this.curCount > 0) {
        this.$router.push('/order')
      }
    },
    // 全选切换
    checkAll() {
      var checkedAll = 0
      this.cartList.forEach(item => {
        if (item.checked === 0) {
          checkedAll = 1
          this.all = true
        } else {
          checkedAll = 0
          this.all = false
        }
      })
      this.cartList.forEach(item => {
        item.checked = checkedAll
      })
      var _this = this
      axios
        .post('/api/user/cart/checkAll', {
          checked: checkedAll
        })
        .then(function(res) {
          if (res.data.status === '0') {
            _this.closeModal()
          } else {
            _this.getCartList()
            _this.closeModal()
            console.log('未知错误，请重试')
          }
        })
    }
  }
}
</script>
<style scoped>
.empty-tips{
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
}
.empty-tips .shop{
  width: 300px;
  height: 300px;
  margin: 80px 0 40px 0;
}
.empty-tips .shop img{
  width: 100%;
  height: 100%;
}
.empty-tips .title{
  font-size: 38px;
  line-height: 80px;
}
.empty-tips .content{
  font-size: 32px;
  line-height: 80px;
  color: rgb(190, 190, 190);
}
.empty-tips .gohome{
  height: 80px;
  width: 280px;
  border: 1px solid #ff6700;
  line-height: 80px;
  text-align: center;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  color: #ff6700;
  font-size: 30px;
}
.cart-list{
  margin-top: 100px;
  margin-bottom: 120px;
}
.cart-list li{
  -webkit-display: flex;
  display: flex;
  align-items: center;
  margin-top: 40px;
}
.cart-list .check{
  width: 44px;
  height: 44px;
  background: url('src/assets/images/check_press.png') no-repeat center center;
  background-size: 100% 100%;
  border: 1px solid #ff6700;
  border-radius: 50%;
  margin: 0 16px;
}
.cart-list .check.empty{
  background: none;
  border: 1px solid #ccc;
  border-radius: 50%;
}
.cart-list .product-pic{
  width: 202px;
  height: 202px;
  border: 1px solid #ccc;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.cart-list .product-pic a{
  display: block;
  width: 200px;
  height: 200px;
}
.cart-list .product-pic img{
  width: 100%;
  height: 100%;
}
.cart-list .product-title{
  width: 450px;
  position: relative;
  margin:0 20px;
}
.cart-list .product-title h6{
  font-size: 30px;
  font-weight: normal;
  color: #555;
  height: 80px;
}
.cart-list .product-title .price{
  font-size: 24px;
  color: #999;
  height: 48px;
  line-height: 48px;
}
.cart-list .count {
  display: flex;
  -webkit-display: flex;
  align-items: center;
  height: 66px;
  margin-top: 12px;
}
.cart-list .count .reduce{
  width: 60px;
  height: 60px;
  background: url('src/assets/images/reduce.png') no-repeat center center;
  background-size: 60%;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.cart-list .count .reduce.empty,.cart-list .count .add.empty{
  opacity: 0.3;
}
.cart-list .count input {
  border: none;
  outline: none;
  width: 70px;
  height: 58px;
  line-height: 50px;
  font-size: 30px;
  text-align: center;
}
.cart-list .count .add{
  width: 60px;
  height: 60px;
  background: url('src/assets/images/add.png') no-repeat center center;
  background-size: 60%;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.cart-list .product-title .delete{
  width: 70px;
  height: 70px;
  background: url('src/assets/images/delete.png') no-repeat center center;
  background-size: 100% 100%;
  position:absolute;
  right: 10px;
  bottom: -10px;
}
.total {
  height: 100px;
  line-height: 100px;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom:0;
  border-top: 1px solid #ddd;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  display: none;
}
.total.show {
  -webkit-display: flex;
  display: flex;
}
.total .check{
  width: 44px;
  height: 44px;
  background: url('src/assets/images/check_press.png') no-repeat center center;
  background-size: 100% 100%;
  margin: 0 16px;
  border: 1px solid #fff;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.total .check.all{
  background: none;
  border: 1px solid #ccc;
}
.total .total-price {
  font-size: 28px;
  width: 368px;
  text-indent:20px;
}
.total .submit{
  background: #ff6700;
  border-top: 1px solid #ff6700;
  text-align: center;
  font-size: 32px;
  color: #fff;
  width: 306px;
}
</style>
