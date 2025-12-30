//변수 선언
var rvContainer //로드뷰가 들어갈 태그
var rvClient //로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체 생성
var markImage //마커 이미지

function initialize(){
  //로드뷰가 들어갈 태그
  rvContainer = document.getElementById('roadview') 
  
  //로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체 생성
  rvClient = new kakao.maps.RoadviewClient() 
  
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

