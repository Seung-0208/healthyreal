
export default [
  {
    title: '운동 및 수면',
    icon: { icon: 'mdi-weight-lifter' }, // icon
    children: [
      { title: '운동 경로 보기', to: 'exercise-recommend', icon: { icon: 'mdi-map-check' } }, //test폴더 안의 test.vue 파일을 의미 아이콘 사용 불가
      { title: '운동 자세 분석', to: 'exercise-pose', icon: { icon: 'mdi-dumbbell' } }, //test폴더 안의 test2.vue 파일을 의미
    ],
  },
]
