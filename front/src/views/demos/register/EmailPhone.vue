<VCardText>
  <VRow>
    <!-- 👉 Email -->
    <VCol
      cols="12"
      md="2"
    >
      <div class="label-wrapper">
        <label for="email">[필수]<br>이메일 인증</label>
      </div>
    </VCol>


    <VCol
      cols="12"
      md="4"
    >
      <VTextField

        id="emailid"
        v-model="emailid"
        type="emailid"
        placeholder="이메일"
        persistent-placeholder
      />
    </VCol>
    <h5 style="margin: 15px 5px 0; font-size: 30px;">
      @
    </h5>
    <VCol
      cols="12"
      md="4"
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
      md="2"
    >
      <label for="phonenumber">[선택]<br>휴대전화 인증</label>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VTextField

        id="phoneNumber"
        v-model="phoneNumber"
        type="phoneNumber"
        placeholder="휴대전화 번호"
        persistent-placeholder
      />
    </VCol>
    <h5 style="margin: 15px 20px 0; font-size: 20px;" />
    <VCol
      cols="12"
      md="4"
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
