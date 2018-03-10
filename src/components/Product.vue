<!-- 产品详情 -->
<template>
  <div class="product">
    <div class="back" @click="goback"></div>
    <div class="product-banner">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in product.productImg" :key="item.id">
          <img :src="item" alt="">
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="product-title">
      <h4>{{product.productName}}</h4>
      <p>{{product.subtitle}}</p>
      <div class="product-price">
        <em>￥{{product.productPrice}}</em><span>￥{{product.oldPrice}}</span>
      </div>
    </div>
    <div class="product-content">
      <div class="title">产品概述</div>
      <div class="pic">
        <img v-for="item in product.detailsImg" :src="item" :key="item.id" alt="">
      </div>
    </div>
    <ul class="bottom-nav">
      <li class="home">
        <router-link to="/home">
          <i class="fa fa-home"></i>首页
        </router-link>
      </li>
      <li class="cart">
        <router-link to="/cart">
          <i class="fa fa-shopping-cart"></i>购物车
        </router-link>
      </li>
      <li class="addcart" @click="addCart()">
          加入购物车
      </li>
    </ul>
    <div :class="{'tips':true, 'active':tipsShow}">
      成功加入购物车！
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import axios from 'axios'
export default {
  data () {
    return {
      swiperOption: {
        notNextTick: true,
        direction: 'horizontal',
        grabCursor: true,
        setWrapperSize: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        mousewheelControl: true,
        observeParents: true,
        debugger: true
      },
      product: [], // 产品内容
      productId: this.$route.query.id, // 当前产品id
      modalText: '', // 弹窗组件内容
      tipsShow: false // 加购提示框
    }
  },
  computed: {
    login() {
      return this.$store.state.loginStatus
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    // 路由返回
    goback() {
      this.$router.go(-1)
    },
    // 添加购物车
    addCart() {
      if (!this.login) {
        this.$router.push('/login')
        return ''
      }
      var _this = this
      axios
        .post('/api/user/addCart', {
          productId: _this.productId
        })
        .then(function(res) {
          if (res.data.status === '0') {
            _this.cartList = res.data.result
            _this.tipsShow = true
            setTimeout(function() {
              _this.tipsShow = false
            }, 2500)
          } else {
          }
        })
    }
  },
  created() {
    this.$store.commit('changeLink', '')
    var _this = this
    var productId = this.$route.query.id
    axios
      .get('/api/goodslist/detail?id=' + productId)
      .then(function(res) {
        if (res.data.status === '0') {
          _this.product = res.data.result
        } else {
        }
      })
  }
}
</script>
<style>
.product{
  background: #efefef;
  margin-bottom: 100px;
}
.product .back{
  width: 60px;
  height: 60px;
  background: url('src/assets/images/back.png') rgba(0, 0, 0, 0.6) no-repeat 7px 8px;
  background-size: 70% 70%;
  border-radius: 50%;
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 2;
}
.product .back a{
  display: block;
  width: 100%;
  height: 100%;
}
.swiper-slide{
  width: 100%;
}
.swiper-slide img{
  width: 100%;
}
.swiper-pagination-bullet{
  width: 0.18rem;
  height: 0.18rem;
}
.swiper-pagination-bullet-active{
  background: #fff;
}
.product .product-banner{
  background: #fff;
}
.product .product-content .pic{
  width: 100%;
}
.product .product-content .pic img{
  width: 100%;
  vertical-align: bottom;
}
.product .product-title{
  padding: 20px 30px;
  background: #fff;
}
.product .product-title h4{
  font-weight: normal;
  font-size: 36px;
  line-height: 50px;
  max-height: 100px;
  overflow: hidden;
  color: #000;
}
.product .product-title p{
  color: #666;
  line-height: 40px;
  font-size: 24px;
}
.product .product-title .product-price{
  color: #ff6700;
}
.product .product-title .product-price em{
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
}
.product .product-title .product-price span{
  font-size: 24px;
  color: #666;
  text-decoration: line-through;
  margin-left: 20px;
}
.product .product-content .title{
  height: 100px;
  background: #fff;
  line-height: 100px;
  color: #000;
  font-size: 26px;
  margin-top: 20px;
  text-indent: 30px;
}
.product .tips{
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 50%;
  top: 50%;
  width: 320px;
  height: 100px;
  margin-left: -160px;
  margin-top: -50px;
  line-height: 100px;
  text-align: center;
  font-size: 34px;
  z-index: 3;
  color: #fff;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  opacity: 0;
  -webkit-transform: translateY(50px);
  transform: translateY(50px);
  display: none;
}
.product .tips.active{
  display: block;
  -webkit-animation: moves 2.5s linear 0.1s;
  animation: moves 2.5s linear 0.1s;
}
@-webkit-keyframes moves{
  0%{
    opacity: 0;
    transform: translateY(50px);
  }
  20%{
    opacity: 1;
    transform: translateY(0px);
  }
  60%{
    opacity: 1;
    transform: translateY(0px);
  }
  100%{
    opacity: 0;
    transform: translateY(0px);
  }
}
@keyframes moves{
  0%{
    opacity: 0;
    transform: translateY(50px);
  }
  20%{
    opacity: 1;
    transform: translateY(0px);
  }
  60%{
    opacity: 1;
    transform: translateY(0px);
  }
  100%{
    opacity: 0;
    transform: translateY(0px);
  }
}
.bottom-nav{
  position: fixed;
  left: 0;
  bottom: 0;
  right:0;
  height: 100px;
  display: -webkit-flex;
  display: flex;
  background: #fff;
}
.bottom-nav li{
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom-nav li:first-child,.bottom-nav li:nth-child(2){
  border-top: 1px solid #e1e1e1;
}
.bottom-nav li a{
  display: block;
  color: #999;
  height: 80px;
  display: flex;
  justify-content:center;
  align-items:Center;
  flex-direction:column;
  font-size: 22px;
}
.bottom-nav li i{
  display: block;
  font-size: 46px;
}
.bottom-nav .home,.bottom-nav .cart{
  width: 187px;
}
.bottom-nav .home a{
  width: 187px;
}
.bottom-nav .addcart{
  background: #ff6700;
  text-align: center;
  color: #fff;
  width: 376px;
  font-size: 30px;
}
</style>
