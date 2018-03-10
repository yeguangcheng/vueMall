<!-- 地址列表 -->
<template>
  <div>
    <header-top>
      收货地址
    </header-top>
    <div class="empty" v-if="empty">
      暂无收货地址~~
    </div>
    <ul class="addressList">
      <li v-for="item in addressList" :key="item.id">
        <i :class="{check:true,cur:item.isDefault}" @click="setDefault(item.addressId)"></i>
        <div class="name">
          <p>{{item.userName}}<span>{{item.tel}}</span></p>
        </div>
        <div class="detailed">
          {{item.city}}{{item.streetName}}
        </div>
        <i class="fa fa-trash-o del" @click="confirmDel(item.addressId)"></i>
      </li>
    </ul>
    <div class="newAddress">
      <router-link to="/order">返回订单</router-link>
      <router-link to="/newAddress">新建地址</router-link>
    </div>
    <modal>
      <div class="content">
        {{modalText}}
      </div>
      <div class="button">
        <button @click="delAddress">确定</button>
        <button @click="closeModal" class="cancel">取消</button>
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
      addressList: [], // 地址列表
      empty: true, // 列表是否为空
      modalText: '', // 弹窗组件内容
      delAddressId: '' // 待删除的地址id
    }
  },
  components: {
    HeaderTop,
    Modal
  },
  methods: {
    // 获取地址列表
    getAddressList() {
      var _this = this
      axios
        .get('/api/user/addressList')
        .then(function(res) {
          if (res.data.status === '0') {
            if (res.data.result.length === 0) {
              _this.empty = true
              _this.addressList = []
              return ''
            }
            _this.addressList = res.data.result
            var isDefault = false
            for (var i = 0; i < _this.addressList.length; i++) {
              if (_this.addressList[i].isDefault) {
                isDefault = true
                _this.empty = false
              }
            }
            if (!isDefault) {
              if (_this.addressList.length > 0) {
                _this.setDefault(_this.addressList[0].addressId)
                _this.empty = false
              } else {
                _this.empty = true
              }
            } else {
              _this.empty = false
            }
          }
        })
    },
    // 设置默认地址
    setDefault(id) {
      this.addressList.forEach((item, index) => {
        if (item.addressId === id) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      axios
        .post('/api/user/setDefault', {
          addressId: id
        })
        .then(function(res) {
          if (res.data.status === '0') {
            return ''
          } else {
            console.log('未知错误，请重试')
          }
        })
    },
    // 调用弹窗确认是否退出
    confirmDel(id) {
      this.delAddressId = id
      this.$store.commit('controlModal', true)
      this.modalText = '确认删除该地址吗？'
    },
    // 关闭弹窗
    closeModal() {
      this.$store.commit('controlModal', false)
    },
    // 删除地址
    delAddress() {
      this.addressList.forEach((item, index) => {
        if (item.addressId === this.delAddressId) {
          this.addressList.splice(index, 1)
        }
      })
      var _this = this
      axios
        .post('/api/user/delAddress', {
          addressId: _this.delAddressId
        })
        .then(function(res) {
          if (res.data.status === '0') {
            _this.closeModal()
            _this.getAddressList()
          } else {
            _this.closeModal()
            console.log('未知错误，请重试')
          }
        })
    }
  },
  created() {
    this.getAddressList()
    this.$store.commit('changeLink', '/order')
  }
}
</script>
<style scoped>
.addressList{
  margin-top: 100px;
  padding:0 50px;
}
.addressList li{
  position: relative;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.addressList li .name{
  font-size: 28px;
  height: 100px;
  line-height: 100px;
  color: #ff6700;
  margin-left: 80px;
}
.addressList li .name span{
  color: #555;
  margin-left: 50px;
}
.addressList li .detailed {
  font-size: 26px;
  padding-right: 150px;
  margin-left: 80px;
}
.addressList li .del{
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 50px;
  height: 60px;
  line-height: 60px;
  width: 60px;
  margin-top: -30px;
  text-align: center;
  color: rgb(110, 109, 109)
}
.addressList li .check{
  position: absolute;
  left: 0px;
  top: 50%;
  margin-top: -22px;
  width: 44px;
  height: 44px;
  border: 1px solid #ccc;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.addressList li .check.cur{
  background: url('src/assets/images/check_press.png') no-repeat center center;
  background-size: 100% 100%;
  border: none;
}
.newAddress{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100px;
  background: #ff6700;
  -webkit-display: flex;
  display: flex;
}
.newAddress a{
  flex: 1;
  display: block;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #fff;
  font-size: 30px;
}
.newAddress a:first-child {
  background: #fff;
  color: #555;
  border-top: 1px solid #ccc;
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
