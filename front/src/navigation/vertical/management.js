let mapRecRouteCounter =0
let poseRouteCounter =0
let exerRecRouteCounter =0
let dietRouteCounter =0
let foodRouteCounter =0
let diaryRouteCounter =0

export default [
  { heading: '관리' },
  {
    title: '운동 및 수면',
    icon: { icon: 'mdi-weight-lifter' }, // icon
    children: [
      { title: '운동 경로 탐색', meta: { counter: mapRecRouteCounter++ }, to: { name: 'exercise-map-recommend', params: { recommend: 'self' } }, icon: { icon: 'mdi-map-check' } }, //test폴더 안의 test.vue 파일을 의미 아이콘 사용 불가
      // { title: '운동 자세 분석', meta: { counter: poseRouteCounter++ }, to: 'exercise-pose', icon: { icon: 'mdi-human-male-board-poll' } }, //test폴더 안의 test2.vue 파일을 의미
      { title: '운동추천', meta: { counter: exerRecRouteCounter++ }, to: { name: 'exerciseRecommendation' }, icon: { icon: 'mdi-motion-sensor'  } },
    ],
  },
  {
    title: '식단',
    icon: { icon: 'mdi-food-fork-drink' }, // icon
    children: [
      { title: '식단 기록하기', meta: { counter: dietRouteCounter++ }, to: 'diet-dietRecord', icon: { icon: 'mdi-pencil-plus-outline'  } }, //test폴더 안의 test.vue 파일을 의미 아이콘 사용 불가
      { title: '식단 추천받기', meta: { counter: foodRouteCounter++ }, to: 'dietFood', icon: { icon: 'mdi-cookie-refresh-outline'  } },
    ],
  },
  {
    title: '마음돌봄',
    icon: { icon: 'mdi-hand-heart-outline' }, // icon
    children: [
      { title: '다이어리', meta: { counter: diaryRouteCounter++ }, to: 'diary', icon: { icon: 'mdi-notebook' } }, //test폴더 안의 test.vue 파일을 의미 아이콘 사용 불가
    ],
  },
]
