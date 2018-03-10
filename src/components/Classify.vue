<!-- 商品分类 -->
<template>
  <div>
    <header-top>
      商品分类
    </header-top>
    <ul class="classify-nav clearfix">
      <li :class="{'cur':navCur=='mobile'}" @click="getClassify('mobile')">
        智能手机
      </li>
      <li :class="{'cur':navCur=='camera'}" @click="getClassify('camera')">
        摄影摄像
      </li>
      <li :class="{'cur':navCur=='parts'}" @click="getClassify('parts')">
        手机配件
      </li>
      <li :class="{'cur':navCur=='digital'}" @click="getClassify('digital')">
        数码配件
      </li>
      <li :class="{'cur':navCur=='computer'}" @click="getClassify('computer')">
        电脑电视
      </li>
    </ul>
    <div class="classify-product">
      <ul class="mobile clearfix">
        <li v-for="item in productList" :key="item.id">
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
      </ul>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import HeaderTop from './Header'
import BottomNav from './Nav'
import axios from 'axios'
export default {
  data () {
    return {
      productList: []
    }
  },
  computed: {
    navCur() {
      return this.$store.state.classifyCur
    }
  },
  components: {
    HeaderTop,
    BottomNav
  },
  created() {
    // 载入组件时初始化导航信息
    this.$store.commit('increment', 'classify')
    // 获取手机分类信息
    this.getClassify(this.navCur)
    this.$store.commit('changeLink', '')
  },
  methods: {
    getClassify(value) {
      var _this = this
      var classify = value || 'mobile'
      this.$store.commit('changeClassifyCur', classify)
      axios
        .get('/api/goodslist?classify=' + classify)
        .then(function(res) {
          if (res.data.status === '0') {
            _this.productList = res.data.result.list
          } else {
          }
        })
    }
  }
}
</script>
<style scoped>
.classify-nav{
  display: flex;
}
.classify-nav li{
  flex: 1;
  text-align: center;
  height: 80px;
  line-height: 80px;
  padding: 0 10px;
  color: rgb(102, 102, 102);
  font-size: 28px;
  border-bottom: 4px solid #fff;
  margin-top: 100px;
}
.classify-nav li.cur{
  color: #ff6700;
  border-bottom: 4px solid #ff6700;
}
.classify-product{
  background: #f2f2f2;
  padding: 16px 0;
  margin-bottom: 100px;
}
.classify-product li{
  width: 324px;
  float: left;
  background: #fff;
  text-align: center;
  padding:24px;
  margin-bottom: 6px;
}
.classify-product li a{
  display: block;
}
.classify-product li:nth-child(2n+1){
  margin-right: 6px;
}
.classify-product li .pic{
  width: 324px;
  height: 324px;
}
.classify-product li img{
  width: 100%;
  height: 100%;
}
.classify-product li h6{
  text-align: left;
  font-size: 24px;
  height: 60px;
  margin-top: 10px;
}
.classify-product li .price{
  text-align: left;
  font-size: 24px;
}
.classify-product li .price .newPrice{
  color: #ff0000;
  font-style: normal;
  font-size: 24px;
}
.classify-product li .price .oldPrice{
  font-size: 24px;
  text-decoration: line-through;
  color: #999;
}
</style>
