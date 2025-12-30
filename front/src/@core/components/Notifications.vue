<script setup>
import axios from '@axios'
import { useRouter } from 'vue-router'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useStore } from 'vuex'

const props = defineProps({
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
  noticlists: {
    type: Array,
    required: true,
  },
  noticflag: {
    type: Boolean,
    required: true,
  },
  getNoticList: {
    type: Function,
    required: true,
  },
  openViewPostMoadl: {
    type: Function,
    required: true,
  },
  submitEdit: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'read',
  'unread',
  'remove',
  'click:notification',
])

const router = useRouter()

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

function getTimeDiffString(triggerDate) {
  const triggerDateObj = new Date(triggerDate)
  const currentDate = new Date()
  const timeDiff = currentDate - triggerDateObj
  const minutes = Math.floor(timeDiff / (1000 * 60))

  if (minutes < 60) {
    return `${minutes}분 전`
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60)

    return `${hours}시간 전`
  } else {
    const days = Math.floor(minutes / (24 * 60))

    return `${days}일 전`
  }
}

const updatenotic = async (notification, trigger_pk, index) => {
  if (notification.notic_type == 1) {
    console.log('알림이 발생된 게시물', notification.bbs_no)

    // router.push({ name: 'ViewPostPage', params: { bno: notification.bbs_no }  })
  } else if (notification.notic_type == 2) {
    console.log('알림이 발생된 게시물', notification.trigger_no)

    // router.push({ path: "/community_post", query: { bno: notification.trigger_no }  })
  }
  await axios.get('/Notic/Update.do', { params: { trigger_pk: trigger_pk } })
    .then(response => {
      console.log('성공')

      // checked_time 값을 업데이트하고 화면 갱신
      notification.checked_time = new Date()//사실상 DB에 들어간 값과 같은 값이다.
    })
    .catch(error => {
      console.log('실패', error)
    })
}

const removenotic = async trigger_pk => {
  console.log('지울 trigger_pk:', trigger_pk)
  await axios.get('/Notic/Delete.do', { params: { trigger_pk: trigger_pk } })
    .then(response => {
      console.log('응답 받음 - ', response.data)

      // 알림 목록에서 해당 알림을 제거합니다.
      props.noticlists.splice(
        props.noticlists.findIndex(notification => notification.trigger_pk === trigger_pk),
        1,
      )
    })
}

const addY = async (trigger_pk, trigger_no) => {
  console.log('수락을 클릭했습니다.', trigger_no)
  await axios.get('/Notic/AddAFMLYN', { params: { trigger_pk: trigger_pk, trigger_no: trigger_no, yn: 'Y' } })
    .then(response => {
      console.log('성공적으로 실행 - ', response.data)
      if (response.data == 1) {
        removenotic(trigger_pk)
      }
    })
}

const addN = async (trigger_pk, trigger_no) => {
  console.log('거절을 클릭했습니다.', trigger_no)
  await axios.get('/Notic/AddAFMLYN', { params: { trigger_pk: trigger_pk, trigger_no: trigger_no, yn: 'N' } })
    .then(response => {
      console.log('성공적으로 실행 - ', response.data)
      if (response.data == 1) {
        removenotic(trigger_pk)
      }
    })
}
</script>

<template>
  <IconBtn id="notification-btn">
    <VBadge v-show="noticflag" dot color="error" bordered offset-x="1" offset-y="1">
      <VIcon icon="mdi-bell-outline" />
    </VBadge>
    <VIcon v-show="!noticflag" icon="mdi-bell-outline" />
    <VMenu activator="parent" width="380px" :location="props.location" offset="14px" :close-on-content-click="false">
      <VCard class="d-flex flex-column">
        <!-- 👉 Header -->
        <VCardItem class="notification-section">
          <VCardTitle class="text-lg">
            '{{ name }}'님 알림 현황
          </VCardTitle>

          <template #append>
            <VIcon :icon="!isAllMarkRead ? 'mdi-email-outline' : 'mdi-email-open-outline'" />
          </template>
        </VCardItem>

        <VDivider />

        <!-- 👉 Notifications list -->
        <PerfectScrollbar :options="{ wheelPropagation: false }" style="max-block-size: 23.75rem;">
          <VList class="py-0">
            <template v-for="(notification, index) in noticlists" :key="index">
              <VDivider v-if="index > 0" />
              <VListItem link lines="one" min-height="66px" class="list-item-hover-class"
                @click="updatenotic(notification, notification.trigger_pk, index)">
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar size="40" :image="notification.pro_filepath" />
                  </VListItemAction>
                </template>

                <VListItemTitle>
                  <VChip color="error">
                    {{ notification.notic_trigger_user }}
                  </VChip>
                  <small
                    @click="notification.notic_type === 1 || notification.notic_type === 2 ? (openViewPostMoadl(notification.notic_type === 1 ? notification.bbs_no : notification.trigger_no), submitEdit(notification.notic_type === 1 ? notification.bbs_no : notification.trigger_no)) : ''">
                    {{ notification.notic_type === 1 ? '님께서 댓글을 달았습니다.'
                      : notification.notic_type === 2 ? '님께서 좋아요를 눌렀습니다.' :
                        notification.notic_type === 3 ? '님께서 친구요청을 하셨습니다.' : '님께서 메이트 요청을 하셨습니다.' }}
                  </small>
                  <!-- <small @click="openViewPostMoadl(notification.notic_type===1? notification.bbs_no : notification.trigger_no); submitEdit(notification.notic_type===1? notification.bbs_no : notification.trigger_no)">{{ notification.notic_type===1? '님께서 댓글을 달았습니다.': notification.notic_type===2? '님께서 좋아요를 눌렀습니다.' : notification.notic_type===3? '님께서 친구요청을 하셨습니다.' : '님께서 메이트 요청을 하셨습니다.' }}</small> -->
                </VListItemTitle>

                <!-- <VListItemSubtitle>{{ notification.ccomment }}</VListItemSubtitle> -->
                <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                  <div>
                    <span class="text-xs text-disabled">{{ getTimeDiffString(notification.notic_trigger_date) }}</span>
                  </div>
                  <div>
                    <small
                      v-if="(notification.notic_type === 3 || notification.notic_type === 4) && notification.ccomment == 'W'">
                      <VIcon icon="mdi-account-check-outline"
                        style=" margin-right: 2px; margin-bottom: 3px;color: green;"
                        @click="addY(notification.trigger_pk, notification.trigger_no)" />
                      /
                      <VIcon icon="mdi-account-cancel-outline"
                        style=" margin-right: 2px; margin-bottom: 3px;color: red;"
                        @click="addN(notification.trigger_pk, notification.trigger_no)" />
                    </small>
                  </div>
                </div>

                <!-- Slot: Append -->
                <template #append>
                  <div class="d-flex flex-column align-center gap-4">
                    <VBadge dot :color="notification.checked_time == null ? 'primary' : '#a8aaae'"
                      :class="`${notification.checked_time !== null ? 'visible-in-hover' : ''} ms-1`"
                      @click.stop="updatenotic(notification, notification.trigger_pk, index)" />

                    <div style="block-size: 28px; inline-size: 28px;">
                      <IconBtn size="x-small" class="visible-in-hover" @click="removenotic(notification.trigger_pk)">
                        <VIcon size="20" icon="mdi-close" />
                      </IconBtn>
                    </div>
                  </div>
                </template>
              </VListItem>
            </template>

            <VListItem v-show="!props.noticlists.length" class="text-center text-medium-emphasis"
              style="block-size: 56px;">
              <VListItemTitle>No Notification Found!</VListItemTitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <!-- 👉 Footer -->
        <VCardText v-show="props.noticlists.length" class="notification-footer" style="text-align: end;">
          <!-- <VBtn block> -->
          HealthyReal
          <!-- </VBtn> -->
        </VCardText>
      </VCard>
    </VMenu>
  </IconBtn>
</template>


<style lang="scss">
.notification-section {
  padding: 14px !important;
}

.notification-footer {
  padding-block: 0.9375rem !important;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}
</style>
