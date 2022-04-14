import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import List from '../components/goods/List.vue'
import Order from '../components/order/Order.vue'
import Cashier from '../components/user/Cashier.vue'
import Supplier from '../components/user/Supplier.vue'
import Administrators from '../components/user/Administrators.vue'
import Membershipcard from '../components/card/Membershipcard.vue'
import Chainstore from '../components/hotel/Chainstore.vue'
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/cashier', component: Cashier },
            { path: '/chainstore', component: Chainstore },
            { path: '/administrators', component: Administrators },
            { path: '/supplier', component: Supplier },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/goods', component: List },
            { path: '/orders', component: Order },
            { path: '/membershipcard', component: Membershipcard }
        ]
    }
]

const router = new VueRouter({
        routes
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to要访问的路径

    //from代表从哪个路径来

    //next是函数 放行

    if (to.path === '/login') return next();
    //token
    const tokenstr = window.sessionStorage.getItem('token')
    if (!tokenstr) return next('/login')
    next()
})
export default router