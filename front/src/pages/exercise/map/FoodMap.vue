<script setup>
import { getCurrentPosition } from '@/pages/exercise/googleGeoCoderAPI'
import { onMounted } from 'vue'

// import { isSearchListClicked } from '@/pages/exercise/mapSearch'

const props = defineProps({
  searchRestaurant: {
    type: String,
    required: true,
  }, userarea: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['restaurantSave'])

const searchplace = ref(props.userarea + props.searchRestaurant)

const map = ref() //지도객체
const markers = ref([]) //지도에 올려줄 마커들을 모아둔 객체 설정
const infos = ref([]) //지도에 올려줄 인포들을 모아둔 객체 설정
const polyline = ref() //지도객체 위의 polyline 정보값
const bounds = ref()
  
onMounted(()=>{
  const script = document.createElement("script")

  script.onload = () => {
      
    kakao.maps.load(()=>{ //kakao가 로드되었을 때 실행될 콜백함수 정의
      bounds.value = new kakao.maps.LatLngBounds()
  
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
  
const initMap = (lng, lat)=>{
  console.log("initMap:", lng, lat)
  var container  = document.getElementById('map'), // 이미지 지도를 표시할 div  
    options = { 
      center: new kakao.maps.LatLng(lat, lng), // 이미지 지도의 중심좌표
      level: 5, // 이미지 지도의 확대 레벨
    }
      
  map.value = new kakao.maps.Map(container, options)
  polyline.value =  new kakao.maps.Polyline({ //지도에 올려줄 polyline 설정
    strokeWeight: 3,
    strokeColor: '#007B2A',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })
  changePath()

  //setTimeout(changePath, 3000)
}

const searchResult = ref([])


const changePath = () => {
  var places = new kakao.maps.services.Places()
  var load = []
  console.log("changepath 실행됨")
  console.log("changePath 값:", props.searchRestaurant)

  /*
  x "126.249828956914" lng
  y "33.217732821842" lat
  */

  places.keywordSearch(searchplace.value, (result, status)=>{
    if (status === kakao.maps.services.Status.OK) {
      console.log('검색 결과:', result) //위도, 경도 값에 대한 정보가 나와있음
      searchResult.value = result
      for(const temp of result) {
        load.push([temp.y, temp.x])
      }
      console.log("load값:", load)
      for(const tempPos of load) {
        console.log(tempPos)
        var markerPos = new kakao.maps.LatLng(tempPos[0], tempPos[1])
        var imageSrc = 'https://t1.daumcdn.net/mapjsapi/images/marker.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
          imageSize = new kakao.maps.Size(29, 42),  // 마커 이미지의 크기
          markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize), //, imgOptions
          marker = new kakao.maps.Marker({
            position: markerPos, // 마커의 위치
            image: markerImage, 
          })
        marker.setMap(map.value) // 지도 위에 마커를 표출합니다
        markers.value.push(marker)  // 배열에 생성된 마커를 추가합니다
        bounds.value.extend(markerPos)
        console.log("마커:", marker)

        // var content = '<div style="padding:5px;z-index:1;">' + "라벨 내용" + '</div>'
        // var infowindow = new kakao.maps.InfoWindow({
        //   content: content,
        //   position: markerPos,
        //   removable: true,
        // })

        // kakao.maps.event.addListener(marker, 'mouseover', function() {
        //   infowindow.open(map.value, marker)
        // })

        // kakao.maps.event.addListener(marker, 'mouseout', function() {
        //   infowindow.close()
        // })
      }

      //load.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
    }
    else{
      console.log("값을 불러오지 못함")
    }
  })
  console.log("bounds:", bounds.value)
  map.value.relayout()

//   map.value.setBounds(bounds.value)
}

const saveRestaurant = ref([])

const choosePlace = item =>{
  saveRestaurant.value = item
  console.log('아이템 값 : ', saveRestaurant.value)
  var ln
  var la
  getCurrentPosition()
    .then(()=>{
      ln = item.x
      la = item.y
      initMap(ln, la)
      map.value.relayout()
    })
    .catch(err => {
      console.error(err)
    })
    
  emit('restaurantSave', item)
}


//////////////////////////////////////////////////////
</script>

<template>
  {{ searchResult[0]?'':'검색 결과가 없습니다.' }}
  <div :style="{'width':'100%','height':'450px'}">    
    <div
      :style="{'width':'100%', 'height':'100px', 'overflow-y':'auto'}"
      class="scrollbar"
    >
      <Ui
        v-for="item in searchResult"
        :key="item.id"        
      >
        <VBtn
          id="placesList"                  
          variant="plane"
          style="width:100%"
          @click="choosePlace(item)"
        >
          <table>
            <tr>
              <td>
                {{ item.place_name }}
              </td> 
              <td>({{ item.address_name }})</td>
            </tr>
          </table>
        </VBtn><br>
      </Ui>
    </div>
    <br><VDivider /><br>
    <div
      id="map"
      :style="{'width':'100%','height':'450px'}"
    />
  </div>
  <!-- v-if="searchResult && searchResult.length > 0" -->
</template>

<style>
#placesList:active {
  background-color: lightblue; /* 클릭했을 때의 배경색 설정 */
}
</style>