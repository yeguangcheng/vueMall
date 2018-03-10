<!-- 头部组件 -->
<template>
  <div class="header">
    <div class="goback" @click="goback">
      <i class="fa fa-angle-left"></i>
    </div>
    <h2>
      <slot></slot>
    </h2>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    link() {
      return this.$store.state.link
    }
  },
  methods: {
    goback() {
      if (this.link) {
        this.$router.push(this.link)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style scoped>
.header{
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 0;
  left:0;
  right: 0;
  background: #fff;
  z-index: 1;
}
.header h2{
  font-weight:normal;
  text-align: center;
}
.header .goback{
  position:absolute;
  left: 10px;
  font-size: 60px;
  width: 60px;
  text-align: center;
}
.header .goback i{
  color: #ccc;
}
</style>
