<!-- 订单详情 -->
<template>
  <div class="orderDetail">
    <header-top>
      订单详情
    </header-top>
    <div class="content">
      <div class="number">
        订单编号：{{orderDetail.orderId}}
      </div>
      <div :class="{status:orderDetail.orderStatus==1}">
        订单状态：已付款
      </div>
      <ul class="goodsList">
        <li v-for="item in orderDetail.goodsList" :key="item.id">
          <router-link to="/product?id=">
            <img :src="item.productImg[0]" alt="">
            <h6>
              {{item.productName}}<br>
              x {{item.productNum}}
            </h6>
          </router-link>
        </li>
      </ul>
      <ul class="detailList">
        <li>
          <div class="title">
            下单日期：
          </div>
          <div class="container">
            {{orderDetail.createDate}}
          </div>
        </li>
        <li>
          <div class="title">
            收货地址：
          </div>
          <div class="container">
            {{orderDetail.addressInfo.city}}{{orderDetail.addressInfo.streetName}}
          </div>
        </li>
        <li>
          <div class="title">
            收件人：
          </div>
          <div class="container">
            {{orderDetail.addressInfo.userName}} {{orderDetail.addressInfo.tel}}
          </div>
        </li>
        <li>
          <div class="title">
            总金额：
          </div>
          <div class="container">
            {{orderTotal}} 元
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
export default {
  data () {
    return {
      orderDetail: {
        orderId: 0,
        orderStatus: 0,
        addressInfo: {
          city: '',
          streetName: '',
          tel: 0
        }
      },
      orderTotal: 0
    }
  },
  components: {
    HeaderTop
  },
  methods: {
    getDetail() {
      var orderId = this.$route.query.id
      var _this = this
      axios
        .get('/api/user/orderDetail?orderId=' + orderId)
        .then(function(res) {
          if (res.data.status === '0') {
            _this.orderDetail = res.data.result.orderDetail
            _this.orderTotal = res.data.result.orderTotal
          }
        })
    }
  },
  created() {
    this.getDetail()
    this.$store.commit('changeLink', 'orderList')
  }
}
</script>
<style scoped>
.orderDetail{
  margin-top: 100px;
  padding:0 30px;
}
.orderDetail .content .number{
  font-size: 26px;
  color: #555;
  line-height: 50px;
}
.orderDetail .content .status{
  font-size: 26px;
  color: #555;
  line-height: 50px;
}
.orderDetail .content .goodsList{
  border-bottom: 1px solid #ccc;
}
.orderDetail .content .goodsList li a{
  -webkit-display: flex;
  display: flex;
  font-size: 26px;
  align-items: center;
  padding:30px 0;
}
.orderDetail .content .goodsList li img{
  width: 100px;
  height: 100px;
}
.orderDetail .content .goodsList li h6{
  font-weight: normal;
  font-size: 26px;
  line-height: 40px;
  margin-left: 30px;
}
.orderDetail .content .detailList {
  padding: 30px 0;
}
.orderDetail .content .detailList li{
  -webkit-display: flex;
  display: flex;
  font-size: 26px;
  line-height: 60px;
}
.orderDetail .content .detailList li .title{
  width: 150px;
}
.orderDetail .content .detailList li .container{
  width: 620px;
}
</style>
