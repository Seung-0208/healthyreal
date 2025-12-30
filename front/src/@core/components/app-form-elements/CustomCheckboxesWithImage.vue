<script setup>
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

const allergyFoodchk = ref([])
const getallergyList = ref([])

const checkval = item => {
  console.log('값:', item.value, '이름:', item.name)
  console.log('밀어넣은 옵션?:', selectedOption._rawValue)

  const existingIndex = allergyFoodchk.value.findIndex(element => element.hasOwnProperty(item.value) && element[item.value] === item.name)
  if (existingIndex === -1) {
    allergyFoodchk.value.push({ [item.value]: item.name })
  } else {
    allergyFoodchk.value = allergyFoodchk.value.filter((element, index) => index !== existingIndex)
  }
  allergyFoodchk.value.sort((a, b) => {
    const valueA = Object.keys(a)[0]
    const valueB = Object.keys(b)[0]

    return valueA - valueB
  })
  console.log('현재', allergyFoodchk.value)
  sendAllergyList(allergyFoodchk)
}


const sendAllergyList = val => {
  emit('AllergyList', val)
}

const getuserAllergy = async () => {
  await axios.get('/GetMember/Allergy', { params: { id: connetId.value } })
    .then(response => {
      console.log(response.data)
      if (response.data !== null) {
        getallergyList.value = response.data.map(item => ({
          value: item.allergy_no,
          name: item.allergy_name,
        }))
        console.log('여기까지 들어왔음', getallergyList._rawValue)
        for (let i = 0; i < getallergyList._rawValue.length; i++) {
          const selectedAllergy = getallergyList._rawValue[i]


          // 기존에 체크한 알러지 정보를 selectedOption에 추가
          selectedOption.value.push(selectedAllergy.value)
          console.log('밀어넣은 옵션?:', selectedOption._rawValue)

          // 추출한 값으로 원하는 작업 수행
          console.log(selectedAllergy)
          checkval(selectedAllergy)
        }
      }
    }).catch(error => {
      console.log('실패', error)
    })
}

onMounted(getuserAllergy)
</script>

<template>
  <VRow v-if="props.checkboxContent && selectedOption" v-model="selectedOption">
    <VCol v-for="item in props.checkboxContent" :key="item.value" v-bind="gridColumn">
      <VLabel class="custom-input custom-checkbox rounded cursor-pointer w-100"
        :class="selectedOption.includes(item.value) ? 'active' : ''">
        <div>
          <VCheckbox v-model="selectedOption" :value="item.value" @click="checkval(item)" />
          <!-- @click="checkval(item)" -->
        </div>
        <img :src="item.bgImage" alt="bg-img" class="custom-checkbox-image">
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

  &:hover,
  &.active {
    .v-checkbox {
      visibility: visible;
    }
  }
}
</style>
