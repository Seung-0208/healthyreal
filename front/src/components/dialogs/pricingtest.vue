<script setup>
import axios from '@axios'
import { Bootpay } from '@bootpay/client-js'
import { defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  pay: {
    // pay props의 타입을 지정합니다. 필요에 따라 수정할 수 있습니다.
    type: Number,

    // 기본값을 설정할 수 있습니다. 필요에 따라 수정할 수 있습니다.
    default: null,
  }, challroomno: {
    type: Number,
    default: null,
  },
})

const BOOTPAY_API_KEY = import.meta.env.VITE_APP_BOOTPAY_API_KEY

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const payHandler = async () => {    //await과 함께 사용하는 함수
  let response // response 변수 선언
  try {
    response = await Bootpay.requestPayment({
      "application_id": `${BOOTPAY_API_KEY}`,
      "price": props.pay,
      "order_name": "HealthyReal 챌린지 " + props.challroomno,
      "order_id": "TEST_ORDER_ID",

      // "pg": "카카오페이",
      // "method": "간편",
      "tax_free": 0,
      "user": {
        "id": connetId,

        // "username": "김길동",
        // "phone": "01000000000",
        // "email": "test@test.com",
      },
      "items": [
        {
          "id": "item_id",
          "name": "챌린지 참여비",
          "qty": 1,
          "price": props.pay,
        },
      ],
      "extra": {
        "open_type": "iframe",
        "card_quota": "0,2,3",
        "escrow": false,
      },

      // }).error(function (data) { 
      //     // 결제가 실패했을 때 호출되는 함수입니다.
      //     var msg = "결제 에러입니다.: " + JSON.stringify(data);
      //     alert(msg);
      //     console.log(data);
      // }).cancel(function (data) {
      //     // 결제창에서 결제 진행을 하다가 취소버튼을 눌렀을때 호출되는 함수입니다.
      //     var msg = "결제 취소입니다.: " + JSON.stringify(data);
      //     alert(msg);
      //     console.log(data);
      // }).confirm(function (data) {
      //     // 결제가 진행되고 나서 승인 이전에 호출되는 함수입니다.
      //     // 일부 결제는 이 함수가 호출되지 않을 수 있습니다. ex) 가상계좌 및 카드 수기결제는 호출되지 않습니다.        
      //     // 만약 이 함수를 정의하지 않으면 바로 결제 승인이 일어납니다.
      //     if (confirm('결제를 정말 승인할까요?')) {
      //         console.log("do confirm data: " + JSON.stringify(data));
      //         // 이 함수를 반드시 실행해야 결제가 완전히 끝납니다.
      //         // 부트페이로 서버로 결제를 승인함을 보내는 함수입니다.
      //         this.transactionConfirm(data);
      //     } else {
      //         var msg = "결제가 승인거절되었습니다.: " + JSON.stringify(data);
      //         alert(msg);
      //         console.log(data);
      //     }
      // }).done(function (data) {
      //     // 결제가 모두 완료되었을 때 호출되는 함수입니다.
      //     alert("결제가 완료되었습니다.");
      //     console.log(data);
      // }).ready(function (data) {
      //     // 가상계좌 번호가 체번(발급) 되었을 때 호출되는 함수입니다.
      //     console.log(data);        
    })
    paycheck(response)
  } catch (error) {
    console.log(error.message) // 오류 처리
  }
}

function paycheck(response) {
  console.log(response)

  const status_locale = response.data.status_locale
  const pay_name = response.data.order_name
  const pay_price = response.data.price
  const pay_date = response.data.purchased_at
  const pay_method = response.data.pg

  // 결제 완료 후의 동작 추가
  if (status_locale === '결제완료') {
    // 결제가 성공적으로 완료된 경우
    alert('결제가 완료되었습니다.')
    payListInsert(connetId, 1, pay_name, pay_price, pay_method)
  } else {
    // 결제가 실패한 경우
    alert('결제에 실패하였습니다.')
  }
}

const payListInsert = async (id, pay_type, pay_name, pay_price, pay_method) => {
  let formData = new FormData()
  formData.append('id', id)
  formData.append('pay_type', pay_type)
  formData.append('pay_name', pay_name)
  formData.append('pay_price', pay_price)
  formData.append('pay_method', pay_method)

  await axios.post('/Payment/Write.do', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => {
    // 성공적으로 업데이트되었을 때의 처리
    console.log('성공')
    console.log(response.data)
  }).catch(error => {
    // 업데이트 중 오류가 발생했을 때의 처리
    console.log('실패')
  })
}
</script>



<template>
  <!-- onClick속성에 함수넣기 -->
  <VBtn text="결제" @click="payHandler" />
</template>
