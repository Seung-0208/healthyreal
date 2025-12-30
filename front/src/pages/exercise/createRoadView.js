//변수 선언
var rvContainer //로드뷰가 들어갈 태그
var rvClient //로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체 생성
var markImage //마커 이미지
var rv //로드뷰 객체
var isTmapSupported


function initialize(){
  //로드뷰가 들어갈 태그
  rvContainer = document.getElementById('roadview') 

  //로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체 생성
  rvClient = new kakao.maps.RoadviewClient() 

  //로드뷰 객체 생성
  rv = new kakao.maps.Roadview(rvContainer) 

  //마커 이미지
  markImage = new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
    new kakao.maps.Size(26, 46),
    {
    // 스프라이트 이미지를 사용합니다.
    // 스프라이트 이미지 전체의 크기를 지정하고
      spriteSize: new kakao.maps.Size(1666, 168),

      // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
      // background-position으로 지정하는 값이며 부호는 반대입니다.
      spriteOrigin: new kakao.maps.Point(705, 114),
      offset: new kakao.maps.Point(13, 46),
    },
  )
}


// 전달받은 좌표(position)에 가까운 로드뷰의 파노라마 ID를 추출하여
// 로드뷰를 설정하는 함수
export function toggleRoadview(rv, position){
  console.log('toggleRoadview함수 실행됨:', position)
  rvClient.getNearestPanoId(position, 300, function(panoId) {
    // 파노라마 ID가 null 이면 로드뷰를 숨깁니다
    if (panoId === null) {
      
    }
    else {
      // panoId로 로드뷰를 설정합니다
      rv.setPanoId(panoId, position)
    }
  },
  )
}


export function createRoadView(map){ //맵 객체를 인자로 받음
  console.log('createRoadView 인자값:', map)
  initialize()

  // 드래그가 가능한 마커를 생성
  var marker = new kakao.maps.Marker({
    image: markImage,
    position: map.getCenter(),
    draggable: true,
  })
  
  //지도에 마커 표시 (직접 움직여가며 헤당 좌표의 사진값을 보기 위한 용도)
  marker.setMap(map)
  
  
  // 마커에 dragend 이벤트를 등록
  kakao.maps.event.addListener(marker, 'dragend', function(mouseEvent) {
    
    console.log('마커에 draggable 이벤트 발생')
    console.log('mouseEvent', mouseEvent)

    // 현재 마커가 놓인 자리의 좌표
    var position = marker.getPosition()
  
    // 마커가 놓인 위치를 기준으로 로드뷰를 설정
    toggleRoadview(rv, position)
  })



  //로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트를 등록
  kakao.maps.event.addListener(rv, 'position_changed', function() {

    // 현재 로드뷰의 위치 좌표를 얻어옵니다 
    var rvPosition = rv.getPosition()

    // 지도의 중심을 현재 로드뷰의 위치로 설정
    map.setCenter(rvPosition)

    // 마커의 위치를 현재 로드뷰의 위치로 설정합니다
    marker.setPosition(rvPosition)
  })

  //지도에 클릭 이벤트 등록
  kakao.maps.event.addListener(map, 'click', function(mouseEvent){

    // 클릭한 위치의 좌표
    var position = mouseEvent.latLng

    // 마커를 클릭한 위치로 옮김
    marker.setPosition(position)

    // 클락한 위치를 기준으로 로드뷰를 설정
    toggleRoadview(rv, position)
  })
} //createRoadView




//경로와 마커를 그려주는 코드

function checkArrayUpdated(arr) { //배열이 업데이트 되었는지 확인하는 함수
  return new Promise(resolve=>{
    setTimeout(()=>{
      if(arr.length != 0) resolve()
    }, 1000)
  })
}

function removeMarkers(markers, infos) { //마커, 인포들을 지우는 함수
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null)
    infos[i].close()
  }     
}

export function drawPolyLine(path, pathName, map, polyline, markers, infos){ //경로 그려주는 함수
  
  checkArrayUpdated(path).then(()=>{ //배열이 모두 로드가 되었을 때 작동
    //(param)path: 카카오 위도, 경도로 변경한 path값들의 객체 리스트
    console.log('Promise이전:', path)
    

    if(path.pedePath.length==path.pointPath.length) isTmapSupported = false
    else isTmapSupported = true

    return new Promise((resolve, reject)=>{
      var tempPath = []
      if(isTmapSupported){
        for(const element of path.pedePath) {
          tempPath.push(new kakao.maps.LatLng(element[0], element[1]))
        }
      }
      else{
        console.log("지원되지 않음")
        if(path.pedePath[0][0] > 100) {
          console.log("그래서 if문 안으로 들어옴")
          for(const element of path.pedePath) {
            console.log('element[1]:', element[1])
            tempPath.push(new kakao.maps.LatLng(element[1], element[0]))
            var temp = []
            for(const i of path.pointPath){
              console.log(i)
              temp.push([i[1], i[0]])
            }
            path.pointPath = temp
          }
        }
      }
      console.log("Promise에서의 tempPath값:", tempPath)
      resolve(tempPath)
      reject('에러 발생')
    })
  }, //하나의 경로에 접근하는 for
  )//then
    .then(tempPath => {
      console.log('polyline에 전달한 tempPath값:', tempPath)
      polyline.setMap(map)
      polyline.setPath(tempPath)
      console.log('polyline:', polyline)
      console.log('map:', map)
      console.log(polyline.getMap())
      console.log("path:", path)
      if(path.pointPath[0][0]>100){
        
      }
      console.log("tempPath:", tempPath)
      setMarkerNInfo(path.pointPath, pathName, map, markers, infos)
    })//then
}

export function setMarkerNInfo(path, pathName, map, markers, infos) { 
  /*
    path: 대략적인 포인트가 되는 path
  */
  var bounds = new kakao.maps.LatLngBounds() //지도의 범위정보 설정
  removeMarkers(markers.value, infos.value) //지도에 원래 올라가있던 값들 제거
  checkArrayUpdated(path).then(()=>{
    //(param)path: 카카오 위도, 경도로 변경한 path값들의 객체 리스트
    return new Promise((resolve, reject)=>{
      var tempPath = []
      for(const element of path) {
        //console.log('element값:', element)
        tempPath.push(new kakao.maps.LatLng(element[0], element[1])) //받은 경로를 카카오 위도경도로 변환
        bounds.extend(new kakao.maps.LatLng(element[0], element[1]))
      }
      resolve(tempPath)
      reject('에러 발생')
    })
  }, //하나의 경로에 접근하는 for
  )//then
    .then(tempPath=>{
      var i = 0
      for(const path of tempPath) {
        console.log(`${i}번째 좌표:`, path)
        var marker = new kakao.maps.Marker({ //마커 생성
          map: map,
          position: path,
        })
        markers.value.push(marker)

        //marker.setMap(map)
        if (pathName[i] != 'undefined') {
          var iwContent = `<span class="info-title">${pathName[i]}</span>`
          console.log(`${i}번째 인포윈도우:`, iwContent)
          var infoWindow = new kakao.maps.InfoWindow({ //인포윈도우 생성
            content: iwContent, 
          })
          infos.value.push(infoWindow)
          

          infoWindow.open(map, marker)
        }
        i++
      }//마커 및 인포윈도우 생성 for문
    })
    .then(()=>{
      makeInfoWindowDesign()
      map.setBounds(bounds)
      map.relayout()
    })
}

function makeInfoWindowDesign(){
  var infoTitle = document.querySelectorAll('.info-title')
  infoTitle.forEach(function(e) {
    var w = e.offsetWidth + 10
    var ml = w/2
    e.parentElement.style.top = "82px"
    e.parentElement.style.left = "50%"
    e.parentElement.style.marginLeft = -ml+"px"
    e.parentElement.style.width = w+"px"
    e.parentElement.previousSibling.style.display = "none"
    e.parentElement.parentElement.style.border = "0px"
    e.parentElement.parentElement.style.background = "unset"
  })
}
