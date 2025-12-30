<script setup>
import Btnsu from '@/pages/views/demos/components/button/self-suc.vue'
import Gender from '@/pages/views/demos/forms/form-elements/radio/Gender.vue'
import Edit from '@/pages/views/demos/forms/form-elements/textarea/Edit.vue'
import PW from '@/pages/views/demos/forms/form-elements/textfield/PasswordEdit.vue'
import router from '@/router'
import Sub from '@/views/demos/DemoSelectCustomTextAndValue.vue'
import axios from '@axios'
import { onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

import store from '@/store'



watchEffect(() => {
  if (store.state.userInfo) {
    fetchuserData()
  }
})

const editClick1 = ref(true) //이름
const edit1 = ref(false)
const editClick2 = ref(true) //비번
const edit2 = ref(false)
const editClick3 = ref(true) //키
const edit3 = ref(false)
const editClick4 = ref(true) //몸무게
const edit4 = ref(false)
const editClick5 = ref(true) //전화번호
const edit5 = ref(false)
const editClick6 = ref(true) //생년월일
const edit6 = ref(false)
const editClick7 = ref(true) //주소
const edit7 = ref(false)
const editClick8 = ref(true) //주소
const edit8 = ref(false)

const nameval = ref('')
const pwdval = ref('')
const heightval = ref('')
const weightval = ref('')
const telval = ref('')
const b_dayval = ref('')
const userAddressval = ref('')

// mh는 Member_History 테이블을 뜻하는 약자
const memberdata = ref([])


let searchuser = '' //접속중인 유저 아이디값 받아넣기



const fetchuserData = async () => {


  const store = useStore()
  if (!store.state.loginStore.userInfo) {
    console.log('사용자 정보가 없습니다.')
    alert(" 로그인 후 이용 가능합니다.")
    router.push("/main")


  }
  searchuser = store.state.loginStore.userInfo.id

  try {
    console.log('searchuser:', searchuser)

    const response = await axios.get('/user/View', {
      params: {
        id: searchuser,
      },
      withCredentials: true,
    })

    console.log('응답데이터 :', response.data)

    if (response.status === 200) {
      memberdata.value = response.data
      console.log(memberdata.value)
    } else {
      console.log('데이터 가져오기 실패')
    }
  } catch (error) {
    console.error('안녕')
  }
}

onMounted(fetchuserData)

const updateuserdata = async (colname, newcolval, id) => {
  const formData = new FormData()

  formData.append('colname', colname)
  formData.append('id', id)
  formData.append('newcolval', newcolval)

  try {
    const response = await axios.put('/user/Edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })

    if (response.status === 200) {
      console.log('성공')
      console.log("searchuser", searchuser)

      // 사용자 정보가 성공적으로 수정되었으므로, 다시 사용자 정보를 가져옵니다.
      const userInfoResponse = await axios.get('/user/View', {
        params: {
          id: searchuser,
        },
        withCredentials: true,
      })

      // 가져온 사용자 정보로 Vuex 스토어의 사용자 정보를 업데이트합니다.
      store.dispatch('updateUserInfo', userInfoResponse.data)
    } else {
      console.log('데이터 수정 실패')
    }

  } catch (error) {
    console.log('실패')
    console.error(error)
  }
}
</script>

<template>
  <VCard class="fill-height">
    <VCol>
      <VRow>
        <VCol cols="6">
          <!-- 첫 번째 카드 텍스트 - 이름 -->
          <VChip label>
            <strong>이름</strong>
            <IconBtn v-if="!edit1" style=" float: inline-end;">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick1 = false, edit1 = true" />
              <!-- editClick1이 false일때는 입력이 안됨 / editClick이 true일때 입력 가능 -->
            </IconBtn>

            <Btnsu v-if="edit1" style="width: 60px; margin-left: 10px;"
              @click="editClick1 = true, edit1 = false, updateuserdata('name', nameval, searchuser)" />
          </VChip>
          <Edit v-model="nameval" style="margin-top: 10px;" :readonly="editClick1" :placeholder="memberdata.name" />
        </VCol>
        <!-- 비밀번호 -->
        <VCol cols="6">
          <VChip label>
            <strong>비밀번호</strong>
            <IconBtn v-if="!edit2">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick2 = false, edit2 = true" />
            </IconBtn>

            <Btnsu v-if="edit2" style="width: 60px; margin-left: 10px;"
              @click="editClick2 = true, edit2 = false, updateuserdata('pwd', pwdval, searchuser)" />
          </VChip>

          <PW v-model="pwdval" style="margin-top: 0;" :readonly="editClick2" />
        </VCol>
      </VRow>
    </VCol>
    <!-- 이름 비밀번호 수정 끝 -->



    <!-- 키 / 몸무게  -->
    <VCol>
      <VRow>
        <VCol cols="6">
          <VChip label>
            <strong>키</strong>
            <IconBtn v-if="!edit3">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick3 = false, edit3 = true" />
            </IconBtn>

            <Btnsu v-if="edit3" style="width: 60px; margin-left: 10px;"
              @click="editClick3 = true, edit3 = false, updateuserdata('height', heightval, searchuser)" />
          </VChip>
          <Edit v-model="heightval" style="margin-top: 10px;" :readonly="editClick3"
            prepend-inner-icon=" mdi-human-male-height" :placeholder="memberdata.height" />
        </VCol>




        <VCol cols="6">
          <VChip label>
            <strong>몸무게</strong>
            <IconBtn v-if="!edit4">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick4 = false, edit4 = true" />
            </IconBtn>

            <Btnsu v-if="edit4" style="width: 60px; margin-left: 10px;"
              @click="editClick4 = true, edit4 = false, updateuserdata('weight', weightval, searchuser)" />
          </VChip>
          <Edit v-model="weightval" style="margin-top: 10px;" :readonly="editClick4"
            prepend-inner-icon="mdi-weight-kilogram" :placeholder="memberdata.weight" />
        </VCol>
      </VRow>
    </VCol>
    <!-- 키 / 몸무게 끝 -->

    <VCol>
      <VRow>
        <VCol cols="6">
          <VChip label>
            <strong>전화번호</strong>
            <IconBtn v-if="!edit5">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick5 = false, edit5 = true" />
            </IconBtn>
          </VChip>
          <Btnsu v-if="edit5" style="width: 60px; margin-left: 10px;"
            @click="editClick5 = true, edit5 = false, updateuserdata('tel', telval, searchuser)" />
          <Edit v-model="telval" style="margin-top: 10px;" :readonly="editClick5" prepend-inner-icon="mdi-phone"
            :placeholder="memberdata.tel" />
        </VCol>

        <VCol cols="6">
          <VChip label>
            <strong>생년월일</strong>
            <IconBtn v-if="!edit6">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick6 = false, edit6 = true" />
            </IconBtn>

            <Btnsu v-if="edit6" style="width: 60px; margin-left: 10px;"
              @click="editClick6 = true, edit6 = false, updateuserdata('b_day', b_dayval, searchuser)" />
          </VChip>
          <Edit v-model="b_dayval" style="margin-top: 10px;" :readonly="editClick6"
            prepend-inner-icon="mdi-cake-variant" :placeholder="memberdata.b_day" />
        </VCol>
      </VRow>
    </VCol>





    <VCol>
      <VRow>
        <VCol cols="9">
          <VChip label>
            <strong>사용 목적</strong>
          </VChip>
          <Sub :value="memberdata.goal_No" style="margin-top: 10px;" />
        </VCol>

        <!-- 성별 -->
        <VCol cols="3">
          <VCard cols="6" style="padding: 10px; margin: 10px;">
            <VChip label>
              <strong>성별</strong>
            </VChip>
            <Gender :value="memberdata.gender" />
          </VCard>
        </VCol>
      </VRow>
    </VCol>
    <!-- 성별 끝 -->
    <!-- 입력 부분 -->
    <VCol>
      <VRow>
        <VCol cols="12">
          <VChip label cols="6">
            <strong>주소</strong>
            <IconBtn v-if="!edit7">
              <VIcon size="22" icon="mdi-lead-pencil" @click="editClick7 = false, edit7 = true" />
            </IconBtn>
            <Btnsu v-if="edit7" style="width: 60px; margin-left: 10px;"
              @click="editClick7 = true, edit7 = false, updatedata('userAddress', userAddressval, searchuser)" />
          </VChip>
          <VTextField v-model="userAddressval" prepend-inner-icon="mdi-home" style="margin-top: 10px;"
            :readonly="editClick7" :placeholder="memberdata.userAddress" />
        </VCol>
      </VRow>
    </VCol>
    <!--
      <VCol cols="12">
      <VChip label>
      <strong v-if="!edit8">이메일 인증하기</strong>
      <strong v-if="edit8">이메일 완료</strong>
      <strong v-if="!edit8 && edit8">이메일 진행 중</strong>
      <IconBtn v-if="!edit8">
      <VIcon
      size="22"
      icon="mdi-email-alert-outline"
      @click="editClick8=false, edit8=true"
      />
      </IconBtn>
      <IconBtn v-if="edit8">
      <VIcon
      size="22"
      icon="mdi-email-check-outline"
      color="success"
      @click="editClick8=false, edit8=true"
      />
      </IconBtn>
      <IconBtn v-if="!edit8 && edit8">
      <VIcon
      size="22"
      icon="mdi-email-sync-outline"
      color="success"
      @click="editClick8=false, edit8=true"
      />
      </IconBtn>
      </VChip>
      <VTextField
      v-model="email"
      style="margin-top: 10px;"
      prepend-inner-icon="mdi-email-outline"
      type="email"
      :readonly="editClick8"
      placeholder="Email"
      />
      </VCol>
    -->
  </VCard>
</template>
