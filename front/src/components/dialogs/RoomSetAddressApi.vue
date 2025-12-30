<script setup>
import { ref } from 'vue'


const emit = defineEmits(['updateAddress', 'useraddress'])
const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')

const userAddress = computed(() => ({
  postcode: postcode.value,
  address: address.value,
  detailAddress: detailAddress.value,
  extraAddress: extraAddress.value,
}))

function updateAndEmitUserAddress() {
  userAddress.address = address.value
  emit('updateAddress', userAddress)
}


function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      let addr = ''
      let extraAddr = ''

      //사용자가 지번을 클릭해도 도로명을 클릭해도 무조건 지번값으로 넣기
      if (data.userSelectedType === 'R') {
        addr = data.jibunAddress
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


      //인덱싱을 통해 지번 Data를 동/읍.. 등 3번째 주소까지 나오게 설정
      const addressArray = addr.split(' ')
      let addrindextwo = ''
      addrindextwo = addressArray.slice(0, 3).join(' ')
      address.value = addrindextwo  
      detailAddress.value = ''

      // 추가적인 작업이 필요한 경우 여기에 작성

      // 팝업창 닫기
      document.getElementById("detailAddressInput")
      window.close()
      updateAndEmitUserAddress()



    },
  }).open({
    popupTitle: '장소 설정',
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

<template>
  <VBtn
    style="width: 100%;"
    @click="execDaumPostcode"
  >
    장소 설정
  </VBtn>
  <VTextField
    id="address"
    v-model="address"
    type="text"
    placeholder="주소"
    style="margin-top: 10px;"
  />             
</template>
