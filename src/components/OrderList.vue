<!-- 订单列表 -->
<template>
  <div>
    <header-top>
      全部订单
    </header-top>
    <ul class="orderList" v-if="!empty">
      <li v-for="item in orderList" :key="item.key">
        <router-link :to="'/orderDetail?id='+ item.orderId">
          <div class="number">
            订单编号：{{item.orderId}}
          </div>
          <ul class="goodsList">
            <li v-for="product in item.goodsList" :key="product.id">
                <img :src="product.productImg[0]" alt="">
                <h6>{{product.productName}}<br>x {{product.productNum}}</h6>
            </li>
          </ul>
          <div class="total">
            总金额:{{item.orderTotal}}元
          </div>
          <div :class="{status:item.orderStatus===1,success:true}">
            已付款
          </div>
        </router-link>
      </li>
    </ul>
    <div class="empty" v-if="empty">
      暂无订单~~
    </div>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
export default {
  data () {
    return {
      orderList: [],
      empty: true
    }
  },
  components: {
    HeaderTop
  },
  methods: {
    getOrderList() {
      var _this = this
      axios
        .get('/api/user/orderDetail')
        .then(function(res) {
          if (res.data.status === '0') {
            _this.orderList = res.data.result
            if (_this.orderList.length === 0) {
              _this.empty = true
            } else {
              _this.empty = false
            }
          }
        })
    }
  },
  created() {
    this.getOrderList()
    this.$store.commit('changeLink', 'login')
  }
}
</script>
<style scoped>
.orderList{
  margin-top: 100px;
  padding: 0 30px;
}
.orderList .number {
  font-size: 28px;
  color:#555;
  height: 50px;
  line-height: 50px;
  border-bottom:1px solid #ccc;
  margin-top: 20px;
}
.orderList > li{
  position: relative;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.orderList .goodsList li{
  padding:20px 0;
  -webkit-display: flex;
  display: flex;
  align-items: center;
}
.orderList .goodsList li img{
  width: 100px;
  height: 100px;
}
.orderList .goodsList li h6{
  font-size: 28px;
  margin-left: 40px;
  font-weight: normal;
  line-height: 40px;
}
.orderList .total{
  text-align: right;
  font-size: 28px;
  color: #555;
}
.orderList .success{
  position: absolute;
  right: 20px;
  top: 10px;
  color: #ff6700;
  font-size: 26px;
  font-weight: bold;
}
.empty{
  margin-top: 100px;
  color: #ff6700;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 32px;
}
</style>
