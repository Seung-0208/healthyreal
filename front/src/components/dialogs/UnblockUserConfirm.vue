<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  permissionName: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'update:permissionName',
  'deleteComplainRow',
])

const permissionName = ref('')

const onReset = () => {
  emit('update:isDialogVisible', false)
  permissionName.value = ''
}

watch(props, () => {
  permissionName.value = props.permissionName
})

const controllUnBlockUser = () => {
  emit('deleteComplainRow', permissionName.value)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 800"
    :model-value="props.isDialogVisible"
    persistent
    @update:model-value="onReset"
  >
    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="onReset"
      />

      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5">
          Edit Blacklist
        </VCardTitle>
        <VCardItem style="margin-top: 20px;">
          <VAlert
            type="warning"
            variant="tonal"
          >
            <div class="mt-1">
              {{ props.permissionName }}  님을 블랙리스트에서 삭제하시겠습니까?<br>
              삭제할 경우 {{ props.permissionName }} 님의 활동이 활성화되며<br>
              {{ props.permissionName }} 이름으로 등록된 모든 신고 내역이 삭제됩니다
            </div>
          </VAlert>
        </VCardItem>
      </VCardItem>
      <VCol
        cols="12"
        class="d-flex flex-wrap justify-center gap-4"
      >
        <VBtn @click="controllUnBlockUser">
          YES
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          @click="$emit('update:isDialogVisible', false)"
        >
          NO
        </VBtn>
      </VCol>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;
    padding-inline: 0;
  }
}
</style>
