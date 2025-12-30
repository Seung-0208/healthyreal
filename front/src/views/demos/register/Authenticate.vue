<script setup>
const isDialogVisible = ref(false)
const emailid = ref('')
const emailaddr = ref('')
const phoneNumber = ref('')
const tellecom = ref('')
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        color="primary"
        class="my-custom-button"
        height="55px"
        width="500"
      >
        인증요청
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="User Profile">
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="isDialogVisible = false"
      />

      <VCardText>
        <VRow>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="4"
          >
            <label for="email">Email</label>
          </VCol>


          <VCol
            cols="12"
            md="2"
          >
            <VTextField
            
              id="emailid"
              v-model="emailid"
              type="emailid"
              placeholder="이메일"
              persistent-placeholder
            />
          </VCol>
          <h5 style="margin: 15px 5px 0; font-size: 20px;">
            @
          </h5>
          <VCol
            cols="12"
            md="2"
          >
            <template v-if="emailaddr === '직접입력'">
              <!-- 직접입력이 선택되었을 때 텍스트 상자를 표시 -->
              <VTextField
                v-model="customEmail"
                label="직접입력"
                placeholder="직접입력"
              />
            </template>
            <VSelect
              v-show="emailaddr !== '직접입력'"
              id="emailaddr"
              v-model="emailaddr"
              label="emailaddr"
              placeholder="E-mail"
              :items="['naver.com', 'daum.net', 'nate.com', 'gmail.com','직접입력']" 
            />
          </VCol>

          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="4"
          >
            <label for="email">Email</label>
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <VTextField
            
              id="phoneNumber"
              v-model="phoneNumber"
              type="phoneNumber"
              placeholder="휴대전화 번호"
              persistent-placeholder
            />
          </VCol>
          <h5 style="margin: 15px 5px 0; font-size: 20px;" />
          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              id="tellecom"
              v-model="tellecom"
              label="tellecom"
              placeholder="통신사"
              :items="['SKT', 'LG U+', 'KT', 'SKT 알뜰폰','LG U+ 알뜰폰','KT 알뜰폰']"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="error"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn
          color="success"
          @click="isDialogVisible = false"
        >
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
