<!-- 底部导航 -->
<template>
  <div class="fixed">
    <ul class="nav-list">
        <li :class="{'current':curNav=='home'}" @click="changeNav('home')">
          <router-link to="home"><i class="fa fa-home"></i>首页</router-link>
        </li>
        <li :class="{'current':curNav=='cart'}" @click="changeNav('cart')">
          <router-link to="cart"><i class="fa fa-shopping-cart"></i>购物车</router-link>
        </li>
        <li :class="{'current':curNav=='classify'}" @click="changeNav('classify')">
          <router-link to="classify"><i class="fa fa-list-ul"></i>分类</router-link>
        </li>
        <li :class="{'current':curNav=='user'}" @click="changeNav('user')">
          <router-link to="login"><i class="fa fa-user"></i>个人中心</router-link>
        </li>
    </ul>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  computed: {
    curNav() {
      return this.$store.state.currentNav
    }
  },
  methods: {
    changeNav(str) {
      this.$store.commit('increment', str)
    }
  }
}
</script>
<style scoped>
.fixed{
  position:fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100px;
  border-top: 1px solid #e1e1e1;
  background: #fff;
}
.nav-list{
  position: absolute;
  left: 0;
  bottom: 0;
  right:0;
  top: 0;
  height: 100px;
  display: -webkit-flex;
  display: flex;
}
.nav-list li{
  flex:1;
  height: 100px;
}
.nav-list li a{
  display: block;
  color: #999;
  height: 100%;
  display: flex;
  justify-content:center;
  align-items:Center;
  flex-direction:column;
  font-size: 22px;
}
.nav-list li i{
  display: block;
  font-size: 46px;
}
.nav-list li.current a{
  color: #ff6700;
}
</style>
