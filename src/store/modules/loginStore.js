
// store/modules/loginStore.js
import axiosflask from '@/plugins/axiosflask'
import router from '@/router'
import axios from '@axios'

/*알림 test용 start*/
import { API_BASE_URL, config, firebaseConfig, getGoogleKey } from '@/config'
import firebase from 'firebase/app'
import 'firebase/messaging'
import jwtDecode from 'jwt-decode'




//웹, 앱 알람 (서비스 워커 안에 파이어베이스 SDK 삽입)
// console.log('fmc 지원?', window.navigator.serviceWorker);
const isSupported = firebase.messaging.isSupported(); //boolean 값


let firebaseApp = firebase.initializeApp(firebaseConfig)
let messaging = isSupported ? firebase.messaging() : null;
if ('serviceWorker' in navigator && isSupported) {
  // console.log('firebase 지원?', isSupported());
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      window.addEventListener('load', () => {
        return navigator.serviceWorker.register('sw.js') //포그라운드에서 실행될 파일
          .then(registration => {

            console.log('등록 완료', registration)
            messaging = firebase.messaging()
            messaging = firebase.messaging(firebaseApp)
            console.log('firebase실행')

            return messaging.getToken(messaging, { vapidKey: config.vapidKey })
          })
          .then(token => { console.log(token) })
          .catch(err => console.error(err))
      })
    }
    else { console.log('알림이 차단됨') }
  })
}

const foodRecommend = async id => {
  await axios.get("/dietfood/search.do", { params: { id: id } })
    .then(response => {
      console.log('응답받은 행:', response.data)
      if (response.data === 0) {
        axiosflask.get("/recommend/recommendFood", { params: { id: id } })
      }
    })
}


/*알림 test용 end*/


const loginStore = {
  state: {
    userInfo: null,
    isLogin: false,
    rememberMe: false,
  },
  getters: {
    isLoggedIn: state => state.isLogin,
  },
  mutations: { // 로그인 상태를 변경해주는 코드
    loginSuccess(state, payload) {
      state.userInfo = payload
      state.isLogin = true
      if (state.rememberMe) {
        // rememberMe가 체크되어 있을 때만 id를 로컬 스토리지에 저장
        localStorage.setItem('rememberedId', payload.id)
      }
    },
    logoutTest: function (state) {
      state.userInfo = null
      state.isLogin = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('vuex')


      window.location.href = `${API_BASE_URL}/logout`
    },
    startLogin(state) {
      state.isLoggingIn = true
    },
    endLogin(state) {
      state.isLoggingIn = false
    },
    setRememberMe(state, rememberMe) {
      state.rememberMe = rememberMe
    },
    toggleRememberMe(state, { rememberMe, id }) {
      state.rememberMe = rememberMe
      if (rememberMe) {
        localStorage.setItem('rememberedId', id)
      } else {
        localStorage.removeItem('rememberedId')
      }
    },

  },
  actions: {
    async login(context, loginObj) {
      const formdata = new FormData()

      formdata.append("id", loginObj['id'])
      formdata.append("pwd", loginObj['pwd'])
      console.log('formdata:', formdata)
      await axios.post('/login', formdata, {
        headers: {
          'X-SKIP-INTERCEPTOR': true,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
        .then(res => {
          console.log('여기까지는 들어옴?', res)
          console.log(formdata.get("id"))
          foodRecommend(formdata.get("id"))

          //FMC 토큰 등록용 코드 start (로그인 한 사용자의 브라우저가 받은 FMC 토큰 값 저장)
          if (messaging !== null) {
            messaging.getToken(messaging, { vapidKey: config.vapidKey })
              .then(token => {
                console.log('사용자의 firebase토큰:', token)
                axios.post("/fmctoken", JSON.stringify({
                  id: formdata.get("id"),
                  token: token,
                }), { headers: { 'Content-Type': 'application/json' } })
              })
              .catch(err => console.log("[firebase]이미 등록된 사용자입니다"))
          }

          getGoogleKey()


          //FMC 토큰 등록용 코드 end
          if (res.status === 200) { // 로그인 요청이 성공했을 때만 토큰을 가져오는 요청을 실행


            return context.dispatch('getToken')
          } else {

            throw new Error('Login failed')
          }
        })
        .then(getTokenResponse => {
          const token = getTokenResponse.data

          if (context.state.rememberMe) { // 체크박스가 체크되어 있을 때만 아이디를 저장
            localStorage.setItem('rememberedId', loginObj['id'])
          } else { // 체크박스가 체크되어 있지 않을 때는 아이디를 삭제
            localStorage.removeItem('rememberedId')
          }

          console.log(token)
          context.dispatch('saveToken', token)

          router.push('/main')

        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status === 401) {
            throw new Error('아이디 또는 비밀번호를 확인해주세요')
          } else {
            throw new Error('알 수 없는 에러가 발생했습니다. 다시 시도해주세요.')
          }


        })
    },

    async adminLogin(context, loginObj) {
      const formdata = new FormData()

      context.commit('startLogin')
      formdata.append("id", loginObj['id'])
      formdata.append("pwd", loginObj['pwd'])
      console.log('formdata:', formdata)
      try {
        const res = await axios.post('/login', formdata, {
          headers: {
            'X-SKIP-INTERCEPTOR': true,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })

        console.log('여기까지는 들어옴?', res)
        console.log(formdata.get("id"))
        foodRecommend(formdata.get("id"))

        // 응답 본문에서 토큰을 추출합니다.
        const token = res.data

        const decodedToken = jwtDecode(token) // 토큰을 해독

        const authority = decodedToken.authority // 해독된 토큰에서 권한 정보를 가져옴
        if (authority !== 'ROLE_ADMIN') {
          alert('권한이 없습니다.')
          throw new Error('Access denied')
        }
        if (res.status === 200) { // 로그인 요청이 성공했을 때만 토큰을 저장하는 요청을 실행
          await context.dispatch('saveToken', token)
          alert("관리자 로그인 실행 관리자 페이지로 이동합니다.")

          await router.push('/access-control')  // 관리자 페이지로 이동
          context.commit('endLogin')
        } else {
          throw new Error('Login failed')
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('아이디나 비밀번호를 확인해주세요.')
        } else if (error.message === 'Invalid token specified: Cannot read properties of undefined (reading \'replace\')') {
          alert('권한이 없습니다.')
        } else {
          alert('권한이 없습니다.')
          console.log(error)
        }
      }
    },





    updateUserInfo({ commit }, newUserInfo) {
      commit('loginSuccess', newUserInfo)  // 'loginSuccess' 뮤테이션 커밋
    },



    socialLogin(context, url) {
      window.location.href = url

      //context.dispatch('getToken')  // 'loginStore' 모듈의 'getToken' 액션 호출
      //context.dispatch('saveToken')  // 'loginStore' 모듈의 'saveToken' 액션 호출
      //context.dispatch('getMemberInfo')  // 'loginStore' 모듈의 'getMemberInfo' 액션 호출
    },


    saveToken(context, token) {
      if (token) { // 토큰 값이 제공된 경우만 로컬 스토리지에 저장
        console.log('access_token', token)
        localStorage.setItem('access_token', token) // 토큰을 저장함
      }

      context.dispatch('getMemberInfo').catch(error => {
        console.log('회원 정보를 가져오는 데 실패했습니다:', error)
      })
    },

    getToken() {
      return axios.post('/user/getToken', null, {
        withCredentials: true,
      })
        .then(response => {
          const token = response.data

          localStorage.setItem('access_token', token) // 로컬 스토리지에 토큰 저장

          return token
        })
    },
    getMemberInfo({ commit, dispatch }) {
      const token = localStorage.getItem('access_token') // 로컬 스토리지에서 토큰을 가져옴

      axios.get('/user/getMemberInfo', {
        headers: {
          'Authorization': `Bearer ${token}`, // 인증 헤더에 토큰을 포함함
        },
        withCredentials: true,
      })
        .then(res => {
          const userInfo = {
            name: res.data.name,
            id: res.data.id,
            pro_filepath: res.data.pro_filepath,
          }

          dispatch('updateUserInfo', userInfo, { root: true })
          commit('loginSuccess', userInfo)
        })
        .catch(error => {
          console.log('회원 정보를 가져오는 데 실패했습니다:', error)
        })
    },
    logout({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/logout', null, { withCredentials: true })


          await dispatch('userStore/userlogout', null, { root: true }) // 'userStore'의 'logout' 액션 디스패치
          await commit('logoutTest')

          window.location.href = res.data.redirectUrl

          resolve()
        } catch (error) {
          console.log('로그아웃 요청 중 에러가 발생했습니다:', error)
          reject(error)
        }
      })
    },


  },

}

export default loginStore
