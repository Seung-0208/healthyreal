
export default [
  {
    title: '커뮤니티',
    icon: { icon: 'mdi-account-group-outline' },
    children: [
      { title: '친구 / 구독자 관리 페이지', to: { name: 'community-user-tab', params: { tab: 'friend' } } },
      { title: '챌린지목록', to: { name: 'apps-challengeList' }, icon: { icon: 'mdi-message-outline'  } },
      { title: '채팅', to: { name: 'apps-chat' }, icon: { icon: 'mdi-message-outline'  } },
      { title: '챌린지', to: { name: 'apps-user-challenge-id', params: { id: 21 } }, icon: { icon: 'mdi-crowd'  } },
      { title: '게시판', to: { name: 'community_post' }, icon: { icon: 'mdi-instagram'  } },
    ],
  },
]
