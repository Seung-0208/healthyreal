<template>
  <VRow class="my-1">
    <VCol
      cols="8"
      style="margin-top: -10px;"
    >
      <VTextField
        id="address"
        v-model="address"
        type="text"
        placeholder="목적지"
      />
    </VCol>
    <VCol
      cols="4"
      style="margin-top: -10px;"
    >
      <VBtn
        variant="tonal"
        v-model="userAddress"
        color="primary"
        class="my-custom-button"
        height="55px"
        width="200"
        @click="execDaumPostcode"
      >
        주소검색
      </VBtn>
    </VCol>
  </VRow>
</template>

<script setup>
import { defineEmits, onMounted, reactive, ref } from 'vue'

const emit = defineEmits(['updateAddress', 'useraddress'])
const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')

const userAddress = reactive({
  postcode,
  address,
})

function updateAndEmitUserAddress() {
  userAddress.postcode = postcode.value
  userAddress.address = address.value
  emit('updateAddress', userAddress)
}
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      let addr = ''
      let extraAddr = ''
      if (data.userSelectedType === 'R') {
        addr = data.roadAddress
      } else {
        addr = data.jibunAddress
      }
      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName)
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')'
        }
        extraAddress.value = extraAddr
      } else {
        extraAddress.value = ''
      }
      postcode.value = data.zonecode
      address.value = addr
      detailAddress.value = ''

      // 추가적인 작업이 필요한 경우 여기에 작성
      // 상세주소 입력란에 포커스 설정
      document.getElementById("detailAddressInput")
      window.close()
      updateAndEmitUserAddress()
    },
  }).open({
    popupTitle: '주소 설정',
    popupKey: 'popup1', //팝업창 Key값 설정 (계속 팝업창이 뜨는 것을 방지하기 위함)
  })
}
onMounted(() => {
  const script = document.createElement('script')

  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  script.onload = () => {
    // 스크립트가 로드되면 Daum.Postcode API를 사용할 수 있습니다.
  }
  document.head.appendChild(script)
})
</script>
