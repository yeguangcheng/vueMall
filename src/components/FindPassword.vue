<!-- 密码找回 -->
<template>
  <div class="findPassword">
    <header-top>
      密码找回
    </header-top>
    <ul class="newAddress">
      <li v-if="checkFlag=='1'">
        用户名：<input type="text" class="name" placeholder="您的用户名" v-model="userName">
      </li>
      <li v-if="checkFlag=='2'">
        密码提示问题：{{pwdQuestion}}<input type="email" class="email" placeholder="您的答案" v-model="pwdAnswer">
      </li>
      <li v-if="checkFlag=='3'">
        新密码：<input type="password" class="password" placeholder="6~16个字符，区分大小写" v-model="newPwd">
      </li>
    </ul>
    <div class="errTips">{{errTips}}</div>
    <div class="submit" @click="inspect">下一步</div>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="routerLogin">{{modalButton}}({{modalTime}})</button>
      </div>
    </modal>
  </div>
</template>

<script>
import HeaderTop from './Header'
import axios from 'axios'
import Modal from './Modal'

export default {
  data () {
    return {
      userName: '', // 输入的用户名
      pwdQuestion: '', // 获取到的密码提示问题
      pwdAnswer: '', // 输入的密码提示答案
      checkFlag: '1', // 当前修改步骤
      newPwd: '', // 输入的新密码
      modalText: '', // 弹窗内容
      modalButton: '', // 弹窗按钮内容
      modalTime: 3, // 弹窗计时
      errTips: '' // 输入错误提示信息
    }
  },
  components: {
    HeaderTop,
    Modal
  },
  methods: {
    inspect() {
      // 验证有无输入用户名
      if (this.checkFlag === '1') {
        this.checkQuestion()
      } else if (this.checkFlag === '2') {
        // 如果输入了用户名则获取密码提示
        this.checkAnswer()
      } else if (this.checkFlag === '3') {
        // 如果输入了用户名则获取密码提示
        this.resetPwd()
      }
    },
    // 获取密码提示问题
    checkQuestion() {
      if (!this.userName) {
        this.errTips = '请输入用户名'
        return false
      }
      this.errTips = ''
      var _this = this
      axios.post('/api/user/checkPwdQuestion', {
        userName: _this.userName
      }).then(function(res) {
        if (res.data.status === '0') {
          _this.pwdQuestion = res.data.result.pwdQuestion
          _this.checkFlag = '2'
        } else {
          _this.checkFlag = '1'
          _this.errTips = '该用户不存在'
        }
      })
    },
    // 验证密码提示答案
    checkAnswer() {
      this.errTips = ''
      var _this = this
      axios.post('/api/user/inspectPwdAnswer', {
        userName: _this.userName,
        pwdAnswer: _this.pwdAnswer
      }).then(function(res) {
        if (res.data.status === '0') {
          _this.checkFlag = '3'
        } else {
          _this.errTips = '答案错误'
          _this.checkFlag = '2'
        }
      })
    },
    // 修改密码
    resetPwd() {
      var passwordReg = /^\w{6,16}$/g.test(this.newPwd)
      if (!passwordReg) {
        this.errTips = '请输入正确的密码'
        return false
      }
      var _this = this
      axios.post('/api/user/newPwd', {
        userName: _this.userName,
        userPwd: _this.newPwd
      }).then(function(res) {
        if (res.data.status === '0') {
          _this.$store.commit('controlModal', true)
          _this.modalText = '修改密码成功!'
          _this.modalButton = '返回登录页'
          // 倒计时三秒返回登录页
          var time = setInterval(function() {
            _this.modalTime--
            if (_this.modalTime <= 0) {
              clearInterval(time)
              _this.$store.commit('controlModal', false)
              _this.routerLogin()
            }
          }, 1000)
        } else {
          _this.checkFlag = '3'
        }
      })
    },
    // 返回登录页面
    routerLogin() {
      this.$store.commit('controlModal', false)
      this.$router.push('login')
    }
  },
  created() {
    this.$store.commit('changeLink', 'login')
  }
}
</script>
<style scoped>
.findPassword{
  margin-top: 100px;
  padding:0 30px;
}
.findPassword ul li{
  height: 120px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
}
.findPassword ul li input{
  width: 100%;
  height: 40px;
  font-size: 28px;
  border: none;
  outline: none;
  margin-top: 10px;
}
.findPassword .submit{
  height: 80px;
  line-height: 80px;
  background: #ff6700;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  text-align: center;
  margin-top: 30px;
  color: #fff;
  font-size: 32px;
}
.findPassword .errTips{
  color: #ff6700;
  text-align: center;
  line-height: 30px;
  font-size: 28px;
  margin-top: 20px;
}
</style>
