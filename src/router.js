import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        {
          name: 'Loads',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        {
          name: 'Drivers',
          path: 'tables/drivers',
          component: () => import('@/views/dashboard/tables/Drivers'),
        },
        {
          name: 'Users',
          path: 'tables/users',
          component: () => import('@/views/dashboard/tables/Users'),
        },
        {
          name: 'Finance',
          path: '/finance',
          component: () => import('@/views/dashboard/Finance'),
        },
        {
          name: 'LogIn',
          path: '/log-in',
          component: () => import('@/views/dashboard/LogIn'),
        },
        {
          name: 'SignIn',
          path: 'sign-in',
          component: () => import('@/views/dashboard/SignIn'),
        },
      ],
    },
  ],
})
