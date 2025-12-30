
export default [
  {
    title: '식단',
    icon: { icon: 'mdi-food-fork-drink' }, // icon
    children: [
      { title: '식단 기록하기', to: 'diet-dietRecord', icon: { icon: 'mdi-pencil-plus-outline'  } }, //test폴더 안의 test.vue 파일을 의미 아이콘 사용 불가
      { title: '식단 추천받기', to: 'dietFood', icon: { icon: 'mdi-cookie-refresh-outline'  } },
    ],
  },
]
