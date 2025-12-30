import management from "./management"

let myRouteCounter =0
let friendRouteCounter =0
let postRouteCounter =0
let chatRouteCounter =0
let mateRouteCounter =0
let challRouteCounter =0
let selfRouteCounter =0

export default [
  {
    title: '마이페이지',
    icon: { icon: 'mdi-face-man-shimmer-outline' },
    to: { name: 'apps-user-view-id', params: { id: 22 }  },
    meta: { counter: myRouteCounter++ },
  },

  {
    title: '커뮤니티',
    icon: { icon: 'mdi-account-group-outline' },
    children: [
      { title: '친구 / 구독자 관리 페이지', to: { name: 'community-user-tab', meta: { counter: friendRouteCounter++ }, params: { tab: 'friend' } }, icon: { icon: 'mdi-account-multiple-plus'  } },
      { title: '게시판', meta: { counter: postRouteCounter++ }, to: { name: 'community_post' }, icon: { icon: 'mdi-instagram'  } },
      { title: '채팅', meta: { counter: chatRouteCounter++ }, to: { name: 'apps-chat' }, icon: { icon: 'mdi-message-text'  } },
      { title: '메이트', meta: { counter: mateRouteCounter++ }, to: { name: 'mateList' }, icon: { icon: 'mdi-crowd'  } },
      { title: '챌린지', meta: { counter: challRouteCounter++ }, to: { name: 'challengeList' }, icon: { icon: 'mdi-charity'  } },
    ],
  },
  
  {
    title: '자가진단',
    to: { name: 'selfTest' },
    icon: { icon: 'mdi-account-check-outline' },
    meta: { counter: selfRouteCounter++ },
  },

  ...management,

  
]
