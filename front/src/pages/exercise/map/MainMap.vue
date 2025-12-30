<template>
  <div id="mainmap" :style="{ 'width': '100%', 'height': '450px' }" />
</template>

<script setup>
import { getCurrentPosition, getPedePath } from '@/pages/exercise/googleGeoCoderAPI'
import axios from '@axios'
import { defineExpose, defineProps, onMounted } from 'vue'

const props = defineProps({
  rpathNo: {
    type: Object,
  },
})


const map = ref() //지도객체
const markers = ref([]) //지도에 올려줄 마커들을 모아둔 객체 설정
const infos = ref([]) //지도에 올려줄 인포들을 모아둔 객체 설정
const polyline = ref() //지도객체 위의 polyline 정보값
var load = []
var loadname = []
const pathNo = ref(421)



const test = () => {
  if (props.rpathNo !== undefined) {
    console.log("MainMap.vue", props.rpathNo.value)
    changePath(props.rpathNo.value)
  }
}

onMounted(() => {
  const script = document.createElement("script")

  script.onload = () => {

    kakao.maps.load(() => { //kakao가 로드되었을 때 실행될 콜백함수 정의

      //지도 띄우기
      //lng, lat 값 얻기
      var lng
      var lat
      getCurrentPosition()
        .then(([currlng, currlat]) => {
          lng = currlng
          lat = currlat
          initMap(lng, lat)
          map.value.relayout()
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

const initMap = (lng, lat) => {
  console.log("initMap:", lng, lat)
  var container = document.getElementById('mainmap'), // 이미지 지도를 표시할 div  
    options = {
      center: new kakao.maps.LatLng(lat, lng), // 이미지 지도의 중심좌표
      level: 5, // 이미지 지도의 확대 레벨
    }

  map.value = new kakao.maps.Map(container, options)
  polyline.value = new kakao.maps.Polyline({ //지도에 올려줄 polyline 설정
    strokeWeight: 3,
    strokeColor: '#007B2A',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })

}

const changePath = val => {
  axios.get("/exercise/schedulepath", { params: { path_no: val } })
    .then(resp => {
      loadname = resp.data[0]
      load = resp.data[1]
      getPedePath(load, loadname, map.value, polyline.value, markers, infos)
    })
}

defineExpose({ test })
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
