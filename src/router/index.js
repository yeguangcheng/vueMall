import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Cart from '@/components/Cart'
import Classify from '@/components/Classify'
import Login from '@/components/Login'
import Product from '@/components/Product'
import Order from '@/components/Order'
import AddressList from '@/components/AddressList'
import NewAddress from '@/components/NewAddress'
import Register from '@/components/Register'
import FindPassword from '@/components/FindPassword'
import Success from '@/components/Success'
import OrderList from '@/components/OrderList'
import OrderDetail from '@/components/OrderDetail'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/classify',
      name: 'classify',
      component: Classify
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/product',
      name: 'product',
      component: Product
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: AddressList
    },
    {
      path: '/newAddress',
      name: 'newAddress',
      component: NewAddress
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/findPassword',
      name: 'findPassword',
      component: FindPassword
    },
    {
      path: '/success',
      name: 'success',
      component: Success
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: OrderList
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: OrderDetail
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
