<script setup>
import axios from '@axios'
import { defineProps, onUpdated } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({ //test
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  participantsData: {
    type: Object,
    required: true,
  },
})

const participantsData = ref([])
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
let Manager = ref({}) // 초기 값을 {}로 설정


const deletepeople = async member => {
  console.log('강퇴할 유저:', member)

  const response = await axios.delete('/mroom/deletePeople.do', { data: { id: member } })

  // 강퇴 후 participantsData 업데이트
  participantsData.value = participantsData.value.filter(participant => participant.ID !== member)

}


onUpdated(() => {
  participantsData.value = props.participantsData

  const foundManager = props.participantsData.find(participant => participant.MRP_MANAGER === 'Y')
  if (foundManager) {
    Manager.value = foundManager
  }

})
</script>

<template>
  <VCol>
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <VCardText cols="3">
        <VCol class="text-h5 text-center mb-3" style="margin-bottom: 20px; font-weight: bold; opacity: 0.7;">
          참여자
        </VCol>
        <VCol class="card-list">
          <VCol v-for="participant in participantsData" :key="participant.ID">
            <VRow>
              <VAvatar :image="participant.PRO_FILEPATH" />
              <VCol style="font-weight: bold;">
                {{ participant.ID }}
              </VCol>
              <!-- 초대 버튼 -->
              <VBtn v-if="Manager.ID == connetId && Manager.ID != participant.ID" id="myButton" size="small"
                style="align-self: center;" @click="deletepeople(participant.ID)">
                강퇴하기
              </VBtn>
            </VRow>
          </VCol>
        </VCol>
      </VCardText>
    </VCard>
  </VCol>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
