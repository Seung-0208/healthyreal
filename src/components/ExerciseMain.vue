<script>
const replaceDot = value => {
  return value.replace(/\./g, '\n')
}
</script>

<script setup>
import axios from '@axios'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'


const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

const data = ref([])

const getData = async ()=>{

  const response = await axios.post('/exer/getData.do', { id: connetId })

  data.value = response.data
  console.log("운동 값 가져와??", response)

}

onMounted(getData)

const replaceDot = value => {
  return value.replace(/\./g, '. <br>')
}

console.log("운동 값 가져와??", data.value)

const isCardDetailsVisible = ref(false)
</script>

<template>
  <!-- 👉 Influencing The Influencer -->
  <VCol
    v-for="(item, index) in data"
    :key="index"
    cols="12"
    sm="12"
    md="12"
  >
    <VCard>
      <iframe
        width="100%"
        height="350"
        :src="item.evideoPath"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />

      <VCardItem>
        <VCardTitle>{{ item.ename }}</VCardTitle>
      </VCardItem>

      <VCardText
        style="height: auto;"
        v-html="replaceDot(item.econtent)"
      />
    </VCard>
  </VCol>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 5px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}
</style>
