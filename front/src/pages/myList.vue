<script setup>
import axios from '@axios';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';


const props = defineProps({
  id: {
    type: String,
    required: true,  // 필수로 전달되어야 함을 명시
  },
})

const userProfileModal = ref(false)
const editingModal = ref(false)
const viewPostPageModal = ref(false)
let postToEdit = ref("")
let q = ref('')
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const connetAv = userInfo.value.pro_filepath

const state = reactive({
  items: [],
  avatar1: '', // avatar1에 대한 초기값을 설정해주세요.
})

// axios를 사용하여 데이터를 받는 함수
const getData = async function () {

  try {
    console.log("props.id", props.id)

    const response = await axios.get(`/bbs/ViewMy.do?id=${props.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 응답 처리
    if (response.status === 200) {
      console.log('데이터 받기 성공')
      state.items = response.data // 데이터 저장
      console.log('가져온 아이템을 어디 한번 보자', state.items)
    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
}

//삭제코드
const deleteItem = async bno => {
  try {
    const response = await axios.get(`/bbs/${bno}/Delete.do`)
    if (response.data === 1) {
      const bnoInt = parseInt(bno) // bno를 숫자로 변환

      state.items = state.items.filter(item => item.bno !== bnoInt) // items 배열에서 삭제된 항목 제거
    } else {
      console.log(response.data, "response.data")
      alert('삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}

// 글 수정 코드
const submitEdit = async bno => {
  try {
    const response = await axios.get('/bbs/ViewOne.do', { params: { bno: bno } })

    if (response.status === 200) {
      console.log('글 번호 전송 성공')
      console.log(response.data, "response.data")

      // 서버로부터 받은 데이터를 자식 컴포넌트에게 전달하기 위해 저장
      postToEdit.value = response.data
    } else {
      console.log('글 번호 전송 실패')
    }
  } catch (error) {
    console.error(`글 번호 전송 실패: ${error}`)
  }
}

//////////////////////////////////////
/* 댓글 */
let group = ref([])
let Allgroupbbs = ref([])

//댓글 목록 가져오기
let groupedDataAll = ref({})
let groupedData = ref({})

const statecomm = ref({
  comment: [],
})

const getComment = async function () {

  try {
    const response = await axios.get('/commentline/View.do', {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 응답 처리
    if (response.status === 200) {
      console.log('가져온 댓글 데이터 체크', response.data)

      // BBS_NO 값을 기준으로 데이터 묶기
      groupedDataAll.value = response.data.reduce((acc, curr) => {
        const bbsNoAll = curr.BBS_NO
        if (acc[bbsNoAll]) {
          acc[bbsNoAll].push(curr)
        } else {
          acc[bbsNoAll] = [curr]
        }

        return acc
      }, {})

      groupedData.value = {}
      response.data.forEach(comment => {
        const bbsNo = comment.BBS_NO

        // 해당 BBS_NO에 대한 댓글이 이미 있는 경우
        if (groupedData.value[bbsNo]) {
          const existingComment = groupedData.value[bbsNo]

          // C_NO가 가장 큰 댓글인지 확인
          if (comment.C_NO > existingComment.C_NO) {
            groupedData.value[bbsNo] = comment
          }
        } else {
          // 해당 BBS_NO에 대한 댓글이 없는 경우
          groupedData.value[bbsNo] = comment
        }
      })

      console.log('전체 데이타', groupedDataAll)
      console.log('특정 게시물 데이타', groupedDataAll.value)

      postmodalData.value = {
        comments: groupedDataAll.value[postbbsno.value],
      }

      // Allgroupbbs.value = groupedDataAll._rawValue[17]
      statecomm.value.comment = toRaw(groupedData)
      group.value = toRaw(statecomm.value.comment)
      console.log('그룹 데이터 확인', group.value)

    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
}

const postmodalData = ref({ comments: {} })
const postbbsno = ref(0)

const openViewPostMoadl = async val => {
  console.log('가져온 글번호', val)
  postbbsno.value = val
  viewPostPageModal.value = true

  // console.log('글번호에 대한 댓글', groupedDataAll.value._rawValue[postbbsno.value])
  postmodalData.value = {
    comments: groupedDataAll.value[postbbsno.value],
  }
  console.log(postmodalData.value)
}

const modalData = ref({ userid: '', userproIntroduction: '', userprofilePath: '' })
const profiledata = ref([])//내 프로필 데이터

const openUserProfileModal = val => {
  console.log('오픈할 유저 프로필:', val)
  let id

  if (typeof val === 'object' && val.id) {
    id = val.id // val이 객체이고 id 속성이 존재하는 경우
  } else {
    id = val // 그 외의 경우 val 그대로 사용
  }
  axios
    .get('/comm/profile', {
      params: {
        id: id,
      },
    })
    .then(response => {
      if (response.status === 200) {
        console.log('프로필 값:', response.data)
        profiledata.value = response.data
        console.log('프로필 Path:', profiledata.value.profilePath)

        // 모달에 전달할 변수 값 설정
        modalData.value = {
          userid: profiledata.value.id,
          userprofilePath: profiledata.value.profilePath,
          userproIntroduction: profiledata.value.proIntroduction,
        }
      } else {
        console.log('데이터 가져오기 실패')
      }
    })
    .catch(error => {
      console.error(error)
    })
  userProfileModal.value = true
}

//댓글 입력
const searchuser = userInfo.value.id //현재 접속중인 유저 아이디

console.log("userInfo.value.id", userInfo.value.id)

const commentinput = ref('')

const insertComment = async (bno, comment, type, parent_comment) => {
  const formData = new FormData()

  formData.append('bbs_no', bno)
  formData.append('id', searchuser)
  formData.append('ccomment', comment)
  if (type == 2 && parent_comment !== 0) {
    formData.append('parent_comment', parent_comment)
    formData.append('type', 2)
  } else {
    formData.append('type', 1)
  }
  console.log(bno, searchuser, comment, parent_comment)

  await axios.post('/commentline/Write.do', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      // 성공적으로 업데이트되었을 때의 처리
      console.log('성공')
      console.log(response.data)

      // 댓글 입력 필드 초기화
      commentinput.value = ''

      getComment()
    })
    .catch(error => {
      // 업데이트 중 오류가 발생했을 때의 처리
      console.log('실패')
    })
}

//스크롤 이벤트 리스터 추가 - 화면 하단에 스크롤 도착 시 loadMore()함수 호출
const scrollTimeout = ref(null)

const handleScroll = () => {
  if (scrollTimeout.value !== null)
    clearTimeout(scrollTimeout.value)

  scrollTimeout.value = setTimeout(function () {
    // 스크롤이 페이지 하단에서 100px 이내로 가까워졌을 때 loadMore 함수 호출
    if ((window.innerHeight + document.documentElement.scrollTop) >= (document.documentElement.offsetHeight - 100)) {
      loadMore()
    }
  }, 150)
}

//이벤트 리스터 추가 
onMounted(() => {
  getData(), // 컴포넌트가 마운트될 때 getData 함수 실행
    getComment()

  // 그 후 매 5초마다 getData 함수를 반복해서 실행
  //setInterval(getData, 5000)

  window.addEventListener('scroll', handleScroll)
})

//이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

//게시글 반복할 배열의 길이 설정 + 무한 스크롤로 사용하는 배열 저장용

const items = ref(Array.from({ length: 5 }))

// 스크롤 하단에 내렸을때 호출되는 함수 정리

const loadMore = () => {
  //moreItems로 새로 추가할 배열의 길이 설정

  const moreItems = Array.from({ length: 5 })

  //items 배열에 moreItems 배열 추가해서 화면에 표시되는 게시글 추가

  items.value = items.value.concat(moreItems)
  console.log("leadMore..")
}
</script>


<template>
  <section>
    <VRow style="margin-top: -50px;">
      <VCol cols="12">
        <VCard flat :max-width="auto" class="mt-12 mt-sm- pa-0">
          <VCardText>
            <VCol>
              <VCol>
                <!-- 게시물 작성 공간 -->
                <VCol v-if="state.items.length > 0">
                  <!-- 게시물이 있을 때의 템플릿 -->
                  <VCol v-for="(item, index) in state.items" :key="index" cols="12">
                    <VCard>
                      <!-- 게시물의 상단 유저 프로필/ 유저 닉네임 / MoreBtn :image="state.avatar1" -->
                      <VCol>
                        <VRow>
                          <VCol cols="1">
                            <VAvatar class="text-sm pointer-cursor" :image="connetAv"
                              style=" margin-top: 10% ;margin-left: 10%;" @click="userProfileModal = true" />
                          </VCol>
                          <VCol cols="4">
                            <VCol cols="12">
                              <VCardSubtitle class="text-sm pointer-cursor" style="margin-left: -15%;"
                                @click="userProfileModal = true">
                                {{ item.id }} <!-- 유저 닉네임 뿌려주기 -->
                              </VCardSubtitle>
                            </VCol>
                          </VCol>
                          <VCol cols="6" />
                          <VCol cols="1">
                            <VCol cols="1">
                              <VBtn icon variant="text" size="small" color="medium-emphasis">
                                <VIcon size="24" icon="mdi-dots-vertical" />

                                <VMenu activator="parent">
                                  <VList>
                                    <VListItem @click="editingModal = true; submitEdit(item.bno)">
                                      <template #prepend>
                                        <VIcon icon="mdi-comment-edit-outline" />
                                      </template>
                                      <VListItemTitle>수정하기</VListItemTitle>
                                    </VListItem>

                                    <VListItem @click="deleteItem(item.bno)">
                                      <template #prepend>
                                        <VIcon icon="mdi-delete-outline" />
                                      </template>
                                      <VListItemTitle>삭제하기</VListItemTitle>
                                    </VListItem>
                                  </VList>
                                </VMenu>
                              </VBtn>
                            </VCol>
                          </VCol>
                        </VRow>
                      </VCol>
                      <VCol v-if="item.files && item.files.length == 1" class="transparent-carousel"
                        show-arrows-on-hover>
                        <VCol v-for="(image, i) in item.files" :key="i" :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor" style="width: auto; height: auto;"
                            @click="openViewPostMoadl(item.bno); submitEdit(item.bno)" />
                        </VCol>
                      </VCol>
                      <VCarousel v-if="item.files && item.files.length >= 2" class="transparent-carousel"
                        show-arrows-on-hover color="success" style="width: auto; height: auto;" cycle interval="2000">
                        <VCarouselItem v-for="(image, i) in item.files" :key="i"
                          :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor"
                            @click="openViewPostMoadl(item.bno); submitEdit(item.bno)" />
                        </VCarouselItem>
                      </VCarousel>
                      <VCardItem>
                        <VCardTitle class="pointer-cursor" @click="openViewPostMoadl(item.bno); submitEdit(item.bno)">
                          {{ item.content }}
                        </VCardTitle>
                      </VCardItem>

                      <VCardText>
                        <VCol v-if="group[item.bno]">
                          <strong>{{ group[item.bno].C_NO }}번 {{ group[item.bno].ID }}</strong> {{
                            group[item.bno].CCOMMENT }}
                        </VCol>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VCol>
              </VCol>
            </VCol>
          </VCardText>
          <VCol v-if="state.items.length <= 0" class="d-flex justify-center align-center" style="height: 300px;">
            <!-- 게시물이 없을 때의 템플릿 -->
            <VCol class="d-flex flex-column align-center justify-center" style="height: 100%;">
              <VCardTitle class="headline font-weight-bold">
                등록한 게시물이 없습니다
              </VCardTitle>
            </VCol>
          </VCol>
        </VCard>
      </VCol>
    </VRow>
    <UserProfileCommunity v-model:isDialogVisible="userProfileModal" :userid="modalData.userid"
      :userprofile-path="modalData.userprofilePath" :userpro-introduction="modalData.userproIntroduction" />
    <Editing v-model:isDialogVisible="editingModal" :post-to-edit="postToEdit" @update-success="getData" />
    <ViewPostPage v-model:isDialogVisible="viewPostPageModal" :post-to-edit="postToEdit"
      :comments="postmodalData.comments" :bno="postToEdit.bno" :open-user-profile-modal="openUserProfileModal"
      :insert-comment="insertComment" :searchuser="searchuser" :get-comment="getComment" />
  </section>
</template>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";

.active-slide {
  color: success;
}

.transparent-carousel .v-carousel__controls {
  background-color: transparent;
}
</style>
