<script setup>
import profileBackground from '@/assets/images/pages/user-profile-header-bg.png'
import axios from '@axios'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)


const profileHeaderData = ref()
const fetchHeaderData = () => {
  axios.get('/pages/profile-header').then(response => {
    profileHeaderData.value = response.data
    console.log('가짜 프로필:', response.data)
    console.log('유저 스토어 정보', userInfo.value.id)
  })
}

axios.get("/comm/profile", { params: { id: userInfo.value.id } }
)
  .then(response => {

    console.log('유저 프로필 받아온 값:', response.data)
    profileHeaderData.value = response.data
  }

  )
  .catch(() => console.log('서버가 꺼져있습니다'))

fetchHeaderData()
</script>

<template>
  <VCard v-if="profileHeaderData">
    <VImg :src="profileBackground" min-height="125" max-height="250" cover />

    <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-4">
      <div class="d-flex h-0">
        <VAvatar size="120" :image="profileHeaderData.profilePath" class="user-profile-avatar mx-auto" />
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4">
          <div class="d-flex flex-wrap align-items-baseline justify-center justify-sm-start flex-grow-1 gap-5">
            <div :style="{ 'display': 'flex', 'align-items': 'baseline' }">
              <span>
                <h5 class="text-h5 text-center text-sm-start mb-2">
                  {{ profileHeaderData.id }}
                </h5>
                <span class="d-flex align-center ">
                  <span class="d-flex align-center" :style="{ 'margin-right': '15px' }">
                    <VIcon size="24" icon="mdi-account-badge-outline" class="me-2" />
                    <span class="text-body-1 font-weight-small">
                      {{ profileHeaderData.name }}
                    </span>

                  </span>
                  <span class="d-flex align-center">
                    <VIcon size="24" icon="mdi-calendar-start" class="me-2" />
                    가입일 &nbsp;
                    <span class="text-body-1 font-weight-medium">
                      {{ profileHeaderData.date }}
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4">
          <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-5">
            <span class="d-flex align-center ">
              <span class="text-body-1 font-weight-medium mt-6 self-i" :style="{ 'max-width': '800px' }">
                {{ profileHeaderData.proIntroduction }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}

.self_intro {
  // display: inline-block; // 인라인-블록 요소로 변환
  height: 100px;
  min-width: 700px;
}
</style>
