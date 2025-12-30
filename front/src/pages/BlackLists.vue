<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import UnblockUserConfirm from '@/components/dialogs/UnblockUserConfirm.vue'
import axios from '@axios'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const headers = [
  {
    title: '신고당한 아이디',
    key: 'cl_id',
    sortable: false,
  },
  {
    title: '신고한 아이디',
    key: 'id',
    sortable: false,
  },
  {
    title: '신고 사유',
    key: 'cl_reason',
    sortable: false,
  },
  {
    title: '신고 날짜',
    key: 'cl_date',
    sortable: false,
  },
  {
    title: '등록 해제',
    key: 'actions',
    sortable: false,
  },
]

const permissions = ref([]) //테이블의 행 정보
const search = ref('')
const rowPerPage = ref(10)
const totalPermissions = ref(0) //테이블의 행 개수

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')

const fetchPermissions = () => {
  axios.get("/manage/member")
    .then(resp => {
      console.log("DB에서 불러온 값", resp.data)
      permissions.value = resp.data
      totalPermissions.value = resp.data.length
    })
    .catch(error => {
      console.log(error)
    })
  console.log(totalPermissions.value)
}

onMounted(fetchPermissions)

watchEffect(fetchPermissions)

const clickedUser = ref('')

const editPermission = name => {
  console.log("name:", name)
  isPermissionDialogVisible.value = true
  console.log("name", name.columns.cl_id)
  permissionName.value = name.columns.cl_id
}

const deleteComplainRow = name => {
  console.log(name, "으로 삭제 요청 들어옴")
  axios.delete("/manage/complained/delete", {
    data: {
      id: name,
    }
  }, { headers: { "Content-Type": `application/json` } })
    .then(() => {
      console.log("정상 삭제됨")
      fetchPermissions()
    })
    .catch(err => console.error(err))
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center flex-wrap gap-4 justify-space-between">
          <VTextField v-model="search" placeholder="Search" style="min-width: 12rem;max-width: 15rem;"
            density="compact" />
        </VCardText>

        <VDataTableServer v-model:items-per-page="rowPerPage" v-model:page="options.page"
          :items-length="totalPermissions" :headers="headers" :items="permissions" class="text-no-wrap"
          @update:options="options = $event">
          <!-- Actions -->
          <template #item.actions="{ item }">
            <VBtn icon size="small" color="medium-emphasis" variant="text" @click="editPermission(item)">
              <VIcon size="24" icon="mdi-delete" />
            </VBtn>
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
              <span class="d-flex align-center text-sm me-2 text-high-emphasis">{{ paginationMeta(options,
                totalPermissions) }}</span>
              <div class="d-flex gap-x-2 align-center me-2">
                <VBtn icon="mdi-chevron-left" class="flip-in-rtl" variant="text" density="comfortable" color="default"
                  :disabled="options.page <= 1" @click="options.page <= 1 ? options.page = 1 : options.page--" />
                <VBtn class="flip-in-rtl" icon="mdi-chevron-right" density="comfortable" variant="text" color="default"
                  :disabled="options.page >= Math.ceil(totalPermissions / options.itemsPerPage)"
                  @click="options.page >= Math.ceil(totalPermissions / options.itemsPerPage) ? options.page = Math.ceil(totalPermissions / options.itemsPerPage) : options.page++" />
              </div>
            </div>
          </template>
        </VDataTableServer>
      </VCard>

      <UnblockUserConfirm v-model:isDialogVisible="isPermissionDialogVisible" v-model:permission-name="permissionName"
        @delete-complain-row="deleteComplainRow" />
      <UnblockUserConfirm v-model:isDialogVisible="isAddPermissionDialogVisible" />
    </VCol>
  </VRow>
</template>
