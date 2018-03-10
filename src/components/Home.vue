<!-- 首页 -->
<template>
  <div>
    <div class="home-search">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="">
      </div>
      <div class="search-btn">
        <i class="fa fa-search"></i>
        <span>搜索商品名称</span>
      </div>
      <div class="user">
        <router-link to="/login">
          <i class="fa fa-user-o"></i>
        </router-link>
      </div>
    </div>
    <div class="home-banner">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in banner" :key="item.id">
          <router-link :to="item.link">
            <img :src="item.pic" alt="">
          </router-link>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <ul class="home-classify">
      <li @click="routerToClassify('mobile')">
        <router-link to="/classify">
          <img src="../assets/images/2380136_1496658526.png" alt="">
        智能手机
        </router-link>
      </li>
      <li @click="routerToClassify('camera')">
        <router-link to="/classify">
          <img src="../assets/images/2380157_1496658643.png" alt="">
        智能摄像
        </router-link>
      </li>
      <li @click="routerToClassify('parts')">
        <router-link to="/classify">
          <img src="../assets/images/2380160_1496658666.png" alt="">
        手机配件
        </router-link>
      </li>
      <li @click="routerToClassify('digital')">
        <router-link to="/classify">
          <img src="../assets/images/2380163_1496658701.png" alt="">
        数码配件
        </router-link>
      </li>
      <li @click="routerToClassify('computer')">
        <router-link to="/classify">
          <img src="../assets/images/2380165_1496658720.png" alt="">
        电脑电视
        </router-link>
      </li>
    </ul>
    <div class="home-sales clearfix">
      <div class="item1">
        <router-link to="/product?id=10013">
          <img src="../assets/images/d9470e257a855aa12474440641fd51bd.png" alt="">
        </router-link>
      </div>
      <div class="item2">
        <router-link to="/product?id=10005">
          <img src="../assets/images/20180301182133.png" alt="">
        </router-link>
      </div>
      <div class="item3">
        <router-link to="/product?id=10004">
          <img src="../assets/images/224d50d9a070ebbf40d4b9622b115141.png" alt="">
        </router-link>
      </div>
    </div>
    <ul class="home-product clearfix">
      <li v-for="item in product" :key="item.id">
        <router-link :to="'/product?id=' + item.productId">
          <div class="pic">
            <img :src="item.productImg[0]" alt="">
          </div>
          <h6 class="tittle">{{item.productName}}</h6>
          <p class="price">
            <em class="newPrice">￥{{item.productPrice}}</em>
            <span class="oldPrice">￥{{item.oldPrice}}</span>
          </p>
        </router-link>
      </li>
      <infinite-loading @infinite="getData">
        <span slot="no-more" class="no-more">
          没有更多数据了...
        </span>
      </infinite-loading>
    </ul>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import BottomNav from './Nav'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
export default {
  data () {
    return {
      swiperOption: {
        notNextTick: true,
        autoplay: 3000,
        direction: 'horizontal',
        grabCursor: true,
        setWrapperSize: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        mousewheelControl: true,
        observeParents: true,
        debugger: true
      },
      banner: [
        {
          pic: 'https://img.alicdn.com/imgextra/i1/43353226/TB2DAUpXZyYBuNkSnfoXXcWgVXa_!!43353226.jpg',
          link: '/product?id=10012'
        },
        {
          pic: 'https://img.alicdn.com/imgextra/i3/43353226/TB2DorebGmWBuNjy1XaXXXCbXXa_!!43353226.jpg',
          link: '/product?id=10013'
        },
        {
          pic: 'https://img.alicdn.com/imgextra/i3/43353226/TB2vxK2bHuWBuNjSszgXXb8jVXa_!!43353226.jpg',
          link: '/product?id=10011'
        }
      ],
      product: [],
      pageNo: 1,
      pageSize: 8
    }
  },
  components: {
    swiper,
    swiperSlide,
    BottomNav,
    InfiniteLoading
  },
  created() {
    // 载入组件时初始化导航信息
    this.$store.commit('increment', 'home')
    this.$store.commit('changeLink', '')
  },
  methods: {
    getData($state) {
      var _this = this
      axios
        .get('/api/goodslist/page?page=' + this.pageNo + '&pageSize=' + this.pageSize + '&sort=-1&ltPrice=0')
        .then(function(res) {
          if (res.data.status === '0') {
            _this.pageNo++
            _this.product = _this.product.concat(res.data.result.list)
            try {
              $state.loaded()
            } catch (e) {
            }
            if (res.data.result.list.length < _this.pageSize) {
              $state.complete()
            }
          } else {
            console.log(res.data.msg)
            $state.complete()
          }
        })
    },
    routerToClassify(val) {
      this.$store.commit('changeClassifyCur', val)
      this.$router.push('/classify')
    },
    infiniteHandler($state) {
      setTimeout(() => {
        const temp = []
        for (let i = this.list.length + 1; i <= this.list.length + 20; i++) {
          temp.push(i)
        }
        this.list = this.list.concat(temp)
        $state.loaded()
      }, 1000)
    }
  }
}
</script>

<style>
.home-search{
  -webkit-display: flex;
  display: flex;
  align-items:center;
  justify-content:flex-start;
  height: 100px;
  background: #f2f2f2;
}
.home-search .search-btn{
  background: #fff;
  border:1px solid rgb(172, 170, 170);
  -webkit-border-radius:5px;
  border-radius:5px;
  height: 60px;
  line-height: 60px;
  width: 100%;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  color: rgb(151, 150, 150);
  font-size: 30px;
}
.home-search .search-btn i{
  margin:0 14px;
}
.home-search .user{
  color: #666;
  font-size: 40px;
  width: 120px;
  text-align: center;
}
.home-search .logo{
  width: 130px;
  text-align: center;
  margin:0 20px;
}
.home-search .logo img{
  width: 100%;
}
.home-banner{
  width: 100%;
  overflow: hidden;
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
.home-classify{
  display: flex;
  padding:20px 0;
}
.home-classify li{
  flex:1;
}
.home-classify li a{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 24px;
}
.home-classify li img{
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}
.home-sales{
  background: #f2f2f2;
  padding-bottom: 16px;
}
.home-sales .item1{
  float: left;
  width: 372px;
  height: 508px;
}
.home-sales img{
  width: 100%;
  height: 100%;
}
.home-sales a{
  display: block;
}
.home-sales .item2,.home-sales .item3{
  float: right;
  width: 372px;
  height: 252px;
}
.home-sales .item2{
  margin-bottom: 6px;
}
.home-product{
  background: #f2f2f2;
  padding-bottom: 16px;
  margin-bottom: 100px;
}
.home-product li{
  width: 324px;
  float: left;
  background: #fff;
  text-align: center;
  padding:24px;
  margin-bottom: 6px;
}
.home-product li:nth-child(2n+1){
  margin-right: 6px;
}
.home-product li .pic{
  width: 324px;
  height: 324px;
}
.home-product li img{
  width: 100%;
  height: 100%;
}
.home-product li h6{
  text-align: left;
  font-size: 24px;
  height: 62px;
  margin-top: 10px;
}
.home-product li .price{
  text-align: left;
  font-size: 24px;
}
.home-product li .price .newPrice{
  color: #ff0000;
  font-style: normal;
  font-size: 24px;
}
.home-product li .price .oldPrice{
  font-size: 24px;
  text-decoration: line-through;
  color: #999;
}
.no-more{
  font-size: 26px;
  margin: 10px 0;
}
</style>
