<!-- 注册页面 -->
<template>
  <div class="register">
    <header-top>
      会员注册
    </header-top>
    <ul>
      <li>
        <div>用户名<span class="red">*</span></div>
        <input type="text" placeholder="6~18个字符，可使用大小写字母、数字" class="username" v-model="username">
      </li>
      <li>
        <div>密码<span class="red">*</span></div>
        <input type="password" placeholder="6~16个字符，区分大小写" class="password" v-model="password">
      </li>
      <li>
        <div>手机号<span class="red">*</span></div>
        <input type="text" placeholder="填写13位手机号" v-model="mobile">
      </li>
      <li>
        <div>密码提示问题<span class="red">*</span></div>
        <input type="text" placeholder="例：手机号码是？" v-model="pwdQuestion">
      </li>
      <li>
        <div>密码提示答案<span class="red">*</span></div>
        <input type="text" placeholder="用于找回密码" v-model="pwdAnswer">
      </li>
    </ul>
    <div class="tips" v-if="tips">{{tips}}</div>
    <div class="submit" @click="inspect">注册</div>
    <div class="login"><router-link to="/login">已有账号，请登录</router-link></div>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="routerLogin" v-if="registerFlag">返回登录({{modalTime}})</button>
        <button @click="closeModal" v-if="!registerFlag">确定</button>
      </div>
    </modal>
  </div>
</template>

<script>
import HeaderTop from './Header'
import Modal from './Modal'
import axios from 'axios'
export default {
  data () {
    return {
      username: '', // 输入的用户名
      password: '', // 输入的密码
      mobile: '', // 输入的手机号
      pwdQuestion: '', // 输入的密码提示问题
      pwdAnswer: '', // 输入的密码提示答案
      tips: '', // 输入提示信息
      modalText: '', // 弹窗组件信息
      modalTime: 3, // 弹窗倒计时
      registerFlag: false // 是否注册成功
    }
  },
  components: {
    HeaderTop,
    Modal
  },
  methods: {
    inspect() {
      // 验证规则
      var usernameReg = /^\w{6,18}$/g.test(this.username)
      var passwordReg = /^\w{6,16}$/g.test(this.password)
      var mobileReg = /^1[3-9]\d{9}$/g.test(this.mobile)
      // 判断验证出现提示信息
      if (!usernameReg) {
        this.tips = '请输入正确的用户名'
        return false
      } else {
        this.tips = ''
      }
      if (!passwordReg) {
        this.tips = '请输入正确的密码'
        return false
      } else {
        this.tips = ''
      }
      if (!mobileReg) {
        this.tips = '请输入正确的手机号码'
        return false
      } else {
        this.tips = ''
      }
      if (usernameReg && passwordReg && mobileReg) {
        this.register()
      }
    },
    // 注册账号
    register() {
      var _this = this
      axios
        .post('/api/user/addUsers', {
          // 获取输入的注册信息
          userName: _this.username,
          userPwd: _this.password,
          mobile: _this.mobile,
          pwdQuestion: _this.pwdQuestion,
          pwdAnswer: _this.pwdAnswer
        })
        .then(function(res) {
          if (res.data.status === '0') {
            // 注册成功后调用弹窗
            _this.$store.commit('controlModal', true)
            _this.modalText = '注册成功!'
            _this.registerFlag = true
            var time = setInterval(function() {
              // 倒计时3秒后跳转到登录页面
              _this.modalTime--
              if (_this.modalTime <= 0) {
                clearInterval(time)
                _this.$store.commit('controlModal', false)
                _this.routerLogin()
              }
            }, 1000)
          } else {
            _this.$store.commit('controlModal', true)
            _this.modalText = res.data.msg
            _this.registerFlag = false
          }
        })
    },
    // 返回登录页面
    routerLogin() {
      this.$router.push('login')
      this.$store.commit('controlModal', false)
    },
    // 关闭弹窗组件
    closeModal() {
      this.$store.commit('controlModal', false)
      this.$store.commit('changeLink', '')
    }
  }
}
</script>
<style scoped>
.register{
  margin-top: 100px;
  padding:0 30px;
}
.register ul li{
  height: 120px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
}
.register ul li input{
  width: 100%;
  height: 40px;
  font-size: 28px;
  border: none;
  outline: none;
  margin-top: 10px;
}
.register ul li .red{
  color: #ff0000;
  margin:0 5px;
}
.register .tips{
  color: #ff6700;
  text-align: center;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  margin: 30px 0;
}
.register .submit{
  height: 80px;
  line-height: 80px;
  background: #ff6700;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-size: 32px;
}
.register .login{
  height: 80px;
  line-height: 80px;
  font-size: 26px;
  text-align: right;
}
.register .login a{
  color: #666;
}
</style>
