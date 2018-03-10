<!-- 个人中心 -->
<template>
  <div class="bg">
    <header-top>
      会员登录
    </header-top>
    <div v-if="!loginStatus">
      <div class="login-title">
        <img src="../assets/images/user.png" alt="">
        <h6>账号登录</h6>
      </div>
      <div class="login">
        <div class="username">
          <input type="text" placeholder="您的账号" v-model="userName">
        </div>
        <div class="password">
          <input type="password" placeholder="您的密码" v-model="userPwd"><router-link to="/findPassword" class="forget">找回密码</router-link>
        </div>
        <div class="errorTip" v-if="errorTip">{{tipsMsg}}</div>
        <div class="submit" @click="login()">登录</div>
        <p class="tips">没有账号请<router-link to="register" class="red">注册</router-link></p>
      </div>
    </div>
    <div class="user" v-if="loginStatus">
      <div class="username">
        <div class="pic"><img src="../assets/images/default.png" alt=""></div>
        <div class="userId">{{loginName}}<br><span>{{userId}}</span></div>
      </div>
      <div class="order">
          <h6>我的订单<span><router-link to="/orderList">全部订单</router-link></span><i class="fa fa-angle-right"></i></h6>
          <ul class="order-list">
            <li>
              <img src="../assets/images/wait.png" alt="">
              <span>待付款</span>
            </li>
            <li>
              <img src="../assets/images/carry.png" alt="">
              <span>待收货</span>
            </li>
            <li>
              <img src="../assets/images/wait.png" alt="">
              <span>已完成</span>
            </li>
          </ul>
      </div>
      <div class="setting">
        <ul>
          <li><img src="../assets/images/icon3.jpg" alt="">我的资料<i class="fa fa-angle-right"></i></li>
          <li><img src="../assets/images/setting.png" alt="">设置<i class="fa fa-angle-right"></i></li>
        </ul>
      </div>
      <div class="loginOut">
        <button @click="confirmLoginOut">退出</button>
      </div>
    </div>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="loginOut">确定</button>
        <button @click="closeModal" class="cancel">取消</button>
      </div>
    </modal>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import HeaderTop from './Header'
import BottomNav from './Nav'
import axios from 'axios'
import Modal from './Modal'

export default {
  data () {
    return {
      userName: '', // 输入的用户名
      userPwd: '', // 输入的密码
      errorTip: false, // 错误提示开关
      tipsMsg: '', // 错误提示信息
      modalText: '' // 弹窗提示信息
    }
  },
  components: {
    HeaderTop,
    BottomNav,
    Modal
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    },
    userId() {
      return this.$store.state.userId
    },
    loginName() {
      return this.$store.state.loginName
    }
  },
  created() {
    // 载入组件时初始化导航信息
    this.$store.commit('increment', 'user')
    this.$store.commit('changeLink', '')
  },
  methods: {
    // 登录功能
    login() {
      // 判断是否输入用户名和密码
      if (!this.userName || !this.userPwd) {
        this.errorTip = true
        this.tipsMsg = '用户名和密码不能为空'
        return
      }
      var _this = this
      // 发送登录请求
      axios
        .post('/api/user/login', {
          userName: _this.userName,
          userPwd: _this.userPwd
        })
        .then(function(res) {
          if (res.data.status === '0') {
            _this.errorTip = false
            _this.$store.commit('changeLoginName', {name: res.data.result.userName, id: res.data.result.userId})
            _this.$store.commit('changeLoginStatus', true)
          } else {
            _this.errorTip = true
            _this.tipsMsg = '用户名或密码错误'
          }
        })
    },
    // 退出登录
    loginOut() {
      var _this = this
      axios.post('/api/user/logout').then(function(res) {
        if (res.data.status === '0') {
          _this.$store.commit('changeLoginName', {name: res.data.result.userName, id: res.data.result.userId})
          _this.$store.commit('changeLoginStatus', false)
          _this.closeModal()
        } else {
          _this.errorTip = true
        }
      })
    },
    // 调用弹窗确认是否退出
    confirmLoginOut() {
      this.$store.commit('controlModal', true)
      this.modalText = '确认退出登录吗？'
    },
    // 检查是否登录
    checkLogin() {
      var _this = this
      axios
        .get('/api/user/checkLogin')
        .then(function(res) {
          if (parseInt(res.data.status) === 0) {
            _this.$store.commit('changeLoginName', {name: res.data.result.userName, id: res.data.result.userId})
            _this.$store.commit('changeLoginStatus', true)
          } else {
            _this.$store.commit('changeLoginStatus', false)
            _this.$router.push('login')
          }
        })
    },
    // 关闭弹窗
    closeModal() {
      this.$store.commit('controlModal', false)
    }
  },
  mounted() {
    this.checkLogin()
  }
}
</script>
<style scoped>
.bg{
  height: 100%;
}
.login-title{
  text-align: center;
  margin:150px 0 50px 0;
}
.login-title img{
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}
.login-title h6{
  font-weight: normal;
  font-size: 26px;
  line-height: 50px;
  height: 50px;
}
.login .username input{
  height: 100px;
  border: none;
  font-size: 28px;
  width: 670px;
  outline: none;
}
.login .username {
  margin:4px 20px;
  padding: 0 20px;
}
.login .password {
  border-bottom: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;
  margin:0 20px;
  padding: 0 20px;
  -webkit-display: flex;
  display: flex;
}
.login .password input{
  height: 100px;
  border:none;
  font-size: 28px;
  width: 468px;
  outline: none;
}
.login .forget{
  display: block;
  border-left: 1px solid #eee;
  height: 100px;
  line-height: 100px;
  width: 200px;
  font-size: 28px;
  text-align: center;
  color: #ff6700;
}
.login .submit{
  height: 80px;
  line-height: 80px;
  width: 670px;
  margin: 30px auto;
  background: #ff6700;
  font-size: 30px;
  text-align: center;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  color: #fff;
}
.login .tips{
  height:80px;
  line-height: 80px;
  border:none;
  width: 670px;
  margin:0 20px;
  text-align: center;
  font-size: 26px;
}
.login .errorTip{
  height:40px;
  line-height: 40px;
  text-align: center;
  color: #ff6700;
  margin-top: 10px;
}
.user{
  margin-top: 80px;
  background: #e5e5e5;
  min-height:100%;
}
.user .username{
  height: 200px;
  background: url('src/assets/images/bg.63c8e19.png') #f37d0f no-repeat;
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  align-items: center;
}
.user .username .pic{
  width: 100px;
  height: 100px;
  border: 8px solid rgba(255,227,205,0.5);
  border-radius: 50%;
  margin-left: 40px;
}
.user .username .pic img{
  width: 100%;
  height: 100%;
}
.user .username .userId{
  margin-left: 20px;
  line-height: 40px;
  font-size: 26px;
}
.user .username .userId span{
  color: #cecece;
}
.user .order{
  margin-bottom: 20px;
}
.user .order h6{
  height: 80px;
  line-height: 80px;
  padding:0px 30px;
  font-size: 28px;
  border-bottom:  1px solid #ccc;
  font-weight: normal;
  position: relative;
  background: #fff;
}
.user .order h6 span{
  position: absolute;
  right: 60px;
  font-size: 28px;
}
.user .order h6 i{
  position: absolute;
  right: 20px;
  top:12px;
  font-size: 50px;
  color: #999;
}
.user .order .order-list{
  -webkit-display: flex;
  display: flex;
  background: #fff;
}
.user .order .order-list li{
  flex: 1;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 200px;
  margin-bottom: 10px;
}
.user .order .order-list li img{
  margin-bottom: 10px;
  width: 50px;
  height: 50px;
}
.user .setting{
  background: #fff;
  padding: 0 30px;
  margin-bottom: 20px;
}
.user .setting ul li{
  height: 100px;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  font-size: 28px;
  border-bottom:1px solid #ccc;
  position: relative;
}
.user .setting ul li img{
  width: 54px;
  margin-right: 30px;
}
.user .setting ul li i{
  position: absolute;
  right: 20px;
  top:20px;
  font-size: 50px;
  color: #999;
}
.user .loginOut{
  padding:0 30px;
  height: 80px;
  line-height: 80px;
}
.user .loginOut button{
  background: #f37d0f;
  color: #fff;
  border: none;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-size: 30px;
}
.red{
  color: #ff0000;
}
</style>
