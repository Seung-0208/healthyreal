<script setup>
import heart from '@/assets/images/icons/heart_icon.png'
import axios from '@axios'
import { useStore } from 'vuex'


const props = defineProps({
  selectedCheckbox: {
    type: Array,
    required: true,
  },
  checkboxContent: {
    type: Array,
    required: true,
  },
  gridColumn: {
    type: null,
    required: false,
  },
})

const emit = defineEmits(['update:selectedCheckbox'])

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

const selectedOption = ref(structuredClone(toRaw(props.selectedCheckbox)))

watch(selectedOption, () => {
  emit('update:selectedCheckbox', selectedOption.value)
})

const hateFoodchk = ref([])
const gethatefoodList = ref([])

const checkval = item => {
  console.log('값:', item.value, '이름:', item.name)
  console.log('밀어넣은 옵션?:', selectedOption._rawValue)

  const existingIndex = hateFoodchk.value.findIndex(element => element.hasOwnProperty(item.value) && element[item.value] === item.name)
  if (existingIndex === -1) {
    hateFoodchk.value.push({ [item.value]: item.name })
  } else {
    hateFoodchk.value = hateFoodchk.value.filter((element, index) => index !== existingIndex)
  }
  hateFoodchk.value.sort((a, b) => {
    const valueA = Object.keys(a)[0]
    const valueB = Object.keys(b)[0]

    return valueA - valueB
  })
  console.log('현재', hateFoodchk.value)
  sendHateFoodList(hateFoodchk)
}

const sendHateFoodList = val => {
  emit('HateFoodList', val)
}

const getuserHateFood = async () => {
  await axios.get('/GetMember/HateFood', { params: { id: connetId.value } })
    .then(response => {
      console.log(response.data)
      if (response.data !== null) {
        gethatefoodList.value = response.data.map(item => ({
          value: item.hatefood_no,
          name: item.hatefood_name,
        }))
        console.log('여기까지 들어왔음', gethatefoodList._rawValue)
        for (let i = 0; i < gethatefoodList._rawValue.length; i++) {
          const selectedHateFood = gethatefoodList._rawValue[i]


          // 기존에 체크한 알러지 정보를 selectedOption에 추가
          // selectedOption.value.push(selectedHateFood.value);
          selectedOption.value.push(String(selectedHateFood.value)) //selfTest에서 checkboxContent2의 value를 String으로 해놓아서 앞에 String으로 감싼 값으로 밀어넣음
          console.log('밀어넣은 옵션?:', selectedOption._rawValue)

          // 추출한 값으로 원하는 작업 수행
          console.log(selectedHateFood)
          checkval(selectedHateFood)
        }
      }
    }).catch(error => {
      console.log('실패', error)
    })
}

onMounted(getuserHateFood)
</script>

<template>
  <VRow v-if="props.checkboxContent && selectedOption" v-model="selectedOption">
    <VCol v-for="item in props.checkboxContent" :key="item.value" v-bind="gridColumn">
      <VLabel class="custom-input custom-checkbox rounded cursor-pointer w-100"
        :class="selectedOption.includes(item.value) ? 'active' : ''">
        <div>
          <VCheckbox v-model="selectedOption" :value="item.value" @click="checkval(item)" />
        </div>
        <img :src="item.bgImage" alt="bg-img" class="custom-checkbox-image">
        <img :src="heart" alt="heart-icon" class="heart-icon"> <!-- 하트 아이콘 이미지 -->
      </VLabel>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.custom-checkbox {
  position: relative;
  padding: 0;
  border-width: 2px;
  transition: all 0.5s;

  .custom-checkbox-image {
    block-size: 100%;
    inline-size: 100%;
    min-inline-size: 100%;
  }

  .v-checkbox {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    visibility: hidden;
  }

  .heart-icon {
    position: absolute;
    z-index: 1;
    /* 이미지의 층위를 조정 */
    inset-block-start: 50%;
    inset-inline-start: 50%;
    opacity: 0;
    /* 초기에 투명하게 설정 */
    transform: translate(-50%, -50%);
    transition: opacity 0.5s ease-in-out;
    /* 효과를 주기 위한 애니메이션 설정 */
  }

  &.active .heart-icon {
    opacity: 1;
    /* 액티브 상태에서 나타나도록 설정 */
  }
}
</style>
