<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import BlockUsersConfirm from '@/components/dialogs/BlockUsersConfirm.vue'
import axios from "axios"
import { onMounted, ref, watch } from 'vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { useStore } from 'vuex'

const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = ref(userInfo.value.id)


const searchQuery = ref('')
const totalUsers = ref(0)
const users = ref([])
const totalPage = ref(1)
const selectedUser = ref([])
const selectedPlan = ref()

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,

})

const checkedRows = ref([])

// items 배열이 변경될 때마다 watch하여 체크된 행을 초기화
watch(() => users, () => {
  checkedRows.value = []
})

// 체크박스가 토글될 때마다 처리하는 함수
const handleCheckboxToggle = (rowIndex, isChecked) => {
  console.log("rowIndex:", rowIndex)
  if (typeof isChecked == 'boolean' && !checkedRows.value.includes(rowIndex.value.ID)) {
    checkedRows.value.push(rowIndex.value.ID)
  }
  else if (typeof isChecked == 'string') {
    checkedRows.value = checkedRows.value.filter(ele => ele !== rowIndex.value.ID)
  }
}

//유저 데이터 가져오기
const userData = async () => {
  const response = await axios.get('/user/findAllUser')
  if (response.status === 200) {
    users.value = response.data.map(user => {
      const date = new Date(user.REGIDATE)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      return {
        PROFILEIMAGE: user.PROFILEIMAGE,
        NAME: user.NAME,
        ID: user.ID,
        B_DAY: user.B_DAY,
        GOAL_NAME: user.GOAL_NAME,
        REGIDATE: formattedDate,
        GENDER: user.GENDER === 'M' ? '남자' : '여자',
        checked: false, // 각 행의 체크박스 상태를 관리하는 속성 추가
      }
    })
    totalUsers.value = users.value.length

  } else {
    console.log('유저들의 데이타 가져오기 실패')
  }

}

onMounted(async () => {
  await userData()
})

const headers = [
  {
    title: '유저',
    key: 'user',
  },
  {
    title: '가입목적',
    key: 'GOAL_NAME',
  },
  {
    title: '성별',
    key: 'GENDER',
  },

  {
    title: '생일',
    key: 'B_DAY',
  },

  {
    title: '가입일',
    key: 'REGIDATE',
  },
]

const isModalShow = ref(false)

const blockUsers = () => {
  if (checkedRows.value.length === 0) {
    alert('선택된 값이 없습니다')
  }
  else {
    isModalShow.value = true
  }
}

const controllConfirm = () => {
  axios.post('/manage/complained/create', JSON.stringify({
    id: connetId.value,
    cl_id: checkedRows.value,
    cl_reason: '관리자 문의',
  }), { headers: { "Content-Type": `application/json` } })
    .then(() => {
      console.log('등록 성공')
      userData()
    })
    .catch(err => console.error(err))
}
</script>

<template>
  <section>
    <VCard cols="8">
      <VCardText class="d-flex flex-wrap gap-4 " style="display: flex; justify-content: space-between;">
        <div class="app-user-search-filter   ">
          <!-- 👉 Search  -->
          <VTextField v-model="searchQuery" placeholder="찾을 유저" density="compact" style="width: 12rem;" />
        </div>
        <VBtn @click="blockUsers">
          신고
        </VBtn>
        <BlockUsersConfirm v-model:isDialogVisible="isModalShow" :selected-users="checkedRows"
          @request-complete="controllConfirm" />
      </VCardText>

      <!-- SECTION datatable -->
      <VDataTableServer v-model:items-per-page="options.itemsPerPage" v-model:page="options.page" :items="users"
        :items-length="totalUsers" :headers="headers" class="text-no-wrap rounded-0 "
        @update:options="options = $event">
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex ">
            <VAvatar size="34" :variant="!item.raw.PROFILEIMAGE ? 'tonal' : undefined" class="me-3">
              <VImg v-if="item.raw.PROFILEIMAGE" :src="item.raw.PROFILEIMAGE" />
            </VAvatar>

            <div class="d-flex flex-column">
              <h6 class="text-sm font-weight-medium">
                {{ selectedUser.value }}
                {{ item.raw.ID }}
              </h6>

              <span class="text-xs text-medium-emphasis">{{ item.raw.NAME }}</span>
            </div>
          </div>
        </template>


        <template #item.GOAL_NAME="{ item }">
          <div class="d-flex gap-2">
            <span class="text-capitalize">{{ item.raw.GOAL_NAME }}</span>
          </div>
        </template>

        <template #item.GENDER="{ item }">
          <span class="text-sm">{{ item.raw.GENDER }}</span>
        </template>


        <template #item.B_DAY="{ item }">
          <span class="text-sm">{{ item.raw.B_DAY }}</span>
        </template>

        <template #item.REGIDATE="{ item }">
          <VRow>
            <VCol class="text-sm">
              {{ item.raw.REGIDATE }}
            </VCol>
            <span>
              <VCheckbox v-model="item.raw.checked" :value="item.raw.ID"
                @click="handleCheckboxToggle(item, item.raw.checked)" />
            </span>
          </VRow>
        </template>



        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end gap-x-6 pa-2 flex-wrap">
            <div class="d-flex align-center gap-x-2 text-sm">
              Rows Per Page:
              <VSelect v-model="options.itemsPerPage" class="per-page-select text-high-emphasis" variant="plain"
                density="compact" :items="[10, 20, 25, 50, 100]" />
            </div>

            <span class="d-flex align-center text-sm me-2 text-high-emphasis">{{ paginationMeta(options, totalUsers)
              }}</span>

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn icon="mdi-chevron-left" class="flip-in-rtl" variant="text" density="comfortable" color="default"
                :disabled="options.page <= 1" @click="options.page <= 1 ? options.page = 1 : options.page--" />

              <VBtn class="flip-in-rtl" icon="mdi-chevron-right" density="comfortable" variant="text" color="default"
                :disabled="options.page >= Math.ceil(totalUsers / options.itemsPerPage)"
                @click="options.page >= Math.ceil(totalUsers / options.itemsPerPage) ? options.page = Math.ceil(totalUsers / options.itemsPerPage) : options.page++" />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 24.0625rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.scrollbar {
  overflow-x: scroll;
}

/* 스크롤바의 폭 너비 */
.scrollbar::-webkit-scrollbar {
  inline-size: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* 스크롤바 둥근 테두리 */
  background: rgb(247, 177, 177);
  /* 스크롤바 색상 */
}

.scrollbar::-webkit-scrollbar-track {
  background: rgba(220, 20, 60, 10%);
  /* 스크롤바 뒷 배경 색상 */
}
</style>
