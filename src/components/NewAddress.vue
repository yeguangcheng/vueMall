<!-- 新建地址 -->
<template>
  <div>
    <header-top>
      新增地址
    </header-top>
    <ul class="newAddress">
      <li>
        <span class="red">* </span>收件人：<input type="text" class="name" placeholder="真实姓名" v-model="name">
      </li>
      <li>
        <span class="red">* </span>手机号码：<input type="text" class="mobile" placeholder="13位手机号" v-model="mobile">
      </li>
      <li>
        <span class="red">* </span>所在地区：<input type="text" class="city" placeholder="所在省份、城市" v-model="city">
      </li>
      <li>
        <span class="red">* </span>详细地址：<input type="text" class="detailed" placeholder="详细的街道、门牌号" v-model="detailed">
      </li>
      <li>
        设置为默认地址：<input type="checkbox" class="default" v-model="isDefault">
      </li>
    </ul>
    <div class="tips">{{errMsg}}</div>
    <div class="saveAddress" @click="inspect">
      保存并使用地址
    </div>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
export default {
  data () {
    return {
      name: '',
      mobile: '',
      city: '',
      detailed: '',
      isDefault: true,
      errMsg: ''
    }
  },
  components: {
    HeaderTop
  },
  methods: {
    // 新建地址
    newAddress() {
      var _this = this
      axios
        .post('/api/user/newAddress', {
          userName: _this.name,
          streetName: _this.detailed,
          tel: _this.mobile,
          city: _this.city,
          isDefault: _this.isDefault
        })
        .then(function(res) {
          if (res.data.status === '0') {
            _this.$router.push('/order')
          }
        })
    },
    // 验证规则
    inspect() {
      var mobileReg = /^1[3-9]\d{9}$/g.test(this.mobile)
      // 判断验证出现提示信息
      if (this.name === '') {
        this.errMsg = '请输入收件人姓名'
        return false
      } else {
        this.errMsg = ''
      }
      if (!mobileReg) {
        this.errMsg = '请输入正确的手机号码'
        return false
      } else {
        this.errMsg = ''
      }
      if (this.city === '') {
        this.errMsg = '请输入所在地区'
        return false
      } else {
        this.errMsg = ''
      }
      if (this.detailed === '') {
        this.errMsg = '请输入详细地址'
        return false
      } else {
        this.errMsg = ''
      }
      this.newAddress()
    }
  },
  created() {
    this.$store.commit('changeLink', 'addressList')
  }
}
</script>
<style scoped>
.newAddress{
  margin-top: 100px;
  padding:0 30px;
}
.newAddress li{
  height: 100px;
  display: flex;
  -webkit-display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  font-size: 30px;
  position: relative;
}
.newAddress li input{
  height: 40px;
  font-size: 30px;
  width: 420px;
  outline: none;
  border: none;
}
.newAddress li .red{
  color: #ff0000;
}
.newAddress li .default{
  position: absolute;
  right: 10px;
  top:50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
}
.saveAddress{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background: #ff6700;
  color: #fff;
  font-size: 30px;
}
.tips{
  color: #ff6700;
  text-align: center;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  margin: 30px 0;
}
</style>
