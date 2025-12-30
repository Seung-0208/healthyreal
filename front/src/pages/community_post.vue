<script setup>
import Editing from '@/components/dialogs/Editing.vue'
import UserProfileCommunity from '@/components/dialogs/UserProfileCommunity.vue'
import ViewPostPage from '@/components/dialogs/ViewPostPage.vue'
import Writing from '@/components/dialogs/Writing.vue'
import { sendCommReqMessage } from '@/message/requestComm'
import InviteFriendConfirmModal from '@/pages/community/InviteFriendConfirmModal.vue'
import Category from '@/pages/views/demos/forms/form-elements/select/category.vue'
import axios from '@axios'
import { size } from '@floating-ui/dom'
import defaultImg from '@images/userProfile/default.png'
import { computed, onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id


const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)


const userProfileModal = ref(false)
const writingModal = ref(false)
const editingModal = ref(false)
const borderColor = ref('#ccc')
const viewPostPageModal = ref(false)
const isLiked = ref(false)  // 좋아요 버튼의 상태를 저장
let postToEdit = ref("")

const isInvited = {}
const isSubscribed = ref({})
const userId = ref(userInfo.value.id) //접속한 유저의 아이디

let q = ref('')
const users = ref([])
const usersView = ref([]) //게시판의 추천 목록에o 뿌려줄 리스트

const state = reactive({
  items: [],
})

const selected = ref([])

// 자식 컴포넌트에서 발생한 이벤트를 처리하는 함수
const handleSelected = async value => {
  selected.value = value
  console.log("selected.value:", selected.value)

  try {
    const response = await axios.post('/bbs/List.do', {
      selectedItems: selected.value,
    })

    if (response.status === 200) {
      console.log('데이터 전송 성공')
      state.items = response.data // 데이터 저장
    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
}



const likesuser = ref([])
const likespro = ref([])
const userProfile = ref({})
const isUserWriterSame = ref({})


//검색기능
const searchItems = computed(() => {
  if (q.value) {
    return state.items.filter(item => item.content.includes(q.value))
  }

  return state.items
})


// ---------------------------------------------------------------------------------------

const getData = async function () {
  try {
    const response = await axios.post('/bbs/List.do', {
      selectedItems: selected.value,
      id: userId.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // 응답 처리
    if (response.status === 200) {

      state.items = response.data // 데이터 저장

      const tempUserKeys = []
      for (var i = 0; i < state.items.length; i++) {
        tempUserKeys[i] = state.items[i].id
        if (state.items[i].isSubto === 1) {
          isSubscribed.value[tempUserKeys[i]] = ref(true)
        }
        else {
          isSubscribed.value[tempUserKeys[i]] = ref(false)
        }
        if (tempUserKeys[i] !== connetId) {
          isUserWriterSame.value[tempUserKeys[i]] = ref(false)
        }
        else {
          isUserWriterSame.value[tempUserKeys[i]] = ref(true)
        }

        //유저 프로필 저장
        userProfile.value[state.items[i].id] = state.items[i].profilepath
      }

      const tempUserKeysSet = new Set(tempUserKeys) //중복 아이디 제거
      const temp = [...tempUserKeysSet] //ids

      axios.get("/comm/subscribe", {
        params: {
          id: userId.value,
        }
      })
        .then(res => {
          users.value = res.data.subTo
        })
        .catch(err => console.error(err))

    } else {
      console.log('데이터 전송 실패')
    }
  } //try 
  catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  } //catch
}

// ---------------------------------------------------------------------------------------


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

  axios.get("/comm/friend/random", {
    params: {
      id: userId.value,
    }
  })
    .then(res => {
      for (const key of Object.keys(res.data)) {
        usersView.value.push({ id: key, profilePath: res.data[key] })
        isInvited[key] = ref(true)
      }
      isInvited[connetId] = ref(false)
      console.log("응답값:", usersView.value)
    })
    .catch(err => console.error(err))

  window.addEventListener('scroll', handleScroll)
})

// 이벤트 리스너 제거
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


// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------


const getUserAvatar = user => {
  console.log("인자로 받는 유저 정보:", user)
  console.log("searchItems:", searchItems)
  console.log('getUserAvatar:', user.profilePath)
  if (user.profilePath !== undefined) {
    console.log('getUserAvatar if문 안으로 들어옴')

    return user.profilePath
  }
  else {
    return defaultImg
  }
}

//////////////////////////////////////
/* 댓글 */
let group = ref([])
let Allgroupbbs = ref([])

const statecomm = ref({
  comment: [],
})

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
      console.log('제발11', groupedDataAll.value[bno])

      // console.log('제발', groupedDataAll.value._rawValue[bno])

      // 서버로부터 받은 데이터를 자식 컴포넌트에게 전달하기 위해 저장
      postToEdit.value = response.data
      console.log('설마?', postToEdit.value)

      const re = await axios.get('/bbs/likesPro.do', { params: { bno: bno } })
      if (re.data) {
        likespro.value = re.data.likesPro
        likesuser.value = re.data.likes
      }
      console.log("좋아요 누른사람~~~~~~~~~~~~~~~~", re.data.likes)
      console.log("좋아요 누른사람 이미지~~~~~~~~~~~~~~~~", re.data.likesPro)
    } else {
      console.log('글 번호 전송 실패')
    }
  } catch (error) {
    console.error(`글 번호 전송 실패: ${error}`)
  }
}

//댓글 목록 가져오기
let groupedDataAll = ref({})
let groupedData = ref({})

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

      postmodalData.value = {
        comments: groupedDataAll.value[postbbsno.value],
      }

      // Allgroupbbs.value = groupedDataAll._rawValue[17]
      statecomm.value.comment = toRaw(groupedData)
      group.value = toRaw(statecomm.value.comment)

    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
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


//////////////////////////////////////

const modalControll = ref(false)

//메이트 및 친구 요청 
const controllInviteFunc = (ans, id) => { //DB에 접근
  console.log('이벤트 발생')
  console.log(ans, id)
  isInvited[id] = ref(false)
  axios.post("/comm/request", JSON.stringify({
    userId: connetId,
    reqId: id,
    type: '1',
  }), { headers: { 'Content-Type': 'application/json' } })
    .then(() => {
      //sendCommReqMessage(connetId, id, 'fReq')
    })
    .catch(err => {
      console.log(err, '값을 받는 데 실패했습니다')
    })
}

const username = ref('')

const requestFriend = temp => { //친구 신청 모달창 안내용
  modalControll.value = !modalControll.value
  console.log(temp)
  username.value = temp
}

const isSnackbarVisible = ref(false)
const message = ref("")

//구독 관리
const subscribe = (name, check) => {
  console.log('구독관리체크:', name)
  console.log('클릭전:', isSubscribed.value[name])
  isSubscribed.value[name] = !isSubscribed.value[name]
  isSnackbarVisible.value = true
  if (check == 1) {
    message.value = "구독이 추가되었습니다"
    console.log("구독:", name)
    sendCommReqMessage(connetId, name, 's')
    axios.post("/comm/subscribe/subscribing", JSON.stringify({
      userId: connetId,
      subToId: name,
    }), { headers: { 'Content-Type': 'application/json' } })
      .then(() =>
        users.value.push({ subscribe_id: name, profilePath: getUserAvatar(name) }),
      )
      .catch(err => console.log(err))
  }
  else {
    message.value = "구독이 취소되었습니다"
    axios.delete("/comm/subscribe/delete", {
      data: {
        userId: connetId,
        subToId: name,
      },
    }, { headers: { "Content-Type": `application/json` } })
      .then(() => {
        for (var i = 0; i < users.value.length; i++) {
          if (users.value[i].subscribe_id === name) {
            users.value.splice(i, 1)
          }
        }
      })
      .catch(err => console.log(err))
  }
  console.log('클릭후:', isSubscribed.value[name])
  console.log('클릭후 subscribe:', isSubscribed.value)
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
        profiledata.value = response.data

        const friendsId = []

        for (const temp of profiledata.value.friendsList) {
          friendsId.push(temp.friend_id)
        }

        // 모달에 전달할 변수 값 설정
        modalData.value = {
          userid: profiledata.value.id,
          userprofilePath: profiledata.value.profilePath,
          userproIntroduction: profiledata.value.proIntroduction,
          userFriendsList: profiledata.value.friendsList,
          userFriendCheck: friendsId.includes(connetId),
          connectid: connetId,
          userFriendRequestCheck: profiledata.value.requestedFriendsList.includes(connetId),
          isSameUser: connetId === profiledata.value.id,
        }
      } else {
        console.log('데이터 가져오기 실패 ')
      }
    })
    .catch(error => {
      console.error(error)
    })
  userProfileModal.value = true
}

const postmodalData = ref({ comments: {} })
const postbbsno = ref(0)

const openViewPostMoadl = async val => {
  console.log('가져온 글번호', val)
  postbbsno.value = val
  viewPostPageModal.value = true

  postmodalData.value = {
    comments: groupedDataAll.value[postbbsno.value],
  }
  console.log(postmodalData.value)
}


///좋아요!!
const toggleLike = async bno => {
  isLiked.value = !isLiked.value  // 좋아요 버튼의 상태를 토글
  try {
    const response = await axios.post('/bbs/likes.do', {
      id: connetId,
      bno: bno,
      cno: "",
      isLiked: isLiked.value,
    })

    console.log("좋아요 수정간다.", response)
    if (response.status === 200) {


      await getData() // 좋아요 상태 변경 후 데이터를 다시 가져오기
    } else {
      console.log('좋아요 상태 변경 실패')
      isLiked.value = !isLiked.value  // 실패했을 경우 상태를 원래대로 되돌림
    }
  } catch (error) {
    console.error(`좋아요 상태 변경 실패: ${error}`)
    isLiked.value = !isLiked.value  // 실패했을 경우 상태를 원래대로 되돌림
  }
}

//프로필 누르면 게시물 가져오기
const getMyList = async id => {
  try {
    console.log("id", id)

    const response = await axios.get(`/bbs/ViewMy.do?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 응답 처리
    if (response.status === 200) {
      console.log('데이터 받기 성공')
      state.items = response.data // 데이터 저장
      console.log(state.items[1])
      getComment()
      state.items.forEach(item => {
        likesStatus[item.bno] = ref({ value: item.likes !== null })
      })
    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
}

const test = val => {
  console.log("클릭체크:", isSubscribed[val].value)
}
</script>


<template>
  <section>
    <VRow style="margin-top: -50px;">
      <VCol cols="12" md="8" sm="12">
        <VCard flat :max-width="auto" class="mt-12 mt-sm- pa-0">
          <VCardText>
            <VRow no-gutters style=" overflow: hidden;max-height: 90px;">
              <VCol v-for="user in users" :key="user.subscribe_id" cols="auto" class="ma-2">
                <VListItem>
                  <VListItemContent class="d-flex flex-column align-center text-center">
                    <VAvatar class="text-sm pointer-cursor" :image="userProfile[user.subscribe_id]"
                      @click="getMyList(user.subscribe_id)" />
                    <VListItemTitle class="text-sm pointer-cursor" @click="getMyList(user.subscribe_id)"
                      @mouseover="size">
                      {{ user.subscribe_id }}
                    </VListItemTitle>
                  </VListItemContent>
                </VListItem>
              </VCol>
            </VRow>

            <VCol>
              <!-- 카테고리 추가 -->
              <VRow>
                <VCol cols="12" md="5" sm="4" style="margin-top: -15px;">
                  <Category @update:selected="handleSelected" />
                </VCol>
                <VCol cols="12" md="5" sm="4" style="margin-top: -15px;">
                  <VTextField v-model="q" class="search px-1 flex-grow-1" placeholder="Search"
                    :style="{ border: `1px solid ${borderColor}`, borderRadius: '5px' }"
                    @focus="borderColor = '#28a745'" @blur="borderColor = '#ccc'" />
                </VCol>
                <VCol cols="12" md="2" sm="4">
                  <VBtn style=" margin-top: -15px;float: inline-end;" size="x-large" @click="writingModal = true">
                    글 등록
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol>
              <VCol>
                <!-- 게시물 작성 공간 -->
                <VCol v-if="state.items.length > 0">
                  <!-- 게시물이 있을 때의 템플릿 -->
                  <VCol v-for="(item, index) in searchItems" :key="index" cols="12">
                    <VCard>
                      <!-- 게시물의 상단 유저 프로필/ 유저 닉네임 / MoreBtn :image="state.avatar1" -->
                      <VCol>
                        <VRow>
                          <!-- 프로필 사진 -->
                          <VCol cols="1">
                            <VAvatar class="text-sm pointer-cursor" :image="item.profilepath"
                              @click="openUserProfileModal(item)" />
                          </VCol>
                          <!-- 유저 닉네임 -->
                          <VCol>
                            <VCol cols="12">
                              <VCardSubtitle class="text-sm pointer-cursor" style="margin-left: -5%;"
                                @click="openUserProfileModal(item)">
                                {{ item.id }} <!-- 유저 닉네임 뿌려주기 -->
                              </VCardSubtitle>
                            </VCol>
                          </VCol>
                          <VCol cols="7">
                            <VCol>
                              <div v-show="!isUserWriterSame[item.id]">
                                <VBtn v-show="!isSubscribed[item.id]" id="myButton" prepend-icon="mdi-bell"
                                  style="float: inline-end;" size="small" variant="outlined"
                                  @click="subscribe(item.id, 1)">
                                  구독
                                </VBtn>
                                <VBtn v-show="isSubscribed[item.id]" id="myButton" prepend-icon="mdi-bell-off"
                                  style="float: inline-end;" size="small" variant="tonal"
                                  @click="subscribe(item.id, 0)">
                                  구독취소
                                </VBtn>
                              </div>
                            </VCol>
                          </VCol>
                          <VCol cols="1">
                            <VCol cols="1">
                              <VBtn icon variant="text" size="small" color="medium-emphasis">
                                <VIcon v-if="item.id == connetId" size="24" icon="mdi-dots-vertical" />

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
                      <!-- 사진 부분 -->
                      <VCol v-if="item.files && item.files.length == 1" class="transparent-carousel"
                        show-arrows-on-hover>
                        <VCol v-for="(image, i) in item.files" :key="i" :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor"
                            @click="openViewPostMoadl(item.bno); submitEdit(item.bno)" />
                        </VCol>
                      </VCol>
                      <VCarousel v-if="item.files && item.files.length >= 2" class="transparent-carousel"
                        show-arrows-on-hover color="success">
                        <!--
                          cycle
                          interval="2000"
                        -->
                        <VCarouselItem v-for="(image, i) in item.files" :key="i"
                          :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor" open-view-post-moadl
                            @click="openViewPostMoadl(item.bno); submitEdit(item.bno)" />
                          <!-- @click="viewPostPageModal=true;submitEdit(item.bno)" -->
                        </VCarouselItem>
                      </VCarousel>
                      <!-- 사진 끝 -->
                      <VCardItem>
                        <VCardTitle class="pointer-cursor" @click="openViewPostMoadl(item.bno); submitEdit(item.bno)">
                          {{ item.content }}
                        </VCardTitle>
                      </VCardItem>

                      <VCardText class="pointer-cursor" @click="openViewPostMoadl(item.bno); submitEdit(item.bno)">
                        댓글 {{ }} 모두 보기
                      </VCardText>
                      <!-- {{ Object.keys(groupedDataAll._rawValue[item.bno]).length }} 활용할 수 있을 것 같은데.. -->
                      <VCardText>
                        <VRow>
                          <VCol cols="10">
                            <VTextField v-model="item.commentinput" label="댓글달기" style="height: 20px; border: none;"
                              variant="underlined" prepend-icon="mdi-emoticon" />
                          </VCol>
                          <VCol cols="1">
                            <VBtn size="large"
                              @click="insertComment(item.bno, item.commentinput, 1, 0); item.commentinput = ''">
                              게시
                            </VBtn>
                          </VCol>
                        </VRow>
                      </VCardText>
                      <VCol>
                        <VBtn :icon="item.likes.includes(connetId) ? 'mdi-heart' : 'mdi-heart-outline'" variant="text"
                          color="success" @click="toggleLike(item.bno)" />
                        <VBtn icon="mdi-chat-outline" variant="text" color="success"
                          @click="openViewPostMoadl(item.bno); submitEdit(item.bno)" />
                        <VCol>
                          좋아요 {{ item.likesnum[0] }}개
                        </VCol>
                        <VCol v-if="group[item.bno]">
                          <strong>{{ group[item.bno].C_NO }}번 {{ group[item.bno].ID }}</strong> {{
                            group[item.bno].CCOMMENT }}
                        </VCol>
                      </VCol>
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
                등록된 게시물이 없습니다
              </VCardTitle>
              <VCardText>새로운 게시물을 작성해보세요!</VCardText>
            </VCol>
          </VCol>
        </VCard>
      </VCol>
      <VCol cols="4">
        <VCol class="card-list mt-12 mt-sm- pa-0">
          <!-- 친구 리스트 공간 -->
          <VListItem v-for="member in usersView" :key="member.id">
            <template #prepend>
              <VAvatar class="text-sm pointer-cursor" :image="member.profilePath"
                @click="openUserProfileModal(member)" />
            </template>

            <VListItemTitle class="text-sm pointer-cursor" @click="openUserProfileModal(member)" @mouseover="size">
              {{ member.id }}
            </VListItemTitle>
            <!-- 친구 추가 버튼 -->
            <template #append>
              <VBtn v-show="isInvited[member.id].value" id="myButton" width="40" variant="tonal" size="small"
                @click="requestFriend(member.id)">
                친구요청
              </VBtn>
              <InviteFriendConfirmModal v-model:isDialogVisible="modalControll" :message="username"
                @check-confirm="controllInviteFunc" />
              <VBtn v-show="!isInvited[member.id].value" size="small" width="40" disabled="true">
                신청완료
              </VBtn>
              <VSnackbar v-model="isSnackbarVisible" :timeout="800">
                {{ message }}
              </VSnackbar>
            </template>
          </VListItem>
        </VCol>
      </VCol>
    </VRow>
    <!-- <UserProfileCommunity v-model:isDialogVisible="userProfileModal"/> -->
    <UserProfileCommunity v-model:isDialogVisible="userProfileModal" :userid="modalData.userid"
      :userprofile-path="modalData.userprofilePath" :userpro-introduction="modalData.userproIntroduction"
      :user-friends-list="modalData.userFriendsList" :user-friend-check="modalData.userFriendCheck"
      :connectid="modalData.connectid" :user-friend-request-check="modalData.userFriendRequestCheck"
      :is-same-user="modalData.isSameUser" />
    <!-- userFriendRequestCheck -->
    <!-- :profilePath="modalData.profilePath" -->
    <Writing v-model:isDialogVisible="writingModal" @update-success="getData" />
    <Editing v-model:isDialogVisible="editingModal" :post-to-edit="postToEdit" @update-success="getData" />
    <ViewPostPage v-model:isDialogVisible="viewPostPageModal" :post-to-edit="postToEdit"
      :comments="postmodalData.comments" :bno="postToEdit.bno" :open-user-profile-modal="openUserProfileModal"
      :insert-comment="insertComment" :searchuser="searchuser" :get-comment="getComment" :likespro="likespro"
      :likesuser="likesuser" />
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

.search {
  .v-field__outline {
    display: none;
  }
}

.active-slide {
  color: success;
}

.transparent-carousel .v-carousel__controls {
  background-color: transparent;
}
</style>
