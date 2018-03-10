<!-- 支付成功页面 -->
<template>
  <div class="payMent">
    <header-top>
      支付页面
    </header-top>
    <div class="content">
      <div class="pic">
        <img src="../assets/images/success.jpg" alt="">
      </div>
      <div class="tips">
        <h5>支付成功</h5>
        <div>点击确定或 {{time}} 秒后自动返回首页</div>
      </div>
      <div class="ok">
        <router-link to="/home">
          确定
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTop from './Header'
export default {
  data () {
    return {
      time: 3
    }
  },
  components: {
    HeaderTop
  },
  created() {
    this.$store.commit('changeLink', 'home')
    var inte = setInterval(() => {
      this.time--
      if (this.time <= 0) {
        clearInterval(inte)
        this.$router.push('/home')
      }
    }, 1000)
  }
}
</script>
<style scoped>
.payMent .content{
  margin-top: 150px;
  text-align: center;
}
.payMent .content .pic{
  width: 200px;
  height: 200px;
  margin:0 auto;
}
.payMent .content .pic img{
  width: 100%;
  height: 100%;
}
.payMent .content .tips {
  font-size: 28px;
  line-height: 50px;
}
.payMent .content .tips h5{
  font-size: 34px;
  line-height: 80px;
}
.payMent .content .ok{
  height: 80px;
  line-height: 80px;
  text-align: center;
  margin:0 30px;
  border-radius: 10px;
  background: #32cd27;
  margin-top: 50px;
}
.payMent .content .ok a{
  display: block;
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 30px;
}
</style>
