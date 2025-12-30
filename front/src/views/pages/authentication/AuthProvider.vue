<script setup>
import { API_BASE_URL } from '@/config'
import btnD_icon_circle from '@images/icons/project-icons/btnD_icon_circle.png'
import google from '@images/icons/project-icons/google.png'
import kakaoLogin from '@images/icons/project-icons/kakaoLogin.png'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const { global } = useTheme()

const store = useStore()



const authProviders = [
  {
    src: kakaoLogin,
    color: '#4267B2',
    colorInDark: '#4267B2',
    url: `${API_BASE_URL}/oauth2/authorization/kakao`,
  },
  {
    src: btnD_icon_circle,
    color: '#272727',
    colorInDark: '#fff',
    url: `${API_BASE_URL}/oauth2/authorization/naver`,
  },
  {
    src: google,
    color: '#DB4437',
    colorInDark: '#DB4437',
    url: `${API_BASE_URL}/oauth2/authorization/google`,
  },
]


const socialLogin = url => {
  store.dispatch('socialLogin', url)
}
</script>

<template>
  <div class="auth-providers">
    <VImg v-for="link in authProviders" :key="link.src" class="pointer-cursor" :src="link.src"
      style="width: 50px; height: 50px;" :href="link.url" variant="text"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color" @click.prevent="socialLogin(link.url)" />
  </div>
</template>

<style scoped>
.auth-providers {
  display: flex;
  justify-content: space-between;
}

.pointer-cursor {
  cursor: pointer;
}
</style>
