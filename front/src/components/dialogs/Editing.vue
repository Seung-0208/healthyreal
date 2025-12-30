<script setup>


import axios from '@axios'
import backgroundimg from '@images/pages/writing.jpg'
import { ref } from 'vue'
import { useStore } from 'vuex'



const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  postToEdit: {
    type: Object,
    default: () => ({}),
  },
})


const emit = defineEmits(['update:isDialogVisible', 'update-success'])

const store = useStore()


// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const connetAv = userInfo.value.pro_filepath
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

// switch2의 초기값은 postToEdit.disclosureYN의 값에 따라 결정됩니다.
const switch2 = ref(props.postToEdit.disclosureYN === 'Y')

// postToEdit가 변경될 때마다 switch2의 값을 업데이트합니다.
watch(() => props.postToEdit.disclosureYN, newVal => {
  switch2.value = newVal === 'Y'
})


const disclosureValue = computed(() => switch2.value ? 'Y' : 'N')

const hashtags = ref([])
const hashtagValue = ref('')
const content = ref('') // 콘텐츠를 저장할 ref를 추가

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

const submitEdit = async function () {
  // 수정할 데이터를 객체에 저장
  let data = {
    content: content.value,  // content ref의 값을 사용
    disclosureYN: disclosureValue.value,  // computed property의 값을 사용
    hashTag: hashtags.value.join(','),  // 해시태그 배열을 콤마로 연결한 문자열로 변환
    bno: props.postToEdit.bno,
  }
  console.log("props.postToEdit.bno", props.postToEdit.bno)
  console.log("data", data)


  try {
    const response = await axios.post('/bbs/Edit.do', data)

    // 응답 처리
    if (response.status === 200) {
      console.log('데이터 수정 성공')

      // 부모 컴포넌트에 알림
      emit('update-success')

      // 모달창 닫기
      emit('update:isDialogVisible', false)

      // 값 초기화
      content.value = ''
      hashtags.value = []
      hashtagValue.value = ''

    } else {
      console.log('데이터 수정 실패')
    }
  } catch (error) {
    console.error(`데이터 수정 실패: ${error}`)
  }
}
</script>


<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 1100" :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate">
    <!-- 닫기 버튼 -->
    <VCol cols="12">
      <VCard>
        <VRow>
          <VCol>
            <VBtn icon @click="$emit('update:isDialogVisible', false)">
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </VCol>
          <VCol cols="8">
            <VCol style=" font-size: 20px; font-weight: bold;text-align: center;">
              게시글 수정
            </VCol>
          </VCol>
          <VCol cols="2">
            <VSwitch v-model="switch2" :label="switch2 ? '공개' : '비공개'" :true-value="Y" :false-value="N" />
          </VCol>
          <VCol>
            <VBtn @click="submitEdit">
              수정
            </VBtn>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="6">
            <VCol v-if="postToEdit.files && postToEdit.files.length == 1" class="transparent-carousel"
              show-arrows-on-hover color="success">
              <VCol v-for="(img, index) in postToEdit.files" :key="index">
                <VImg :src="img" style="margin-top: 15%;" />
              </VCol>
            </VCol>
            <VImg v-if="postToEdit.files && postToEdit.files.length == 0" :src="backgroundimg" />
            <VCarousel v-if="postToEdit.files && postToEdit.files.length >= 2" class="transparent-carousel"
              show-arrows-on-hover color="success" style="margin-top: 0%;" cycle interval="2000">
              <VCarouselItem v-for="(img, index) in postToEdit.files" :key="index">
                <VImg :src="img" />
              </VCarouselItem>
            </VCarousel>
          </VCol>
          <VCol cols="6">
            <VRow>
              <VCol>
                <VRow style="margin-top: 1%;">
                  <VCol cols="1">
                    <VAvatar class="text-sm pointer-cursor" :image="connetAv" @click="userProfileModal = true" />
                  </VCol>
                  <VCol cols="">
                    <VCol cols="12">
                      <VCardSubtitle class="text-sm pointer-cursor" style="margin-left: -5%;"
                        @click="userProfileModal = true">
                        {{ postToEdit.id }} <!-- 유저 닉네임 뿌려주기 -->
                      </VCardSubtitle>
                    </VCol>
                  </VCol>
                  <VSpacer />
                </VRow>
              </VCol>
            </VRow>
            <VCol cols="12">
              <VTextarea v-model="content" rows="10" style="height: 250px; margin-right: 2%;" class="disabled-textarea"
                no-resize :placeholder="postToEdit.content" />
            </VCol>
            <VCol>
              <VBtn icon="mdi-heart-outline" variant="text" color="success" />
              <VBtn icon="mdi-chat-outline" variant="text" color="success" />
              <VBtn icon="mdi-send" variant="text" color="success" />
              <VBtn icon="mdi-bookmark-outline" variant="text" color="success" />
            </VCol>


            <VRow>
              <VCol cols="9">
                <VTextarea label="댓글달기" rows="1" style="height: 15px; border: none;" variant="underlined" />
              </VCol>
              <VCol cols="1">
                <VBtn size="large">
                  게시
                </VBtn>
              </VCol>
            </VRow>
            <VRow style=" margin-top: 5; margin-right: 2%; margin-bottom: 0;">
              <VCol cols="12">
                <VTextarea v-model="hashtagValue" rows="2" :placeholder="postToEdit.hashTag" no-resize />

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
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VDialog>
</template>



<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>

<style>
.disabled-textarea {
  color: black;
  /* 텍스트 색상을 검정색으로 설정합니다. */
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
