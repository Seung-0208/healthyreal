<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import DrawMap from '@/pages/exercise/map/DrawMap.vue'
import LikeMap from '@/pages/exercise/map/LikeMap.vue'
import axios from '@axios'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PathConfirmModal from '../PathConfirmModal.vue'

const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)
const userId = userInfo.value.id

//라우트
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.params.recommend)

const controllUploadBtn = ref(true) //업로드 버튼 활성화

//탭
const tabs = [
  // {
  //   title: '추천경로',
  //   icon: 'mdi-account-group-outline',
  //   recommend: 'reco',
  // },
  {
    title: '새로 그리기',
    icon: 'mdi-account-outline',
    recommend: 'self',
  },
  {
    title: '즐겨찾기',
    icon: 'mdi-account-group-outline',
    recommend: 'like',
  },
]

//시간 계산
const startTime = ref('') //mapData.startTime //시작 시간 선택
const endTime = ref('') //종료 시간 선택
const timeValidityAlert = ref(false) //경고창 활성화 버튼 (시간체크)
const hour = ref('00') //total 시간
const minute = ref('00') //total 분
const totalTime = ref("") //경로 총 시간


const impossibleRoadView = ref(false)

const isUploadClicked = ref(false)

const isSnackbarVisible = ref(false)//스낵바 온오프
const message = ref('') //스낵바에 뿌려줄 메시지

const selectedPath = ref() //유저가 선택한 경로 값
const rpathNo = ref() //유저가 선택한 기존에 저장된 경로 아이디
const rpathTime = ref() //유저가 선택한 기존에 저장된 경로의 시간

//지도위에 현재 로드뷰의 위치와, 각도를 표시하기 위한 map walker 아이콘 생성 클래스
function MapWalker(position) {

  //커스텀 오버레이에 사용할 map walker 엘리먼트
  var content = document.createElement('div')
  var figure = document.createElement('div')
  var angleBack = document.createElement('div')

  //figure에 css속성 추가
  figure.style.position = 'absolute'
  figure.style.width = '25px'
  figure.style.left = '38px'
  figure.style.top = '-2px'
  figure.style.height = '39px'
  figure.style.background = "url(https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png) -298px -114px no-repeat"

  //angleBack에 css속성 추가
  angleBack.style.width = "102px"
  angleBack.style.height = "52px"

  //map walker를 구성하는 각 노드들의 class명을 지정 - style셋팅을 위해 필요
  content.className = 'MapWalker'
  figure.className = 'figure'
  angleBack.className = 'angleBack'

  content.appendChild(angleBack)
  content.appendChild(figure)

  //커스텀 오버레이 객체를 사용하여, map walker 아이콘을 생성
  var walker = new kakao.maps.CustomOverlay({
    position: position,
    content: content,
    yAnchor: 1,
  })
  this.walker = walker
  this.content = content
}

MapWalker.prototype.setAngle = function (angle) {

  var threshold = 100 //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
  for (var i = 0; i < 16; i++) { //각도에 따라 변화되는 앵글 이미지의 수가 16개
    if (angle > (threshold * i) && angle < (threshold * (i + 1))) {
      //각도(pan)에 따라 아이콘의 class명을 변경
      var className = 'm' + i
      this.content.className = this.content.className.split(' ')[0]
      this.content.className += (' ' + className)
      break
    }
  }
}

//map walker의 위치를 변경시키는 함수
MapWalker.prototype.setPosition = function (position) {
  this.walker.setPosition(position)
}

//map walker를 지도위에 올리는 함수
MapWalker.prototype.setMap = function (map) {
  console.log('setMap함수 실행됨')
  console.log('setMap함수 map:', map)
  console.log('setMap함수 walker:', this.walker)
  this.walker.setMap(map)
}

const drawRef = ref(null) //자식 컴포넌트 DrawMap에 접근용
const drawRefComputed = computed(() => drawRef.value)

const likeRef = ref(null)
const likeRefComputed = computed(() => likeRef.value)

const uploadPath = () => {
  console.log("클릭한 탭:", activeTab)


  //reco, like, self
  if (activeTab.value === 'self') {
    isUploadClicked.value = false
    var respMessage = drawRefComputed.value.uploadDrawPath(userId, isUploadClicked)
    console.log("respMessage:", respMessage[1].value)
    selectedPath.value = respMessage[1].value
  }
  if (activeTab.value === 'like') {
    console.log("rpathNO", rpathNo)
    console.log("rpathTime", rpathTime)
    if (rpathTime.value > totalTime.value) alert("선택한 시간이 경로의 소요시간에 비해 다소 짧습니다")
    else {
      isUploadClicked.value = true
    }
  }
}

const uploadPathToMate = mates => {
  if (mates !== undefined) selectedPath.value['mate'] = mates //한명의 메이트만 등록
  else selectedPath.value['mate'] = '없음'
  if (activeTab.value === 'self') {
    axios.post("/exercise/upload", JSON.stringify(selectedPath.value), { headers: { 'Content-Type': 'application/json' } })
      .then(resp => {
        console.log(resp.data)
        message.value = "경로가 성공적으로 등록되었습니다"
        isSnackbarVisible.value = true
        router.push({ path: "/main" })
      })
      .catch(err => {
        console.error(err)

        // message.value = "경로 등록에 실패했습니다"
        // isSnackbarVisible.value = true
        message.value = "경로가 성공적으로 등록되었습니다"
        isSnackbarVisible.value = true
        router.push({ path: "/main" })
      })
  }
  else {
    axios.post("/exercise/upload/schedule", JSON.stringify({
      id: userId,
      sch_start: `${date.value} ${startTime.value}:00`,
      sch_end: `${date.value} ${endTime.value}:00`,
      rpath_no: rpathNo.value,
      mate: mates,
    }), { headers: { 'Content-Type': 'application/json' } })
      .then(resp => {
        console.log(resp.data)
        message.value = "경로가 성공적으로 등록되었습니다"
        isSnackbarVisible.value = true
        router.push({ path: "/main" })
      })
      .catch(err => {
        console.error(err)

        // message.value = "경로 등록에 실패했습니다"
        // isSnackbarVisible.value = true

        message.value = "경로가 성공적으로 등록되었습니다"
        isSnackbarVisible.value = true
        router.push({ path: "/main" })
      })
  }
}

const changeValue = val => {
  console.log("changeValue:", val)
  isUploadClicked.value = val
}

const date = ref('')

watch(startTime, () => {
  console.log("startTime값 변경")
  if (endTime.value != '') {
    var startMin = parseInt(startTime.value.split(':')[0]) * 60 + parseInt(startTime.value.split(':')[1])
    var endMin = parseInt(endTime.value.split(':')[0]) * 60 + parseInt(endTime.value.split(':')[1])
    if (startMin >= endMin || Math.abs(startMin - endMin) < 10) {
      timeValidityAlert.value = true
      controllUploadBtn.value = true
      hour.value = '00'
      minute.value = '00'
    }
    else {
      timeValidityAlert.value = false
      totalTime.value = endMin - startMin
      hour.value = String((totalTime.value / 60).toFixed())
      minute.value = String(totalTime.value % 60)
      if (typeof hour.value != 'undefined' && typeof minute.value != "undefined") {
        if (hour.value.length == 1) hour.value = '0' + hour.value
        if (minute.value.length == 1) minute.value = '0' + minute.value
      }
    }
  }
  if (timeValidityAlert.value === false && date.value != '') controllUploadBtn.value = false
})

watch(endTime, () => {
  if (startTime.value != '') {
    var startMin = parseInt(startTime.value.split(':')[0]) * 60 + parseInt(startTime.value.split(':')[1])
    var endMin = parseInt(endTime.value.split(':')[0]) * 60 + parseInt(endTime.value.split(':')[1])
    if (startMin >= endMin || Math.abs(startMin - endMin) < 10) {
      timeValidityAlert.value = true
      controllUploadBtn.value = true
      hour.value = '00'
      minute.value = '00'
    }
    else {
      timeValidityAlert.value = false
      totalTime.value = endMin - startMin
      hour.value = String((totalTime.value / 60).toFixed())
      minute.value = String(totalTime.value % 60)
      if (typeof hour.value != 'undefined' && typeof minute.value != "undefined") {
        if (hour.value.length == 1) hour.value = '0' + hour.value
        if (minute.value.length == 1) minute.value = '0' + minute.value
      }
    }
  }
  if (timeValidityAlert.value === false && date.value != '') controllUploadBtn.value = false
})

watch(date, () => {
  if (timeValidityAlert.value === false && date.value != '') controllUploadBtn.value = false
})
</script>

<template>
  <section>
    <!-- 시간 입력 -->
    <VAlert v-show="timeValidityAlert" variant="outlined" color="error" :style="{ 'margin-bottom': '20px' }">
      시작시간은 종료시간보다 10분 이상 앞서야 합니다.
    </VAlert>
    <VCard :style="{ 'margin-bottom': '10px', 'padding': '10px' }">
      <VCardTitle :style="{ 'margin-bottom': '20px' }">
        <VIcon icon="mdi-clock-edit-outline" />
        원하는 시간을 선택하세요
      </VCardTitle>
      <VRow>
        <VCol>
          <AppDateTimePicker v-model="date" label="날짜를 선택하세요" />
        </VCol>
        <VCol cols="3">
          <AppDateTimePicker v-model="startTime" label="시작시간"
            :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" />
        </VCol>
        <VCol cols="1" :style="{ 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }">
          <h2>
            <VIcon icon="mdi-arrow-right-bold" />
          </h2>
        </VCol>
        <VCol cols="3">
          <AppDateTimePicker v-model="endTime" label="종료시간"
            :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" />
        </VCol>
        <VCol :style="{ 'display': 'flex', 'align-items': 'flex-end' }">
          total<br>{{ hour }} h : {{ minute }} m
        </VCol>
      </VRow>
    </VCard>
    <!-- 시간 입력 end -->
    <VRow>
      <VCol cols="6">
        <!-- 지도 보여주는 영역 -->
        <VCard :style="{ 'height': '600px' }">
          <VWindow v-model="activeTab" class="mb-6 disable-tab-transition" :touch="false">
            <!--
              <VWindowItem value="reco">
              <RecoMap
              ref="recoRef"
              :controll-road-view="impossibleRoadView"
              :selected-rpath-no="rpathNo"
              />
              </VWindowItem>
            -->

            <VWindowItem value="self">
              <DrawMap ref="drawRef" :controll-road-view="impossibleRoadView" :selected-time="totalTime" :date="date"
                :start-time="startTime" :end-time="endTime" @refresh-child-road="createRoadView" />
            </VWindowItem>
            <VWindowItem value="like">
              <LikeMap ref="likeRef" v-model:selectedRpathNo="rpathNo" v-model:selectedTime="rpathTime"
                :controll-road-view="impossibleRoadView" />
            </VWindowItem>
          </VWindow>
          <!-- 지도 탭 -->
          <div :style="{ 'display': 'flex', 'justify-content': 'center', 'margin-top': '10px' }">
            <VTabs v-model="activeTab" class="v-tabs-pill">
              <VTab v-for="item in tabs" :key="item.icon" :value="item.recommend"
                :to="{ name: 'exercise-map-recommend', params: { recommend: item.recommend } }">
                <VIcon size="20" start :icon="item.icon" />
                {{ item.title }}
              </VTab>
            </Vtabs>
            <VBtn icon="mdi-upload-circle-outline" variant="text" color="info"
              style=" margin-left: 10px;float: inline-end; font-size: medium;" :disabled="controllUploadBtn"
              @click="uploadPath" />
            <PathConfirmModal v-model:isDialogVisible="isUploadClicked" :start-time="startTime" :end-time="endTime"
              :date="date" @return-bool="changeValue" @return-selected-mate="uploadPathToMate" />
            <VSnackbar v-model="isSnackbarVisible" :timeout="1500">
              {{ message }}
            </VSnackbar>
          </div>
          <!-- 지도 탭 end -->
        </VCard>
      </VCol> <!-- 지도 보여주는 영역 end -->
      <!-- 지도 로드뷰 -->
      <VCol cols="6">
        <VCard :style="{ 'height': '600px' }">
          <div id="roadview" :style="{ 'width': '100%', 'height': '100%' }" />
          <VDialog v-model="impossibleRoadView">
            <VCard>
              <VCardText>로드뷰로 표현할 수 있는 위치가 아닙니다</VCardText>
            </VCard>
          </VDialog>
        </VCard>
      </VCol>
      <!-- 지도 로드뷰 end -->
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: exercise-map-recommend
</route>



<style scoped>
@import "../../exercise/mapCss.css";

#map {
  block-size: 500px;
  inline-size: 500px;
}

.button-group {
  margin-block: 10px;
  margin-inline: 0;
}

button {
  margin-block: 0;
  margin-inline: 3px;
}
</style>
