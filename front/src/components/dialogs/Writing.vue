<script setup>
import Text from '@/pages/views/demos/forms/form-elements/textarea/WritingText.vue'
import axiosflask from '@/plugins/axiosflask'
import Sub from '@/views/demos/Subject.vue'
import axios from '@axios'
import { size } from '@floating-ui/dom'
import logo from '@images/logo.svg'; // 로고 이미지 불러오기
import bg from '@images/pages/writing.jpg'
import { computed, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'




const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', "update-success"])



const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

const isprofile = ref(false)
const router = useRouter()
const people = ref(false)
const switchValue = computed(() => people.value ? 'Y' : 'N')
const subValue = ref('카테고리')
const textValue = ref('')
const hashtagValue = ref('')
let images = reactive({ files: [] })  // 선택된 이미지 파일을 저장하는 배열
let activeTab = ref(0)
let maxNameLength = 100  // 합쳐진 파일 이름의 최대 길이
let dialog = ref(false)
let message = ref('')  // 텍스트 박스의 데이터
const { files } = toRefs(images)
let fileInput = ref(null)  // 파일 입력을 위한 ref 생성
let isLoading = ref(false)  // 로딩 상태를 나타내는 데이터 추가
const ciu = ref([])
const connetAv = userInfo.value.pro_filepath

// 해시태그를 저장하는 ref
const hashtags = ref([])

const dialogVisibleUpdate = value => {
  emit('update:isDialogVisible', value)
}


const isButtonDisabled = computed(() => {
  return subValue.value == '카테고리' || !textValue.value && !hashtagValue.value === 0
})

const members = [
  {
    avatar: connetAv,
    name: connetId,
  },
]

// axios를 사용하여 데이터를 서버로 보내는 함수
const submitData = async function () {
  let formData = new FormData()
  formData.append('id', connetId)
  formData.append('content', textValue.value)
  formData.append('hashTag', hashtagValue.value)
  formData.append('type', subValue.value.value)
  formData.append('disclosureYN', switchValue.value)
  formData.append('ciu', JSON.stringify(ciu.value))  // ciu 리스트를 JSON 문자열로 변환
  console.log(ciu.value)


  // 각 파일을 FormData에 추가
  if (images.files.length > 0) {
    images.files.forEach(file => {
      formData.append('files', file.file)  // 파일의 이름을 'files'로 지정
    })
  }


  try {
    const response = await axios.post('/bbs/Write.do', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // 응답 처리
    if (response.status === 200) {
      console.log('데이터 전송 성공')
      emit('update-success')
      console.log(`response.data: ${response.data}`)
    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  } finally {
    emit('update:isDialogVisible', false)  // 모달 닫기

    // 값 초기화
    textValue.value = ''
    hashtags.value = []
    hashtagValue.value = ''
    subValue.value = '카테고리'
    images.files = []
    ciu.value = []

    //router.push({ name: 'community_post' }).then(() => router.go(0)) // community_post.vue 페이지로 이동 후 리로드
  }

}



// hashtagValue를 감시하도록 watch 함수를 설정
watch(hashtagValue, () => {
  const matches = hashtagValue.value.match(/#\s*\S+/g) || []

  hashtags.value = matches.map(hashtag => hashtag.replace(/\s/g, ''))
})

// 해시태그를 삭제하는 함수
const removeHashtag = hashtag => {
  const index = hashtags.value.indexOf(hashtag)
  if (index > -1) {
    hashtags.value.splice(index, 1)
    hashtagValue.value = hashtags.value.join(' ')
  }
}


// 이미지 생성 요청 함수
async function createImage() {
  isLoading.value = true  // 요청 전에 로딩 상태를 true로 설정
  try {
    const response = await axiosflask.post('/CreateIm', { message: message.value, id: connetId })

    console.log(response.data.image_url)

    images.files.unshift({ url: response.data.image_url, name: response.data.image_name })  // 이미지 정보를 객체로 저장

    ciu.value.push({ url: response.data.image_url })
    console.log(ciu.value)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false  // 요청 완료 후에 로딩 상태를 false로 설정
  }
}

// 파일 입력을 처리하는 함수
const onFileChange = e => {
  for (let file of e.target.files) {
    images.files.push({ url: URL.createObjectURL(file), name: file.name, file: file })  // 이미지 정보를 객체로 저장
  }
  console.log(images.files[0].file)
}

const handleFileInput = files => {
  for (let file of files) {
    images.files.push({ url: URL.createObjectURL(file), name: file.name, file: file })  // 이미지 정보를 배열에 추가
  }
  console.log(images.files[0].file)
  fileInput.value.reset()  // VFileInput 컴포넌트를 리셋
}

const sendMessage = () => {
  createImage()   // 이미지 생성 요청
}



// 파일 이름을 가져오는 계산된 속성
let fileNames = computed(() => {
  let names = files.value.map(file => file.name)  // 이미지 정보에서 이름을 추출
  let totalLength = names.join(', ').length
  if (totalLength > maxNameLength) {
    while (names.join(', ').length > maxNameLength) {
      names[names.length - 1] = names[names.length - 1].slice(0, -1)
    }
    names[names.length - 1] += '...'  // 마지막 파일 이름에 줄임표 추가
  }

  return names.join(', ')
})


// 이미지 URL을 생성하는 함수
const createImageUrl = image => {
  return image.url  // 이미지 정보에서 URL을 반환
}

// 이미지를 제거하는 함수
const removeImage = index => {
  if (activeTab.value >= images.files.length) {
    activeTab.value = images.files.length - 1
  }
  URL.revokeObjectURL(createImageUrl(images.files[index]))  // URL 해제를 먼저 수행
  images.files.splice(index, 1)
}


const zoomIn = e => {
  e.target.style.transform = 'scale(1.05)'
}

const zoomOut = e => {
  e.target.style.transform = 'scale(1)'
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 1100" :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate">
    <!-- 닫기 버튼 -->
    <VBtn icon @click="$emit('update:isDialogVisible', false)">
      <VIcon>mdi-close</VIcon>
    </VBtn>
    <VCol cols="12">
      <!--
        <VImg
        :src="bg"
        style=" filter: contrast(200%);opacity: 0.5;"
        /> 
      -->

      <VCard>
        <VCardText>
          <div class="d-flex justify-center align-center" style="margin-top: 10px;">
            <img :src="logo"> <!-- 로고 이미지 추가 -->
            <VBtn :disabled="isButtonDisabled" style="position: absolute; right: 40px;" @click="submitData">
              글 등록
            </VBtn>
          </div>
          <VRow>
            <VCol cols="6">
              <VRow style=" margin-top: 20px;">
                <VCol cols="8">
                  <VListItem v-for="(member, index) in members" :key="index">
                    <template #prepend>
                      <VAvatar class="text pointer-cursor" :image="member.avatar" @click="isprofile = true" />
                    </template>
                    <VListItemTitle class="text pointer-cursor" style="font-weight: bold;" @click="isprofile = true"
                      @mouseover="size">
                      {{ member.name }}
                    </VListItemTitle>
                  </VListItem>
                </VCol>
                <VCol cols="4">
                  <Sub v-model="subValue" />
                </VCol>
              </VRow>
              <VRow style=" margin-top: -10px;">
                <VCol cols="12">
                  <Text v-model="textValue" />
                </VCol>
              </VRow>
              <VRow style=" margin-top: -10px;">
                <VCol cols="12">
                  <VTextarea v-model="hashtagValue" rows="2" placeholder="#해쉬태그" no-resize />

                  <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
                    <span v-for="(hashtag, index) in hashtags" :key="index" style="margin-right: 10px;">
                      {{ hashtag }}
                      <button style="padding: 10px; margin-left: 5px; cursor: pointer;"
                        @click="() => removeHashtag(hashtag)">
                        x
                      </button>
                    </span>
                  </div>
                </VCol>
              </VRow>
              <VRow style="margin-top: -10px;">
                <div class="demo-space-x" style="display: flex; width: 100%; justify-content: flex-end;">
                  <VSwitch v-model="people" />
                  <h3 v-if="people" style="margin-top: 17px; margin-left: 2px;">
                    공개
                  </h3>
                  <h3 v-if="!people" style="margin-top: 17px; margin-left: 2px;">
                    비공개
                  </h3>
                </div>
              </VRow>
            </VCol>
            <VCol cols="6">
              <VCardItem>
                <div>
                  <VTextarea v-model="message" label="원하는 사진을 입력하세요" rows="2" no-resize style="margin-top: 10px;" />

                  <VRow>
                    <VCol cols="12">
                      <VBtn block style="margin: 15px 0;" @click="sendMessage">
                        이미지 생성하기
                      </VBtn>
                    </VCol>
                  </VRow>
                  <div class="image-container">
                    <img v-if="!isLoading" class="preview-image"
                      :src="files.length > 0 ? createImageUrl(files[activeTab]) : bg" @click="dialog = true"
                      @mouseover="zoomIn" @mouseout="zoomOut">
                    <VProgressCircular v-else class="loading" indeterminate color="primary" />
                    <VBtn v-if="!isLoading && files.length > 0" class="delete-button" icon small
                      @click.stop="removeImage(activeTab)">
                      <VIcon>mdi-close-outline</VIcon>
                    </VBtn>
                  </div>
                  <VDialog v-model="dialog" max-width="500px">
                    <VCard>
                      <VImg :src="files.length > 0 ? createImageUrl(files[activeTab]) : bg" />
                    </VCard>
                  </VDialog>

                  <VTabs v-model="activeTab" style="margin-bottom: 10px;">
                    <VTab v-for="(file, index) in files" :key="index" :value="index">
                      <VIcon icon="mdi-leaf-circle" />
                    </VTab>
                  </VTabs>

                  <VFileInput ref="fileInput" multiple label="파일을 첨부하세요" show-size prepend-icon="mdi-instagram"
                    accept="image/*" @change="onFileChange" @file-input="handleFileInput">
                    <template #selection="{ text }">
                      <div class="text-truncate">
                        {{ fileNames }}
                      </div>
                    </template>
                  </VFileInput>
                </div>
              </VCardItem>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VDialog>
</template>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}

.image-container {
  position: relative;
  display: inline-block;
  overflow: visible;
  /* 이미지 크기 제한 풀기 */
  border-style: solid;
  block-size: 400px;
  inline-size: 100%;
}

.preview-image {
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-in-out;
  /* 이 부분을 추가하여 확대/축소 애니메이션을 부드럽게 만듬. */
}

.delete-button {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}

.loading {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}
</style>
