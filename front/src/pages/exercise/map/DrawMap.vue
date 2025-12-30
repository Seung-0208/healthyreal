<template>
  <!-- 지도 검색창 -->
  <div
    v-show="switchOnOff"
    id="menu-wrap"
    class="bg_white"
    :style="{'height':'80%', 'margin-top':'64px'}"
  >
    <div class="option">
      <div>
        <form
          v-show="!isMyPlace"
          @submit="searchPosition"
        >
          키워드 : <input
            id="keyword"
            type="text"
            value=""
            size="15"
            placeholder="검색어를 입력하세요"
          > 
          <button type="submit">
            검색
          </button> 
        </form>
      </div>
      <hr>
      <div v-show="!isMyPlace">
        <ul
          id="placesList"
          @click="searchListClickController"
        />
        <div id="pagination" />
      </div>
    </div>
    <hr>
    <div v-show="!isMyPlace">
      <ul
        id="placesList"
        @click="searchListClickController"
      />
      <div id="pagination" />
    </div>
  </div>
  <!-- 지도 검색창end -->
  <div>
    <!-- 지도 검색창 화면 활성화 스위치(직접설정 클릭시 show) -->
    <VBtn
      icon="mdi-refresh"
      variant="text"
      color="info"
      style=" margin: 5px;float: inline-end;"
      @click="reset"
    />
    <VBtn
      variant="text"
      color="info"
      style="margin: 5px;"
      @click="addMarker"
    >
      <VIcon icon="mdi-plus" />
      마커 추가하기
    </VBtn>
    <VSwitch
      v-model="isSwitchOn"
      label="검색창 보기"
      :value="Info"
      :color="'Info'.toLowerCase()"
      :style="{'float':'right', 'margin':'5px','margin-right':'20px'}"
      @update:model-value="switchController"
    />
  </div>
  
  <div
    id="drawingMap"
    :style="{'width':'100%','height':'450px'}"
    @click="$emit('refreshChildRoad', lat[0], lng[0], drawingMap)"
  />
</template>

<script>
import * as mapSearch from '@/pages/exercise/mapSearch'
import { isSearchListClicked } from '@/pages/exercise/mapSearch'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { createRoadView } from '../createRoadView'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => ref(userInfo.value.id))
const message = ref("경로 등록에 실패했습니다")

console.log("처음 connetId", connetId)
var lat = []
var lng = []
const totalDistance = ref() //그려진 polyline의 거리
const totalDots = ref([]) //그려진 polyline의 경로
const totalDotsName = ref([]) //각 지점의 info name
const totalDotsMainaddr = ref([]) //각 지점의 시/군/구
const inputTime = ref() //사용자로부터 받은 분 단위의 시간
const walkTime = ref() //걸은 시간
const requestBody = ref()


export default {
  name: "DrawMap",
  props: {
    selectedTime: {
      type: String,
    },
    date: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
  setup(props) {
    console.log('DrawMap에서 찍어본 selectedTime값:', props.selectedTime)
  },
  data() {
    return {
      isSearchListClicked: isSearchListClicked,
      drawingMap: ref(null),
      lat: lat,
      lng: lng,
      isSearchShow: ref(false), //검색창 화면 조정
      isMyPlace: ref(false), //직접 설정에서 내가 자주 찾는 장소 보기 클릭했는지 확인 (직접설정)
      switchOnOff: ref(false), //검색창 활성화 버튼 (직접설정)
      searchSwitch: ref(false), //위치 검색창 활성화 스위치 (직접설정)
      switchOnOff: ref(false), //검색창 활성화 버튼 (직접설정)
      isSwitchOn: ref(false),
    }
  },
  created() {
    watch(
      ()=>this.selectedTime, ()=>{
        inputTime.value = this.selectedTime
      },
    )
  },
  mounted() {
    console.log('DrawMap:', this.drawingMap)
    if (window.kakao && window.kakao.maps && this.drawingMap != null) { //카카오 api가 로드되었을 때

      this.initMap()

      //this.drawingMap.relayout()
    }else {

      const script = document.createElement("script")

      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src =
                    "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ca9eb44c2889273e11b9860d99308508&libraries=services,clusterer,drawing"
      document.head.appendChild(script)
    }

    //this.drawingMap.relayout();
  }, //mounted
  methods: {
    uploadDrawPath(userId, isUploadClicked){

      if(totalDistance.value == undefined) {alert("등록할 경로가 없습니다")}
      else{
        walkTime.value = totalDistance.value / 67 | 0 //분 기준
        if(this.selectedTime < walkTime.value) {
          alert("선택한 시간이 경로의 소요시간에 비해 다소 짧습니다")
        }
        else if(this.date == ""){
          alert("날짜를 선택해주세요")
        }
        else{
          for(var i=0; i<totalDotsName.value.length; i++) {
            totalDotsName.value[i] = totalDotsName.value[i].value
            totalDotsMainaddr.value[i] = totalDotsMainaddr.value[i].value
          }
          console.log("connectId 체크", connetId)

          requestBody.value = {
            id: userId,
            time: walkTime.value,
            roadPoint: totalDots.value,
            roadPointName: totalDotsName.value,
            roadPointAddrName: totalDotsMainaddr.value,
            schStart: `${this.date} ${this.startTime}:00`,
            schEnd: `${this.date} ${this.endTime}:00`,
          }

          isUploadClicked.value=true
        }
      }
      
      return [message, requestBody]
    },
    addMarker(){
      mapSearch.addTempMarker(this.drawingMap)
    },
    reset(){
      mapSearch.removeAllMarker()
    },
    displayMarker(ps){
      mapSearch.searchPlaces(ps, this.drawingMap)
    },
    switchController(){
      this.switchOnOff = ! this.switchOnOff
    },
    showSearchUi() {
      this.switchOnOff = !this.switchOnOff
      var mapEl = document.getElementById('menu-wrap') //지도 태그 가져오기
      if(this.switchOnOff) { //스위치가 켜져 있으면 검색창 띄우기
        this.isSearchShow = true
      }
      else { //스위치가 꺼져 있으면 검색창 숨기기
        this.isSearchShow = false
      }
    },
    searchListClickController(e){
      e.stopPropagation()
      console.log('ul태그 클릭 이벤트', this.isSearchListClicked)
      this.isSearchListClicked = false
    },
    searchPosition(e){
      e.preventDefault()
      console.log('부모 컴포넌트에서 값을 보냄')
      var ps = new kakao.maps.services.Places() 
      this.displayMarker(ps)

      // 장소 검색 객체를 생성합니다
      // mapSearch.searchPlaces(ps, this.map)
    },
    initMap() { //지도 초기화 함수
      const drawingContainer = document.getElementById("drawingMap")

      drawingContainer.innerHTML = ''
      var lat = ref(33.450701)
      var lng = ref(126.570667) //디폴트 값
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(positions=>{
          //현재 위치 얻기
          lat.value = positions.coords.latitude
          lng.value = positions.coords.longitude

          const tempoptions = {
            center: new kakao.maps.LatLng(lat.value, lng.value),
            level: 2,
          }


          //지도 객체를 등록합니다.
          //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
          this.drawingMap = new kakao.maps.Map(drawingContainer, tempoptions)
          this.drawingMap.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)

          createRoadView(this.drawingMap)
          this.drawingLine(this.drawingMap)
        })
      }//if

    }, //initMap
    displayMarker(ps){
      mapSearch.searchPlaces(ps, this.drawingMap)
    },
    drawingLine(map) {
      var drawingFlag = false 
      var moveLine 
      var clickLine 
      var distanceOverlay 
      var dots = {} 
      map.relayout()

      kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        map.relayout()
                    

        var clickPosition = mouseEvent.latLng
        console.log('클릭이벤트 발생 위치', clickPosition.La) //La, Ma
        console.log("결괏값:", mapSearch.getNameFromlatlng(clickPosition))

        lat[0] = clickPosition.Ma
        lng[0] = clickPosition.La

        console.log('클릭이벤트 발생 위치', lat[0])

        if (!drawingFlag) {

          drawingFlag = true
                        
          deleteClickLine()
                        
          deleteDistnce()

          deleteCircleDot()
                    
          clickLine = new kakao.maps.Polyline({
            map: map, 
            path: [clickPosition],
            strokeWeight: 4, 
            strokeColor: '#005D32', 
            strokeOpacity: 1, 
            strokeStyle: 'solid', 
          })
                        
          
          moveLine = new kakao.maps.Polyline({
            strokeWeight: 4, 
            strokeColor: '#005D32', 
            strokeOpacity: 0.5, 
            strokeStyle: 'dot', 
          })
                    
          displayCircleDot(clickPosition, 0)

                            
        } else { 
          var path = clickLine.getPath()

          path.push(clickPosition)
                        
          clickLine.setPath(path)

          var distance = Math.round(clickLine.getLength())
          displayCircleDot(clickPosition, distance)
        }
      })
                    
      kakao.maps.event.addListener(map, 'mousemove', function (mouseEvent) {

        if (drawingFlag){
                        
          var mousePosition = mouseEvent.latLng 

          // 마우스 클릭으로 그려진 선의 좌표 배열을 얻어옵니다
          var path = clickLine.getPath()
                        
          // 마우스 클릭으로 그려진 마지막 좌표와 마우스 커서 위치의 좌표로 선을 표시합니다
          var movepath = [path[path.length-1], mousePosition]
          moveLine.setPath(movepath)    
          moveLine.setMap(map)
                        
          var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
            content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>' // 커스텀오버레이에 추가될 내용입니다
          totalDistance.value = distance

          // 거리정보를 지도에 표시합니다
          showDistance(content, mousePosition)   
        }             
      })                 

      // 지도에 마우스 오른쪽 클릭 이벤트를 등록합니다
      // 선을 그리고있는 상태에서 마우스 오른쪽 클릭 이벤트가 발생하면 선 그리기를 종료합니다
      kakao.maps.event.addListener(map, 'rightclick', function (mouseEvent) {

        // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
        if (drawingFlag) {
                        
          // 마우스무브로 그려진 선은 지도에서 제거합니다
          moveLine.setMap(null)
          moveLine = null  
                        
          // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
          var path = clickLine.getPath()
                    
          // 선을 구성하는 좌표의 개수가 2개 이상이면
          if (path.length > 1) {

            // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
            if (dots[dots.length-1].distance) {
              dots[dots.length-1].distance.setMap(null)
              dots[dots.length-1].distance = null    
            }
            console.log('dots:', dots)
            for(const dot of dots) {
              totalDots.value.push(dot.position)
              totalDotsName.value.push(mapSearch.getNameFromlatlng(dot.position)[0])
              totalDotsMainaddr.value.push(mapSearch.getNameFromlatlng(dot.position)[1])
            }
            console.log('totalDOts:', totalDots.value)
            console.log(walkTime)
            var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
              content = getTimeHTML(distance) // 커스텀오버레이에 추가될 내용입니다
                                
            // 그려진 선의 거리정보를 지도에 표시합니다
            showDistance(content, path[path.length-1])  
            
          } else {

            // 선을 구성하는 좌표의 개수가 1개 이하이면 
            // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
            deleteClickLine()
            deleteCircleDot() 
            deleteDistnce()

          }
                        
          // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
          drawingFlag = false          
        }  
      })    

      // 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
      function deleteClickLine() {
        if (clickLine) {
          clickLine.setMap(null)    
          clickLine = null        
        }
        totalDots.value = []
        totalDotsName.value = []
        totalDistance.value = undefined
      }

      // 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
      // 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
      function showDistance(content, position) {
                    
        if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
                        
          // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
          distanceOverlay.setPosition(position)
          distanceOverlay.setContent(content)
                        
        } else { // 커스텀 오버레이가 생성되지 않은 상태이면
                        
          // 커스텀 오버레이를 생성하고 지도에 표시합니다
          distanceOverlay = new kakao.maps.CustomOverlay({
            map: map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3,  
          })      
        }
      }

      // 그려지고 있는 선의 총거리 정보와 
      // 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
      function deleteDistnce () {
        if (distanceOverlay) {
          distanceOverlay.setMap(null)
          distanceOverlay = null
        }
      }

      // 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여 
      // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
      function displayCircleDot(position, distance) {

        // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
        var circleOverlay = new kakao.maps.CustomOverlay({
          content: '<span class="dot"></span>',
          position: position,
          zIndex: 1,
        })

        // 지도에 표시합니다
        circleOverlay.setMap(map)

        if (distance > 0) {
          // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
          var distanceOverlay = new kakao.maps.CustomOverlay({
            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
            position: position,
            yAnchor: 1,
            zIndex: 2,
          })

          // 지도에 표시합니다
          distanceOverlay.setMap(map)
        }

        // 배열에 추가합니다
        dots.push({ circle: circleOverlay, distance: distanceOverlay, position: position })
      }

      // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
      function deleteCircleDot() {
        var i

        for ( i = 0; i < dots.length; i++ ){
          if (dots[i].circle) { 
            dots[i].circle.setMap(null)
          }

          if (dots[i].distance) {
            dots[i].distance.setMap(null)
          }
        }
        
        dots = []
      }

      // 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여 
      // 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
      // HTML Content를 만들어 리턴하는 함수입니다
      function getTimeHTML(distance) {

        // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
        var walkkTime = distance / 67 | 0
        var walkHour = '', walkMin = ''

        // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
        if (walkkTime > 60) {
          walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
        }
        walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

        // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
        var bycicleTime = distance / 227 | 0
        var bycicleHour = '', bycicleMin = ''

        // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
        if (bycicleTime > 60) {
          bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
        }
        bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

        // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
        var content = '<ul class="dotOverlay distanceInfo">'
        content += '    <li>'
        content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m'
        content += '    </li>'
        content += '    <li>'
        content += '        <span class="label">도보</span>' + walkHour + walkMin
        content += '    </li>'
        content += '    <li>'
        content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin
        content += '    </li>'
        content += '</ul>'

        return content
      }
    },
  },
}
</script>

<style scoped>
@import "@/pages/exercise/mapCss.css"

</style>

<style>
.dot { overflow: hidden; background: url("http://localhost:3333/src/assets/images/mapPoint.svg"); block-size: 12px; float: inline-start; inline-size: 12px; }
.dotOverlay { position: relative; padding: 5px; border: 1px solid #ccc; border-radius: 6px; background: #fff; border-block-end: 2px solid #ddd; float: inline-start; font-size: 12px; inset-block-end: 10px; }
.dotOverlay:nth-of-type(n) { border: 0; box-shadow: 0 1px 2px #888; }
.number { color: #005d32; font-weight: bold; }
.dotOverlay::after { position: absolute; background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png"); block-size: 8px; content: ""; inline-size: 11px; inset-block-end: -8px; inset-inline-start: 50%; margin-inline-start: -6px; }
.distanceInfo { position: relative; margin: 0; inset-block-start: 5px; inset-inline-start: 5px; list-style: none; }
.distanceInfo .label { display: inline-block; inline-size: 50px; }
.distanceInfo::after { content: none; }
</style>
