<template>
  <div>
    <VSelect
      id="pathSelect"
      :items="recommendPathView"
      label="추천 경로를 선택하세요"
      variant="filled"
      :style="{'width':'100%','float':'right'}"
      @click="selectController"
    />
  </div>
  <div
    id="recoMap"
    :style="{'width':'100%','height':'450px'}"
  /><!-- @click="$emit('refreshChildRoad', lat[0], lng[0], drawingMap)" -->
</template>

<script setup>
import { createRoadView } from '@/pages/exercise/createRoadView'
import { getCurrentPosition, getLatLng, getPedePath } from '@/pages/exercise/googleGeoCoderAPI'
import { ref } from 'vue'

//구글 지도 api 끝

//lat, lng 값을 저장할 변수 
const emit = defineEmits(["updateRoadView"])

//구글 지도 api
getLatLng("대모산 정상")

var recommendPath = [ //받아온 데이터라고 가정
  ["달터근린공원", "구룡산길", "개암약수터"],
  ["실로암 약수터", "대모산 초소위", "대모산 정상"],
  ["선정릉", "봉은사"],
]
var map = ref('') //지도 객체를 담을 변수
var recommendPathView = [] //받아온 경로를 뿌려주는 값을 저장할 변수

const selectController = () => {
  console.log('select에 클릭 이벤트')
}


onMounted(()=>{
  const script = document.createElement("script")

  script.onload = () => {
    kakao.maps.load(()=>{ //kakao가 로드되었을 때 실행될 콜백함수 정의

      //지도 띄우기
      //lng, lat 값 얻기
      var lng
      var lat
      getCurrentPosition()
        .then(([currlng, currlat])=>{
          lng = currlng
          lat = currlat
          initMap(lng, lat)
          map.value.relayout()
      
          createRoadView(map.value)
        })
        .catch(err => {
          console.error(err)
        })
    })
  }
  script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ca9eb44c2889273e11b9860d99308508&libraries=services,clusterer,drawing"
  document.head.appendChild(script)
})



//지도를 화면에 로드하기 위한 함수
//⭐지도 객체는 반응형이 아니므로 initMap 함수를 정의해 사용해야 함
const initMap = (lng, lat) => {
  const container = document.getElementById("recoMap")

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 5,
  }

  map.value = new kakao.maps.Map(container, options)
  map.value.relayout()
  emit("updateRoadView", map.value)

  //경로 가져오기
  recommendPath.forEach(path=>{
    var option = ''
    path.forEach(point=>{
      option += point + '-' //뿌려주는 용도의 text
    })
    option = option.slice(0, option.length-1)
    recommendPathView.push(option) //드롭다운 선택란에 뿌려줄 값
  })
  var path
  var polyline = new kakao.maps.Polyline({ //지도에 올려줄 polyline 설정
    strokeWeight: 3,
    strokeColor: '#007B2A',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })
  const markers = ref([]) //지도에 올려줄 마커들을 모아둔 객체 설정
  const infos = ref([]) //지도에 올려줄 인포들을 모아둔 객체 설정

  window.onclick = () =>{
    var pathTag = document.getElementsByClassName('v-select__selection-text')[0]
    if(typeof pathTag != 'undefined') {
      var load = []
      var loadName = []
      if(path != pathTag.textContent) {
        path = pathTag.textContent
        console.log(path)
        for(var point in path.split("-")) {
          if (path.split("-")[point] != '') {
            var name = path.split("-")[point]
            console.log(name)
            loadName.push(name)
            getLatLng(name).then(latlng=>{
              console.log(name, ":", latlng)
              load.push([latlng.lat, latlng.lng])
            })
              .catch(err=>{
                var places = new kakao.maps.services.Places() //검색을 위한 객체
                places.keywordSearch(name, (result, status)=>{
                  if (status === kakao.maps.services.Status.OK) {
                    console.log(name, '검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
                    load.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
                  }
                })
              })

          }//split if문
        }//for
        console.log('선택한 경로', loadName)
        console.log('선택한 경로 위도경도', load)

        //drawPolyLine(load, loadName, map.value, polyline, markers, infos)
        getPedePath(load, loadName, map.value, polyline, markers, infos) //보행자 경로 표시
        //setMarkerNInfo(load, loadName, map.value, markers, infos) //포인트 위치에만 마커, 인포윈도우 생성
      }
    }
    map.value.relayout()
  }
}
</script>

<style>
.info-title {
  display: block;
  border-radius: 4px;
  background: #50627f;
  block-size: 24px;
  color: #fff;
  line-height: 22px;
  padding-block: 0;
  padding-inline: 10px;
  text-align: center;
}
</style>
