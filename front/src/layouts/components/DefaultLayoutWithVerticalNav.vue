<script setup>
import navItems from '@/navigation/vertical'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { ref } from 'vue'

// Components
import Chatbot from '@/@core/components/Chatbot.vue'
import TheCustomizer from '@/@core/components/TheCustomizer.vue'
import Footer from '@/layouts/components/Footer.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import Weather from '@/pages/weather.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

// 챗봇
let chatbotOpen = ref(false)

const toggleChatbot = () => {
  console.log('클릭이벤트')
  chatbotOpen.value = !chatbotOpen.value
  console.log(chatbotOpen)
}

// 드래그 상태
let dragging = false
let offset = { x: 0, y: 0 }
let dragEventCount = ref(0)
let pexelX = 0
let pexelY = 0


// 드래그 핸들러
const startDrag = event => {
  dragging = true
  if(dragEventCount.value==0){
    offset = { x: event.clientX - event.currentTarget.offsetLeft + 50, y: event.clientY - event.currentTarget.offsetTop + 50 }
  }
  if(dragEventCount.value==1){
    offset = { x: event.clientX - pexelX, y: event.clientY - pexelY }
  }
}

const doDrag = event => {
  if (!dragging) return
  if(dragEventCount.value==0){
    event.currentTarget.style.left = `${event.clientX - offset.x }px`
    event.currentTarget.style.top = `${event.clientY - offset.y}px`
  }
  if(dragEventCount.value==1){
    event.currentTarget.style.left = `${ event.clientX - offset.x -25}px`
    event.currentTarget.style.top = `${ event.clientY - offset.y -25}px`
  }
  
}

const stopDrag = event => {
  dragging = false
  pexelX = event.clientX - offset.x
  pexelY = event.clientY - offset.y
  dragEventCount.value= 1
}
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          id="vertical-nav-toggle-btn"
          class="ms-n3"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <VSpacer />
        
        <Weather class="me-2" />
        <NavBarNotifications class="me-2" />
        <NavbarThemeSwitcher />
        
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <Component :is="Component" />
      </transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 챗봇 -->
    <template #iconBtn>
      <div
        class="icon-button" 
        style=" background-color: #f6f6f6; box-shadow: 0 2px 5px rgba(0, 0, 0, 30%);"  
        @mousemove="doDrag" 
        @mouseup="stopDrag"
      >
        <VBadge
          style="position: absolute;"
          icon="mdi-arrow-all"
          color="success"
          offset-x="40"
          offset-y="-5"
          @mousedown="startDrag"
        >
          <Chatbot />
        </VBadge>
      </div>
    </template>
    
    <!-- 👉 Customizer -->
    <TheCustomizer />
  </VerticalNavLayout>
</template>

<style lang="scss">
.icon-button {
  position: absolute;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  block-size: 70px;
  font-size: 30px;
  inline-size: 70px;
  inset-block-end: 15%;
  inset-inline-end: 15%;
}
</style>
