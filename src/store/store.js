import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    // 当前头部导航位置
    currentNav: 'home',
    // 登录状态
    loginStatus: false,
    // 用户名
    loginName: '',
    // 用户id
    userId: '',
    // 弹窗组件开关
    modalFlag: false,
    // 当前产品分类
    classifyCur: 'mobile',
    // 当前返回跳转路由
    link: ''
  },
  mutations: {
    // 更改导航状态
    increment (state, str) {
      state.currentNav = str
    },
    // 更改登录状态
    changeLoginStatus(state, value) {
      state.loginStatus = value
    },
    // 更改用户名和ID
    changeLoginName(state, obj) {
      state.loginName = obj.name
      state.userId = obj.id
    },
    // 控制弹窗组件
    controlModal(state, value) {
      state.modalFlag = value
    },
    // 更改当前分类
    changeClassifyCur(state, value) {
      state.classifyCur = value
    },
    // 更改返回路由
    changeLink(state, value) {
      state.link = value
    }
  }
})
