import { ref } from 'vue'

export var isSearchListClicked = ref(false)
var map = ref(null)
var markers = ref([])
var infowindow = ref(null)
const startImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png' //출발 위치 클릭시 이미지
const endImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png' //도착 위치 클릭시 이미지
var markerClicked = ref(0) //마커를 클릭한 회수에 따라 출발 위치인지 도착위치인지 구분하기 위함
var startPosition = ref(null) //출발 위치와 도착위치가 겹치는 것을 방지하기 위함

export function getNameFromlatlng(coord) { //위치 좌표를 도로명 주소 정보로 반환
  var geocoder = new kakao.maps.services.Geocoder()
  const pointname = ref('')
  const addrname = ref('')
  var callback = function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var temp = result[0].address.address_name.split(" ")

      //pointname.value = temp[temp.length-3]+" "+temp[temp.length-2]+" "+temp[temp.length-1]
      pointname.value = temp[temp.length-2]+" "+temp[temp.length-1]
      addrname.value = temp[temp.length-3]
    }
  }
  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback)
  
  return [pointname, addrname]
}

// 키워드 검색을 요청하는 함수입니다
// 장소 검색 객체와 지도 객체를 인자로 받음
export function searchPlaces(ps, map_param) { //, markers_param
  map.value = map_param
  console.log('markers.value:', typeof markers.value)
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 })
  var keyword = document.getElementById('keyword').value
  console.log('searchPlaces:', keyword)
  console.log('searchPlaces마커체크:', markers.value)
  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!')
    
    return false
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch( keyword, placesSearchCB) 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
export function placesSearchCB(data, status, pagination) {
  console.log('placesSearchCB')
  console.log(kakao.maps.services.Status.OK)
  if (status === kakao.maps.services.Status.OK) {

    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    console.log(data)
    displayPlaces(data)

    // 페이지 번호를 표출합니다
    displayPagination(pagination)

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

    alert('검색 결과가 존재하지 않습니다.')
    
    return

  } else if (status === kakao.maps.services.Status.ERROR) {

    alert('검색 결과 중 오류가 발생했습니다.')
    
    return

  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
export function displayPlaces(places) {
  console.log('displayPaces 함수 실행됨')
  var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu-wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = ''
  console.log('displayPaces 함수 - listEl:', listEl)

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl)

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker()
    
  for ( var i=0; i<places.length; i++ ) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x)

    var marker = addMarker(placePosition)
    var itemEl = getListItem(i, places[i]) // 검색 결과 항목 Element를 생성합니다
    
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition)

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 })

    // displayInfowindow(marker, places[i].place_name)

    //마커이미지 생성
    var  imageSize = new kakao.maps.Size(50, 45),  // 마커 이미지의 크기
      startMarkerImage = new kakao.maps.MarkerImage(startImageSrc, imageSize), //출발 이미지
      endMarkerImage = new kakao.maps.MarkerImage(endImageSrc, imageSize) //도착 이미지

    function infoFunc(marker, title) {
      kakao.maps.event.addListener(marker, 'mouseover', function() {
        displayInfowindow(marker, title)
      })

      kakao.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.value.close()
      })

      itemEl.onmouseover =  function () {
        displayInfowindow(marker, title)
      }

      itemEl.onmouseout =  function () {
        infowindow.value.close()
      }

      itemEl.onclick = function() {
        isSearchListClicked.value = true
        console.log('itemEl클릭:', typeof isSearchListClicked.value)
      }
      kakao.maps.event.addListener(marker, 'click', function() {
        if(markerClicked.value === 0) {
          startPosition.value = marker.n
          marker.setImage(startMarkerImage)
          markerClicked.value += 1
        } //출발좌표 등록
        else if(markerClicked.value === 1) {
          if(startPosition.value.La == marker.n.La && startPosition.value.Ma == marker.n.Ma){
            alert('출발위치와 다른 도착위치를 설정해주세요')
          }
          else {
            marker.setImage(endMarkerImage)
            removeMarker()
            markerClicked.value += 1
          }
        } //도착좌표 등록
        else if(markerClicked.value === 2){
          removeAllMarker()
          markerClicked.value=0
        }
      }) //마커 클릭 이벤트
    }
    infoFunc(marker, places[i].place_name)
    
    


    fragment.appendChild(itemEl)
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment)
  menuEl.scrollTop = 0
  console.log('bounds 값 보기:', bounds)

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.value.setBounds(bounds)
}

// 검색결과 항목을 Element로 반환하는 함수입니다
export function getListItem(index, places) {

  var el = document.createElement('li'),
    itemStr = '<a href="#"><span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>'

  if (places.road_address_name) {
    itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray">' +  places.address_name  + '</span>'
  } else {
    itemStr += '    <span>' +  places.address_name  + '</span>' 
  }
                 
  itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div></a>'           

  el.innerHTML = itemStr
  el.className = 'item'

  return el
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
export function addMarker(position) {
  //https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png
  var imageSrc = 'https://t1.daumcdn.net/mapjsapi/images/marker.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(29, 42),  // 마커 이미지의 크기
    // imgOptions =  {
    //   spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
    //   // spriteOrigin: new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
    //   // offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    // },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize), //, imgOptions
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage, 
    })
  marker.setMap(map.value) // 지도 위에 마커를 표출합니다
  markers.value.push(marker)  // 배열에 생성된 마커를 추가합니다

  return marker
}

export function addTempMarker(param_map) { //사용자가 조정 가능한 마커 생성용

  map.value = param_map
  var markerImage = new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
    new kakao.maps.Size(24, 35))
  var marker = new kakao.maps.Marker({
    map: map.value,
    position: map.value.getCenter(),
    image: markerImage,
    draggable: true,
  })
  marker.setMap(map.value)
  markers.value.push(marker)
}

// 출발, 도착 마커를 제외한 지도 위에 표시되고 있는 마커를 모두 제거
export function removeMarker() {
  console.log('remove 이전 markers값:', markers.value)
  var tempStartEndMarker = [] //출발, 도착 마커를 잠시 담아두기 위한 변수

  for ( var i = 0; i < markers.value.length; i++ ) {
    //검색 결과 마커들만 제거
    //동시에 삭제까지 진행할 경우 인덱스 번호가 꼬이기 때문에 따로 담아둬야 함
    if(markers.value[i] !== undefined) {
      if (markers.value[i].T.mk != startImageSrc && markers.value[i].T.mk != endImageSrc) {
        markers.value[i].setMap(null)
      }
      else {
        tempStartEndMarker.push(markers.value[i])
      }
    }
  }   
  if(tempStartEndMarker.length == 0) {
    markers.value = []
  }
  else {
    markers.value = [tempStartEndMarker[0], tempStartEndMarker[1]]
  }
  console.log('remove결과:', markers.value)
  console.log('remove결과:', tempStartEndMarker)
}

export function removeAllMarker() {
  markerClicked.value = 0
  console.log("markers:", markers)
  for ( var i = 0; i < markers.value.length; i++ ) {
    markers.value[i].setMap(null)
  }   
  markers.value = []
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
export function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
    fragment = document.createDocumentFragment(),
    i 

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild (paginationEl.lastChild)
  }

  for (i=1; i<=pagination.last; i++) {
    var el = document.createElement('a')
    el.href = "#"
    el.innerHTML = i

    if (i===pagination.current) {
      el.className = 'on'
    } else {
      el.onclick = (function(i) {
        return function() {
          pagination.gotoPage(i)
        }
      })(i)
    }

    fragment.appendChild(el)
  }
  paginationEl.appendChild(fragment)
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
export function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>'

  infowindow.value.setContent(content)
  infowindow.value.open(map.value, marker)
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
export function removeAllChildNods(el) {   
  while (el.hasChildNodes()) {
    el.removeChild (el.lastChild)
  }
}
