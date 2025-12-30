<script setup>
import Btnsu from '@/pages/views/demos/components/button/self-suc.vue'
import SelfEdit from '@/pages/views/demos/forms/form-elements/textarea/self-edit.vue'
import axios from '@axios'
import { computed, onMounted, onUpdated, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const router = useRouter()



let profilePathWithTime = computed(() => {
  return `${profiledata.value.profilePath}?t=${Date.now()}`
})

onUpdated(() => {
  profilePathWithTime.value = `${profiledata.value.profilePath}?t=${Date.now()}`
})


const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.loginStore.userInfo)
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

watch(name, fetchProfile, { immediate: true })


// userInfo가 업데이트될 때마다 searchuser를 업데이트합니다.
watch(userInfo, async () => {
  await Promise.all([fetchData(), fetchProfile()])
}, { immediate: true })

// 사용자 스토어의 액션을 호출합니다.


const userName = computed(() => {
  if (!store.state.userStore.userInfo) {
    return null
  }

  return store.state.userStore.userInfo.id
})


watchEffect(() => {
  // userInfo.value가 null인 경우 함수를 종료
  if (!userInfo.value) {
    return
  }

  fetchData()
})

// userName이 변경될 때마다 콜백 함수를 실행합니다.
watch(userName, async (newName, oldName) => {
  console.log(`Name changed from ${oldName} to ${newName}`)

  // userInfo.value가 null인 경우 함수를 종료
  if (!userInfo.value) {
    console.log('userInfo.value is null')

    return
  }

  // 여기에서 필요한 업데이트 로직을 추가하면 됩니다.
  // 예: fetchData와 fetchProfile을 호출
  await Promise.all([fetchData(), fetchProfile()])
})



const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}

const editClick = ref(true)
const edit = ref(false)
const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

const resolveUserStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'

  return 'primary'
}


// mh는 Member_History 테이블을 뜻하는 약자
const userFSMcount = ref({}) //친구/구독자/메이트 관련 데이터
const profiledata = ref([])//내 프로필 데이터




async function fetchData() {
  if (!userInfo.value || !userInfo.value || !userInfo.value.id) {
    console.log('비회원으로 데이터를 가져올 수 없습니다.')

    return
  }

  try {
    const response = await axios.get('/user/relationship', {
      params: {
        id: userInfo.value.id,
      },
      withCredentials: true,
    })

    if (response.status === 200) {
      // subdate.value = response.data
      // console.log('MySub 배열(구독자) 값:', response.data.MySub)
      // length.value = subdate.value.MySub.length
      userFSMcount.value = response.data
      console.log("프로필:", response.data)
    } else {
      console.log('데이터 가져오기 실패')
    }
  } catch (error) {
    console.error(error)
    alert(error.response.data.message)
  }
}

async function fetchProfile() {
  if (!userInfo.value || !userInfo.value || !userInfo.value.id) {
    console.log('비회원으로 데이터를 가져올 수 없습니다.')

    return
  }
  try {
    const response = await axios.get('/comm/profile', {

      params: {
        id: userInfo.value.id,
      },

      withCredentials: true,
    })

    const newProfileData = response.data

    profiledata.value = newProfileData

    if (response.status === 200) {
      console.log('프로필 값:', response.data)
      profiledata.value = response.data
      console.log('프로필 Path:', profiledata.value.profilePath)
      imageUrl.value = response.data.profilePath
    } else {
      console.log('데이터 가져오기 실패')
    }
  } catch (error) {
    console.error(error)
  }
}

const updateprofile = newcolval => {
  const data = {
    id: userInfo.value.id,
    proIntroduction: newcolval,
  }

  axios.put('/comm/intro/update', data, { withCredentials: true }, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log('성공')

      const store = useStore() // 이 줄을 추가합니다.

      store.dispatch('userStore/updateUserInfo', { pro_filepath: newcolval }) // 이 줄을 추가합니다.
    })
    .catch(error => {
      console.log('실패')
    })
}

const updateProFilepath = async newProFilepath => {
  // newProFilepath는 새로운 pro_filepath 값입니다.
  await store.dispatch('updateProFilepath', newProFilepath)
}

//////////////////////////////////////////////////////////////////////
// 이미지
const showDialog = ref(false) //프로필 사진 교체를 위한 Dialog 호출 변수
const imageUrl = ref('') // 이미지 URL을 담을 변수 -- 사진 1개
const imageSize = ref(null) //이미지 마우스 올릴 때 이벤트를 위한 변수
const imgUrl = ref(null) // imgUrl 변수 정의
const FileInputbtn = ref(true)
const inputfilename = ref('') // 저장될 파일명
let fileName = '' // fileName 변수 정의
const showIcon = ref(false) // 프로필 사진에 마우스 올리면 아이콘 노출 유무

//Profile 사진 교체를 위한 axios
const imagechange = () => {
  if (!userInfo.value || !userInfo.value || !userInfo.value.id) {
    console.log('비회원으로 데이터를 가져올 수 없습니다.')

    return
  }

  const requestData = {
    id: userInfo.value ? userInfo.value.id : null,
    profilePath: 'https://ictimg.s3.ap-northeast-2.amazonaws.com/image/' + inputfilename.value,
  }

  console.log('정상작동')
  axios
    .put('/comm/profile/update', requestData, {
      params: {
        id: userInfo.value.id,
      }, withCredentials: true
    })
    .then(response => {
      console.log('프로필 이미지 업데이트 성공')

      updateProFilepath('https://ictimg.s3.ap-northeast-2.amazonaws.com/image/' + inputfilename.value)

      fetchProfile()
    })
    .catch(error => {
      console.error('프로필 이미지 업데이트 실패')
      console.error(error)
    })
}

// .then(() => {
//     // 이미지 업로드가 성공적으로 완료된 후에 updateProFilepath를 호출
//       updateProFilepath('/images/'+inputfilename.value)
//     })

// 프로필 파일 업로드할때 필요한 함수
const uploadImg = e => {
  const fileList = e.target.files

  if (fileList.length > 0) {
    // fileList의 파일에 대해 URL 생성 및 배열에 추가
    const imageUrl = URL.createObjectURL(fileList[0])

    // 배열을 컴포넌트 내의 데이터에 할당
    imgUrl.value = imageUrl
    FileInputbtn.value = false

    // 파일명 설정
    fileName = fileList[0].name
    inputfilename.value = fileName // 변경 전: `/src/assets/images/userProfile/${fileName}`
    uploadFile(fileList[0]).then(() => {
      console.log('파일 업로드 진행..')
    }).catch(error => {
      console.error('File upload failed')
      console.error('Error:', error)
    })
  } else {
    console.error('선택된 파일이 없습니다.')
  }
}

// 파일을 전송하고 서버로 업로드하는 함수
const uploadFile = file => {
  if (!userInfo.value.id) {
    console.log('비회원으로 데이터를 가져올 수 없습니다.')

    return
  }
  const formData = new FormData()

  formData.append('file', file)

  // axios.post가 Promise를 반환하므로 return 문을 사용하여 Promise를 반환하도록 합니다.
  return axios.post('/comm/upload', formData, {
    params: {
      id: userInfo.value ? userInfo.value.id : null,
    }, withCredentials: true
  })

}


onMounted(async () => {
  // userInfo.value가 null인 경우 함수를 종료
  if (!userInfo.value) {
    return
  }

  try {
    await Promise.all([fetchData(), fetchProfile()])
  } catch (error) {
    console.error('Error in fetchData or fetchProfile:', error)
  }
})
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <div class="avatar-container">
            <VAvatar rounded="sm" size="150" :image="profilePathWithTime" class="mt-3" @click="showDialog = true"
              @mouseover="showIcon = true" @mouseout="showIcon = false" />
            <!-- 아래 Icon은 교체 아이콘으로... -->
            <VIcon v-if="showIcon" size="x-large" color="success" icon="mdi-autorenew" class="icon" style="opacity: 1;"
              @click="showDialog = true" />
          </div>
          <!-- -->
          <VDialog v-model="showDialog" max-width="500">
            <VCard title="설정할 프로필 사진을 선택해주세요">
              <DialogCloseBtn variant="text" size="small" @click="showDialog = false" />
              <VCardText v-if="FileInputbtn">
                사진을 추가해주세요
              </VCardText>
              <VImg v-if="imgUrl" :src="imgUrl" style="width: 400px; height: 400px; align-self: center;" />
              <VCol cols="12">
                <VFileInput :rules="rules" label="Profile IMG" type="file" accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar" prepend-icon="mdi-camera-outline" @change="uploadImg" />
              </VCol>
              <VCol>
                <VBtn block @click="showDialog = false, imagechange()">
                  확인
                </VBtn>
              </VCol>
            </VCard>
          </VDialog>

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-4">
            {{ profiledata.name }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip label color="success" density="comfortable" class="text-capitalize mt-4">
            {{ profiledata.date }}
          </VChip>
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap mt-1">
          <!-- 👉 Done task -->
          <div class="d-flex align-center">
            <VAvatar :size="44" rounded color="primary" variant="tonal" class="me-4">
              <VIcon size="24" icon="mdi-emoticon-wink" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ userFSMcount["f"] }}
              </h6>
              <span>친구</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center">
            <VAvatar :size="44" rounded color="primary" variant="tonal" class="me-4">
              <VIcon size="24" icon="mdi-star" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ userFSMcount["s"] }}
              </h6>
              <span>구독자</span>
            </div>
          </div>

          <div class="d-flex align-center">
            <VAvatar :size="44" rounded color="primary" variant="tonal" class="me-4">
              <VIcon size="24" icon="mdi-walk" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ userFSMcount["m"] }}
              </h6>
              <span>메이트</span>
            </div>
          </div>
        </VCardText>

        <!-- 👉 Details -->
        <VCardText>
          <VRow align="center ml-4">
            <h6 class="text-h6" style="margin-top: 10px; margin-bottom: 5px;">
              자기소개
            </h6>
            <IconBtn>
              <VIcon v-if="!edit" icon="mdi-lead-pencil" size="22" @click="editClick = !editClick, edit = !edit" />
            </IconBtn>
          </VRow>
          <VCol cols="12" md="12" rows="12" style="height: 380px;">
            <SelfEdit v-model="profiledata.proIntroduction" :readonly="editClick"
              :value="profiledata.proIntroduction" />
            <div v-if="edit" style=" margin-top: 10px;float: inline-end;">
              <Btnsu @click="editClick = true, edit = false, updateprofile(profiledata.proIntroduction)" />
            </div>
          </VCol>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" :user-data="props.userData" />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
}

.icon {
  position: absolute;

  /* 아이콘 스타일 및 위치 설정 */
}
</style>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
