<!-- 弹窗组件 -->
<template>
  <div class="modal" v-if="modalFlag">
    <div class="wrap">
      <div class="header">
        <i class="fa fa-close" @click="closeModal"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    modalFlag() {
      return this.$store.state.modalFlag
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('controlModal', false)
    }
  }
}
</script>
<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  -webkit-display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal .wrap{
  width: 500px;
  height: 300px;
  background: rgb(245, 245, 245);
  border-radius: 14px;
}
.modal .header {
  height: 50px;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.modal .header i{
  position: absolute;
  right: 10px;
  top: 6px;
  font-size: 28px;
  color: #666;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.modal .content {
  height: 130px;
  line-height: 130px;
  font-size: 30px;
  text-align: center;
}
.modal .button{
  text-align: center;
  height: 100px;
  line-height: 100px;
}
.modal .button button{
  height: 60px;
  width: 200px;
  background: #ff6700;
  border: none;
  font-size: 30px;
  color: #fff;
  border-radius: 10px;
}
.modal .button .cancel{
  background: none;
  border: 1px solid #ff6700;
  color: #ff6700;
  margin-left: 20px;
}
</style>
