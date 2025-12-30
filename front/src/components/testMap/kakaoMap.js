import { onMounted } from "vue"

const loadScript = () =>{
  const script = document.createElement('script')

  script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=ca9eb44c2889273e11b9860d99308508'
  script.addEventListener('load', () => kakao.maps.load(initMap))
  document.head.appendChild(script)
}

let map = null

const initMap = () => {
  const container = document.getElementById('map')
  var lat = 33.450701
  var lng = 126.570667

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 5,
  }

  map = new kakao.maps.Map(container, options)
}

onMounted( () => {
  if(window.kakao?.maps){
    console.log('map이 있음', window.kakao.maps)
    initMap()
  } else{
    console.log('lading필요')
    loadScript()
  }
})
