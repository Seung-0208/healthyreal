<script setup>
import axios from '@axios'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value ? userInfo.value.id : null)

const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

let noticlists = ref([])

const getNoticList = async id => {
  if (!id) {
    console.log('id is null')

    return
  }

  await axios.get('/Notic/View.do', { params: { id: id } })
    .then(response => {
      console.log('가져오기 성공')
      console.log('내 알림', response.data)
      noticlists.value = response.data
    }).catch(error => {
      // 업데이트 중 오류가 발생했을 때의 처리
      console.log('실패')
    })
}


// 특정 시간마다 실행할 함수
const executePeriodically = () => {
  getNoticList(connetId.value)
}

// 초기 실행
onMounted(() => {

  if (connetId.value) {
    getNoticList(connetId.value)
    getData()
    getComment()

    // 1시간마다 실행
    setInterval(() => {
      executePeriodically()
    }, 3600000) // 1분은 60000밀리초입니다.
  }
})

/////////////////////////////////////////////////////////
import Editing from '@/components/dialogs/Editing.vue'
import ViewPostPage from '@/components/dialogs/ViewPostPage.vue'
import Writing from '@/components/dialogs/Writing.vue'

const writingModal = ref(false)
const editingModal = ref(false)
const userProfileModal = ref(false)
const viewPostPageModal = ref(false)
let postToEdit = ref("")
const connetAv = userInfo.value.pro_filepath

const state = reactive({
  items: [],
})

const getData = async function () {
  try {
    const response = await axios.post('/bbs/List.do', {
      selectedItems: selected.value,
      id: connetId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })


    // 응답 처리
    if (response.status === 200) {
      state.items = response.data // 데이터 저장
      console.log('데이터 받기 성공', state.items)
    }
  } //try 
  catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  } //catch
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

/////////////////////////////////////////////////////////
</script>

<template>
  <Notifications :noticlists="noticlists" :noticflag="false" :get-notic-list="getNoticList"
    :open-view-post-moadl="openViewPostMoadl" :submit-edit="submitEdit" @click="getNoticList(connetId)" />
  <UserProfileCommunity v-model:isDialogVisible="userProfileModal" :userid="modalData.userid"
    :userprofile-path="modalData.userprofilePath" :userpro-introduction="modalData.userproIntroduction" />
  <Writing v-model:isDialogVisible="writingModal" @update-success="getData" />
  <Editing v-model:isDialogVisible="editingModal" :post-to-edit="postToEdit" @update-success="getData" />
  <ViewPostPage v-model:isDialogVisible="viewPostPageModal" :post-to-edit="postToEdit"
    :comments="postmodalData.comments" :bno="postToEdit.bno" :open-user-profile-modal="openUserProfileModal"
    :insert-comment="insertComment" :searchuser="searchuser" :get-comment="getComment" />
</template>
