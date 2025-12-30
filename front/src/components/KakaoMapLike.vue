<template>
  <div>
    <div id="map" />
  </div>
</template>

<script>
import { toRaw } from "vue"

export default {
  name: "KakaoMap",
  data() {
    return {
      infowindow: null,
    }
  },
  mounted() {
    console.log('like')
    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement("script")

      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ca9eb44c2889273e11b9860d99308508"
      document.head.appendChild(script)
    }
  },
  methods: {

    initMap() { //지도 초기화 함수
      const container = document.getElementById("map")
      var lat = 33.450701
      var lng = 126.570667 //디폴트 값
      //현재 위치 얻기
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(positions=>{
          lat = positions.coords.latitude
          lng = positions.coords.longitude
        })
      }

      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 5,
      }

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      console.log(lat)
      this.map = new kakao.maps.Map(container, options)
    },
    changeSize(size) {
      const container = document.getElementById("map")

      container.style.width = `${size}px`
      container.style.height = `${size}px`
      toRaw(this.map).relayout()
    },
    displayMarker(markerPositions) {
      if (this.markers.length > 0) {
        this.markers.forEach(marker => marker.setMap(null))
      }

      const positions = markerPositions.map(
        position => new kakao.maps.LatLng(...position),
      )

      if (positions.length > 0) {
        this.markers = positions.map(
          position =>
            new kakao.maps.Marker({
              map: toRaw(this.map),
              position,
            }),
        )

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds(),
        )

        toRaw(this.map).setBounds(bounds)
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        toRaw(this.map).setCenter(this.infowindow.getPosition())
        
        return
      }

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: toRaw(this.map), // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      })

      toRaw(this.map).setCenter(iwPosition)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 500px;
  height: 500px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
