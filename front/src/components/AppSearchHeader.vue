<script setup>
import axiosflask from '@/plugins/axiosflask'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import AppSearchHeaderBgDark from '@images/pages/app-search-header-bg-dark.png'
import AppSearchHeaderBgLight from '@images/pages/app-search-header-bg-light.png'
import { defineEmits, defineProps, onMounted, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: false,
  },
  customClass: {
    type: String,
    required: false,
  },
  connetId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['crawlingComplete'])

defineOptions({ inheritAttrs: false })

const themeBackgroundImg = useGenerateImageVariant(AppSearchHeaderBgLight, AppSearchHeaderBgDark)
const searchKeyword = ref('')
const kincrawlingresult = ref([])
const loading = ref(false)

const kincrawling = () => {
  showSuggestions.value = false
  loading.value = true //로딩 시작
  axiosflask.get('/kinCrawling', {
    params: {
      search: searchKeyword.value,
      id: props.connetId,
    }
  })
    .then(response => {
      kincrawlingresult.value = response.data

      // emit('crawlingComplete', kincrawlingresult.value)

      emit('crawlingComplete', { kinCrawling: kincrawlingresult.value, searchKeyword: searchKeyword.value })
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      loading.value = false //로딩 상태 종료
    })
}

const exerciseDictionary = ['하체 운동', '상체 운동', '데드리프트', '체스트암', '스쿼트', '레그 익스텐션', '인클라인 덤벨 로우', '랫풀 다운', '시티드 로우', '리버스 플라이', '벤치프레스', '딥스', '런지', '런닝', '달리기', '유산소', '푸쉬업', '윗몸 일으키기', '줄넘기']

const showSuggestions = ref(false)
const suggestions = ref([])
let selectedSuggestion = ref(-1)

const handleInput = () => {
  const inputText = searchKeyword.value.toLowerCase()
  if (inputText === '') {
    showSuggestions.value = false
    suggestions.value = []
  } else {
    showSuggestions.value = true
    suggestions.value = exerciseDictionary.filter(exercise =>
      exercise.toLowerCase().includes(inputText),
    )
  }
}

const selectSuggestion = suggestion => {
  searchKeyword.value = suggestion
  showSuggestions.value = false
}

const moveDown = () => {
  if (selectedSuggestion.value < suggestions.value.length - 1) {
    selectedSuggestion.value++
  }
}

const moveUp = () => {
  if (selectedSuggestion.value > 0) {
    selectedSuggestion.value--
  }
}

const searchInput = ref(null)

const focusInput = () => {
  const input = searchInput.value
  if (input) {
    input.focus()
  }
}

onMounted(() => {
  focusInput()
})


window.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    moveDown()
  } else if (event.key === 'ArrowUp') {
    moveUp()
  } else if (event.key === 'Enter') {
    // Enter 키가 눌렸을 때 선택된 제안을 검색어로 설정하고 검색 실행
    if (selectedSuggestion.value !== -1) {
      searchKeyword.value = suggestions.value[selectedSuggestion.value]
      kincrawling() // Enter 키 눌렀을 때 크롤링 실행
      event.preventDefault() // 기본 이벤트 방지
    }
  }
})
</script>

<template>
  <VCard flat class="text-center search-header" :class="props.customClass"
    :style="`background: url(${themeBackgroundImg});`">
    <VCardText style=" height: 150px;align-items: center;">
      <h5 class="text-h5 text-primary mb-6">
        {{ props.title }}
      </h5>
      <VTextField ref="searchInput" v-model="searchKeyword" placeholder="Search"
        class="search-header-input mx-auto my-3" @input="handleInput" @keyup.enter="kincrawling">
        <template #prepend-inner>
          <VIcon icon="mdi-magnify" size="24" />
        </template>
        <Transition name="fade">
          <ul v-if="showSuggestions" class="autocomplete-suggestions" style=" margin-top: 11%;">
            <li v-for="(suggestion, index) in suggestions" :key="suggestion"
              :class="{ 'selected': index === selectedSuggestion }"
              style="background-color: rgb(255, 255, 255); color: rgb(3, 141, 37);"
              @click="selectSuggestion(suggestion)">
              <strong>{{ suggestion }}</strong>
            </li>
          </ul>
        </Transition>
      </VTextField>
      <!-- 로딩 표시 -->
      <div v-if="loading" class="loading-indicator" style="font-weight: bold;">
        Loading...
      </div>
      <VProgressLinear v-if="loading" indeterminate color="primary" />



      <p v-if="!loading" style="font-weight: bold;">
        {{ props.subtitle }}
      </p>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.search-header {
  padding: 4rem !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

.search-header-input {
  border-radius: 0.375rem;
  background-color: rgb(var(--v-theme-surface));
  max-inline-size: 28.125rem;

  .v-field__prepend-inner {
    i {
      inset-block-start: 3px !important;
    }
  }
}

.autocomplete-suggestions {
  position: absolute;
  z-index: 1000;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  inline-size: calc(100% - 2rem);
  list-style-type: none;
  margin-block-start: 5px;
  max-block-size: 300px;
  opacity: 1;
  overflow-y: auto;
  padding-inline-start: 0;

  li {
    cursor: pointer;
    padding-block: 5px;
    padding-inline: 10px;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .selected {
    background-color: #f0f0f0;
  }
}

.loading-indicator {
  margin-block-start: 1rem;
}

@font-face {
  font-family: seolleimcool-SemiBold;
  font-style: normal;
  font-weight: normal;
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/seolleimcool-SemiBold.woff2") format("woff2");
}

.ql-font-seolleimcool-SemiBold {
  font-family: seolleimcool-SemiBold;
}

.fade-enter,
.fade-enter-active {
  opacity: 0;
  transition: opacity 1.5s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active,
.fade-leave {
  opacity: 1;
  transition: opacity 0.5s;
}

.fade-leave-to {
  opacity: 0;
}

@media (max-width: 37.5rem) {
  .search-header {
    padding: 1.5rem !important;
  }
}
</style>
