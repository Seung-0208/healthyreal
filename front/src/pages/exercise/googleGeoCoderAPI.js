import { drawPolyLine } from '@/pages/exercise/createRoadView'
import axios from '@axios'

export async function getLatLng(keyword) { //구글 지도 api를 사용하여 위도, 경도 값 가져오기
  //입력받은 keyword를 url에 사용가능하게 인코딩
  var encodedAddress = encodeURIComponent(keyword)
  console.log('getLatLng에서 받은 인자:', keyword)
  console.log('넘겨준 address값:', encodedAddress)
  var geocodeKey = "AIzaSyDWWbycYmJo8T-6pHev1YUPWi_5W5FIHl0" //Geocoding api 키
  const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${geocodeKey}`)

  console.log('반환값:', resp.data.results[0])
  
  return resp.data.results[0].geometry.location
}//getLatLng

export async function getKakaoLatLng(keyword, load) { //카카오 지도 api를 사용하여 위도, 경도 값 가져오기
  var places = new kakao.maps.services.Places() //검색을 위한 객체

  const result = await places.keywordSearch(keyword, (result, status)=>{
    if (status === kakao.maps.services.Status.OK) {
      console.log('검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
      
      //load.push([result[0].y, result[0].x])
      
      
      return result[0]

      //load.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
    }
  })

  console.log('await 이후의 result:', result)
  load.push([result[0].y, result[0].x])
}

export const getCurrentPosition = () => { //사용자의 현재 위치를 얻어오기 위한 함수
  return new Promise((resolve, reject) => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve([position.coords.longitude, position.coords.latitude])
      }, error => {
        reject(error)
      })
    } else {
      reject(new Error('Geolocation is not supported by this browser.'))
    }
  })
}

function checkArrayUpdated(arr) { //배열이 업데이트 되었는지 확인하는 함수
  return new Promise(resolve=>{
    setTimeout(()=>{
      if(arr.length != 0) resolve(arr)
    }, 1000)
  })
}//checkArrayUpdated

export function getPedePath(path, pathName, map, polyline, markers, infos) { //lat,lng 티맵라이브러리 (보행자의 경로를 불러오는 함수)
  console.log("getPedePath함수 실행")
  
  checkArrayUpdated(path).then(path=>{
    console.log("getPedePath-path:", path)
    var pathListParam=""
    for(var i=1; i<path.length-1; i++) {
      pathListParam += `${path[i][0]},${path[i][1]}_`
    }
    console.log('getPedePath-path:', path)
    var requestBody
    requestBody = {
      startX: path[0][0],
      startY: path[0][1],
      angle: 20,
      speed: 30,
      endPoiId: '10001',
      endX: path[path.length-1][0],
      endY: path[path.length-1][1],
      reqCoordType: 'WGS84GEO',
      startName: encodeURIComponent(pathName[0]),
      endName: encodeURIComponent(pathName[pathName.length-1]),
      searchOption: '0',
      resCoordType: 'WGS84GEO',
      sort: 'index',
    }
    if(pathListParam !== ""){
      pathListParam = pathListParam.substring(0, pathListParam.length-1)
      requestBody['passList'] = pathListParam
    }
    axios.post("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function", JSON.stringify(requestBody), 
      { headers: { 'Content-Type': 'application/json',
        'appKey': 'REIa2TCseO1cIZwedynqcI22HxzNxna5R6zePbP2',
        'accept': 'application/json' } })
      .then(resp=>{
        var pedePathPoint = { "pedePath": [], "pointPath": [] }
  
        for(var i=0; i<resp.data.features.length;i++){
          console.log(`${i}번째 pointType`, resp.data.features[i].properties.pointType)
          if (resp.data.features[i].properties.pointType!="GP" && resp.data.features[i].properties.pointType!=undefined){
            //[127.08084206052835, 37.47543377320427]
            pedePathPoint.pointPath.push([resp.data.features[i].geometry.coordinates[1], resp.data.features[i].geometry.coordinates[0]])
          }
          if(resp.data.features[i].geometry.type=="LineString") {
            for (const point of resp.data.features[i].geometry.coordinates){
              pedePathPoint.pedePath.push([point[1], point[0]])
            }
          }
        }
            
        return pedePathPoint
      })
      .then(pedePathPoint=>{
        drawPolyLine(pedePathPoint, pathName, map, polyline, markers, infos)
      })
      .catch(err=>{
        console.error("에러발생:", err)
        var pedePathPoint = { "pedePath": path, "pointPath": path }
        drawPolyLine(pedePathPoint, pathName, map, polyline, markers, infos)
      })
  })
} //getPedePath
