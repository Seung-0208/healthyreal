<script setup>
import axios from '@axios'
import { defineProps, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  participantsData: {
    type: Object,
    required: true,
  },
  mateNo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'inviteUpdate'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)

}

const membersList = ref([])
const participantsData = ref([])

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)

console.log("나의 친구들은?", connetId.value)
console.log("초대된 방 번호는??", props.mateNo)

watch(() => props.participantsData, (newVal, oldVal) => {
  if (newVal) {
    participantsData.value = newVal
    console.log("참여자들은??", participantsData.value)
  }
}, { immediate: true })


const getData = async function () {
  const response = await axios.get('/comm/friend', {
    params: {
      id: connetId.value,
    },
  })

  console.log("나의 친구들은?", response)
  console.log("참여자들은??", participantsData.value)

  const participantIds = participantsData.value.map(participant => participant.ID)

  membersList.value = response.data
    .filter(friend => !participantIds.includes(friend.friend_id))
    .map(friend => ({
      avatar: friend.profilePath,
      name: friend.name,
      id: friend.friend_id,
      isInvited: false,
    }))

  console.log("membersList:", membersList)
}

onMounted(async () => { await getData() })

const isInvitedUpdate = async (e, id) => {
  console.log("초대된 사람은???", id)

  const response = await axios.post('/mroom/joinRoom.do', { id: id, challNo: props.mateNo })

  const clickedBtn = e.target
  const createdDiv = document.createElement('div') //초대 완료한 사람을 뿌려줄 div태그

  createdDiv.textContent = '초대완료'
  if (clickedBtn.tagName == 'SPAN') {
    clickedBtn.parentNode.parentNode.append(createdDiv)
    clickedBtn.parentNode.style.display = "none"
  }
  else {
    clickedBtn.parentNode.append(createdDiv)
    clickedBtn.style.display = "none"
  }
  emit('inviteUpdate')
}
</script>

<template>
  <VDialog :model-value="props.isDialogVisible" max-width="900" @update:model-value="dialogVisibleUpdate">
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="small" @click="emit('update:isDialogVisible', false)" />

      <VCardText>
        <h5 class="text-h5 text-center mb-3">
          친구 초대하기
        </h5>
        <br>
        <VAutocomplete :items="membersList" item-title="id" item-value="id" placeholder="초대할 친구를 검색하세요"
          density="compact">
          <template #item="{ props: listItemProp, item }">
            <VListItem v-bind="listItemProp">
              <template #prepend>
                <VAvatar :image="item.raw.avatar" size="30" />
              </template>
            </VListItem>
          </template>
        </VAutocomplete>

        <h6 class="text-h6 mb-4 mt-8">
          {{ membersList.length }}명
        </h6>

        <VList class="card-list">
          <VListItem v-for="member in membersList" :key="member.id">
            <template #prepend>
              <VAvatar :image="member.avatar" />
            </template>

            <VListItemTitle class="text-sm">
              {{ member.id }}
            </VListItemTitle>

            <VListItemSubtitle>
              {{ member.name }}
            </VListItemSubtitle>
            <!-- 초대 버튼 -->
            <template #append>
              <VBtn id="myButton" @click="isInvitedUpdate($event, member.id)">
                초대하기
              </VBtn>
            </template>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
