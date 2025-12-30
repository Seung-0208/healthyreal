import axios from '@axios'
import jwtDecode from 'jwt-decode'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import routes from '~pages'

export const isfriendscreenchanged = ref(false)
export const isSubscribesscreenchanged = ref(false)
export const isMatescreenchanged = ref(false)


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/login.vue'),
      redirect: () => ({ name: 'login', params: { tab: 'profile' } }),
      meta: { requiresAuth: false }, // 이 라우트는 로그인이 필요함을 나타냅니다.
    },
    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
      meta: { requiresAuth: true },
    },
    {
      path: '/voicechatbot',
      name: 'voicechatbot',
      component: () => import(/* webpackChunkName: "tts" */ '../pages/voicechatbot.vue'),
    },
    {
      path: '/stt',
      name: 'stt',
      component: () => import(/* webpackChunkName: "tts" */ '../pages/stt'),
    },
    {
      path: '/stabilityVideoDifusiononlyfront',
      name: 'stabilityVideoDifusiononlyfront',
      component: () => import(/* webpackChunkName: "tts" */ '../pages/stabilityVideoDifusiononlyfront.vue'),
    },
    {
      path: '/AuthCallback',
      name: 'AuthCallBack',
      component: () => import(/* webpackChunkName: "tts" */ '../pages/AuthCallback.vue'),
    },
    {
      path: '/main',
      name: 'main',
      component: () => import(/* webpackChunkName: "tts" */ '@/pages/main.vue'),
      // beforeEnter: async (to, from, next) => {
      //   console.log("실행되니?? 메인 비포엔터")
      //   await store.dispatch('getToken')  // 'loginStore' 모듈의 'getToken' 액션 호출
      //   await store.dispatch('saveToken')  // 'loginStore' 모듈의 'saveToken' 액션 호출
      //   await store.dispatch('getMemberInfo')  // 'loginStore' 모듈의 'getMemberInfo' 액션 호출
     
      //   next()
      // },
    },

    {
      path: '/access-control',
      name: 'access-Control',
      component: () => import(/* webpackChunkName: "tts" */ '../pages/access-control.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('access_token')

        console.log("라우터 접근제한")
        if (!token) {
          alert('사용자 정보가 없습니다')
          console.log("사용자 정보가 없습니다")
          next('/login')
          
          return
        }
    
        try {
          const decodedToken = jwtDecode(token)
    
          if (decodedToken.authority !== 'ROLE_ADMIN') {
            alert('권한없음')
            console.log("권한없음")
            next('/login') 
            
          } else {
            console.log("확인")
            next() // or wherever you want to redirect
          }
        } catch (error) {
          alert('권한없음')
          console.error('Invalid token', error)
          next('/login')
        }
      },
    },
    
    {
      path: '/apps/challengeList',
      name: 'challengeList',
      components: {
        default: () => import('@/pages/apps/challengeList.vue'),
        layout: () => import('@/layouts/components/DefaultLayoutWithVerticalNav.vue'),
      },
      beforeEnter: async (to, from, next) => {
        try {
          const store = useStore()
    
          // 로그인 상태 확인
          if (!store.state.loginStore.isLogin) {
            next({ name: 'login' })
            
            return
          }
    
          console.log("beforeEnter 가드 실행")
    
          const userInfo = computed(() => store.state.userStore.userInfo)
          const connetId = userInfo.value.id
          const response = await axios.post('/croom/myRoomNum.do', { id: connetId }) // POST 요청
          const data = response.data
    
          console.log("너의 방번호는?", data)
    
          if (data) { // 값이 있다면
            next({ 
              name: 'apps-user-challenge-id', 
              params: { id: data }, 
            })
          } else { // 값이 없다면
            next({ name: 'apps-challengeList' })
          }
        } catch (error) {
          console.error(error)
          next({ name: 'apps-challengeList' }) // 예외가 발생하면 라우트 이동을 계속 진행
        }
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/apps/mateList',
      name: 'mateList',
      components: {
        default: () => import('@/pages/apps/mateList.vue'),
        layout: () => import('@/layouts/components/DefaultLayoutWithVerticalNav.vue'),
      },
      beforeEnter: async (to, from, next) => {
        try {
          const store = useStore()
    
          // 로그인 상태 확인
          if (!store.state.loginStore.isLogin) {
            next({ name: 'login' })
            
            return
          }
    
          console.log("메이트 실행")
   
    
          const userInfo = computed(() => store.state.userStore.userInfo)
          const connetId = userInfo.value.id

          console.log("connetId------", connetId)

          const response = await axios.post('/mroom/myRoomNum.do', { id: connetId }) // POST 요청
          const data = response.data
    
          console.log("너의 방번호는?", data)
    
          if (data) { // 값이 있다면
            next({ 
              name: 'apps-user-mate-room', 
              params: { room: data }, 
            })
          } else { // 값이 없다면
            next({ name: 'apps-mateList' })
          }
        } catch (error) {
          console.error(error)
          next({ name: 'apps-mateList' })// 예외가 발생하면 라우트 이동을 계속 진행
        }
      },
      meta: { requiresAuth: true },
    },

    ...setupLayouts(routes),
  ],
})



// 이동 감지와 변경된 화면 체크
router.beforeEach((to, from, next) => {
  console.log(`화면 이동 감지: ${from.fullPath}에서 ${to.fullPath}로 이동`)

  if (from.fullPath=='/community/user/friend') {
    isfriendscreenchanged.value = true
    console.log('화면 변경됨')
  }
  if (from.fullPath=='/community/user/subscriber'){
    isSubscribesscreenchanged.value = true
  }
  if (from.fullPath=='/community/user/mate'){
    isMatescreenchanged.value = true
  }

  
  let counter = ''

  if (to.fullPath.includes('/community/user/friend') ||
    to.fullPath.includes('/community_post') ||
    to.fullPath.includes('/apps/chat') ||
    to.fullPath.includes('/apps/user/mate/') ||
    to.fullPath.includes('/apps/user/challenge')) {
    counter = 'community'
  } else if (to.fullPath.includes('/exercise/map') ||
           to.fullPath.includes('/exercise/pose') ||
           to.fullPath.includes('/exerciserecommendation')) {
    counter = 'exercise'
  } else if (to.fullPath.includes('/diet') ||
           to.fullPath.includes('/dietfood')) {
    counter = 'diet'
  } else if (to.fullPath.includes('/diary')) {
    counter = 'diary'
  }
  const response = axios.post('/tab/count.do', { counter: counter })


  next()
})

// const publicPages = ['/login', '/main']  // 로그인이 필요하지 않은 페이지의 경로를 배열로 정의

// router.beforeEach((to, from, next) => {
//   // 로그인 상태를 확인하는 코드. 실제 환경에서는 적절한 로그인 확인 로직으로 대체하세요.
//   const isLoggedIn = !!localStorage.getItem('accessToken')

//   // 로그인이 필요하지 않은 페이지에 대한 접근은 항상 허용
//   if (publicPages.includes(to.path)) {
//     next()
//   } else {
//     // 그 외의 페이지에 대한 접근은 로그인 상태에 따라 결정
//     if (isLoggedIn) {
//       next()  // 로그인이 되어있으면 접근 허용
//     } else {
//       alert("로그인 후 이용가능합니다.")
//       next('/main')  // 로그인이 되어있지 않으면 메인 페이지로 리다이렉트
//     }
//   }
// })


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// router.beforeEach(to => {
//   const isLoggedIn = isUserLoggedIn()
//   if (canNavigate(to)) {
//     if (to.meta.redirectIfLoggedIn && isLoggedIn)
//       return '/'
//   }
//   else {
//     if (isLoggedIn)
//       return { name: 'not-authorized' }
//     else
//       return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
//   }
// })
///community/user/friend


export default router
