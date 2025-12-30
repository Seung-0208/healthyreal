// ** Mock Adapter
import mock from '@/@fake-db/mock'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import eventLabel from '@images/icons/project-icons/event.png'
import figmaLabel from '@images/icons/project-icons/figma.png'
import htmlLabel from '@images/icons/project-icons/html5.png'
import reactLabel from '@images/icons/project-icons/react.png'
import socialLabel from '@images/icons/project-icons/social.png'
import supportLabel from '@images/icons/project-icons/support.png'
import twitterLabel from '@images/icons/project-icons/twitter.png'
import vueLabel from '@images/icons/project-icons/vue.png'
import xdLabel from '@images/icons/project-icons/xd.png'
import UserProfileHeaderBg from '@images/pages/user-profile-header-bg.png'

const data = {
  profileHeader: {
    fullName: 'John Doe',
    location: 'Vatican City',
    joiningDate: 'April 2021',
    designation: 'UX Designer',
    profileImg: avatar1,
    coverImg: UserProfileHeaderBg,
  },
  profile: {
    about: [
      { property: 'Full Name', value: 'John Doe', icon: 'mdi-account-outline' },
      { property: 'Status', value: 'active', icon: 'mdi-check' },
      { property: 'Role', value: 'Developer', icon: 'mdi-star-outline' },
      { property: 'Country', value: 'USA', icon: 'mdi-flag-outline' },
      { property: 'Language', value: 'English', icon: 'mdi-translate' },
    ],
    contacts: [
      { property: 'Contact', value: '(123) 456-7890', icon: 'mdi-phone-outline' },
      { property: 'Skype', value: 'john.doe', icon: 'mdi-message-outline' },
      { property: 'Email', value: 'john.doe@example.com', icon: 'mdi-email-outline' },
    ],
    teams: [
      { property: 'Backend Developer', value: '(126 Members)', icon: 'mdi-github', color: 'primary' },
      { property: 'VueJS Developer', value: '(98 Members)', icon: 'mdi-vuejs', color: 'success' },
    ],
    overview: [
      { property: 'Task Compiled', value: '13.5k', icon: 'mdi-check' },
      { property: 'Connections', value: '897', icon: 'mdi-account-outline' },
      { property: 'Projects Compiled', value: '146', icon: 'mdi-view-grid-plus-outline' },
    ],
    connections: [
      {
        isFriend: false,
        connections: '45',
        name: 'Cecilia Payne',
        avatar: avatar2,
      },
      {
        isFriend: true,
        connections: '1.32k',
        name: 'Curtis Fletcher',
        avatar: avatar3,
      },
      {
        isFriend: true,
        connections: '125',
        name: 'Alice Stone',
        avatar: avatar4,
      },
      {
        isFriend: false,
        connections: '456',
        name: 'Darrell Barnes',
        avatar: avatar5,
      },
      {
        isFriend: false,
        connections: '1.2k',
        name: 'Eugenia Moore',
        avatar: avatar8,
      },
    ],
    teamsTech: [
      {
        members: 72,
        ChipColor: 'error',
        chipText: 'Developer',
        title: 'React Developers',
        avatar: reactLabel,
      },
      {
        members: 122,
        chipText: 'Support',
        ChipColor: 'primary',
        title: 'Support Team',
        avatar: supportLabel,
      },
      {
        members: 7,
        ChipColor: 'info',
        chipText: 'Designer',
        title: 'UI Designer',
        avatar: figmaLabel,
      },
      {
        members: 289,
        ChipColor: 'error',
        chipText: 'Developer',
        title: 'Vue.js Developers',
        avatar: vueLabel,
      },
      {
        members: 24,
        chipText: 'Marketing',
        ChipColor: 'secondary',
        title: 'Digital Marketing',
        avatar: twitterLabel,
      },
    ],
  },
  teams: [
    {
      extraMembers: 25,
      title: 'React Developers',
      avatar: reactLabel,
      avatarGroup: [
        { avatar: avatar1, name: 'Vinnie Mostowy' },
        { avatar: avatar2, name: 'Allen Rieske' },
        { avatar: avatar3, name: 'Julee Rossignol' },
        { avatar: avatar4, name: 'George Burrill' },
      ],
      description: 'We don’t make assumptions about the rest of your technology stack, so you can develop new features in React.',
      chips: [
        {
          title: 'React',
          color: 'primary',
        },
        {
          title: 'MUI',
          color: 'info',
        },
      ],
    },
    {
      extraMembers: 15,
      title: 'Vue.js Dev Team',
      avatar: vueLabel,
      avatarGroup: [
        { avatar: avatar5, name: 'Kaith D\'souza' },
        { avatar: avatar6, name: 'John Doe' },
        { avatar: avatar7, name: 'Alan Walker' },
        { avatar: avatar8, name: 'Calvin Middleton' },
      ],
      description: 'The development of Vue and its ecosystem is guided by an international team, some of whom have chosen to be featured below.',
      chips: [
        {
          title: 'Vuejs',
          color: 'success',
        },
        {
          color: 'error',
          title: 'Developer',
        },
      ],
    },
    {
      extraMembers: 55,
      title: 'Creative Designers',
      avatar: xdLabel,
      avatarGroup: [
        { avatar: avatar1, name: 'Jimmy Ressula' },
        { avatar: avatar2, name: 'Kristi Lawker' },
        { avatar: avatar3, name: 'Danny Paul' },
        { avatar: avatar4, name: 'Alicia Littleton' },
      ],
      description: 'A design or product team is more than just the people on it. A team includes the people, the roles they play.',
      chips: [
        {
          title: 'Sketch',
          color: 'warning',
        },
        {
          title: 'XD',
          color: 'error',
        },
      ],
    },
    {
      extraMembers: 35,
      title: 'Support Team',
      avatar: supportLabel,
      avatarGroup: [
        { avatar: avatar5, name: 'Andrew Tye' },
        { avatar: avatar6, name: 'Rishi Swaat' },
        { avatar: avatar7, name: 'Rossie Kim' },
        { avatar: avatar8, name: 'Mary Hunter' },
      ],
      description: 'Support your team. Your customer support team is fielding the good, the bad, and the ugly day in and day out.',
      chips: [
        {
          color: 'info',
          title: 'Zendesk',
        },
      ],
    },
    {
      extraMembers: 19,
      title: 'Digital Marketing',
      avatar: socialLabel,
      avatarGroup: [
        { avatar: avatar1, name: 'Kim Merchent' },
        { avatar: avatar2, name: 'Sam D\'souza' },
        { avatar: avatar3, name: 'Nurvi Karlos' },
        { avatar: avatar4, name: 'Margorie Whitmire' },
      ],
      description: 'Digital marketing refers to advertising delivered through digital channels such as search engines, websites…',
      chips: [
        {
          color: 'primary',
          title: 'Twitter',
        },
        {
          title: 'Email',
          color: 'success',
        },
      ],
    },
    {
      title: 'Event',
      extraMembers: 55,
      avatar: eventLabel,
      avatarGroup: [
        { avatar: avatar5, name: 'Vinnie Mostowy' },
        { avatar: avatar6, name: 'Allen Rieske' },
        { avatar: avatar7, name: 'Julee Rossignol' },
        { avatar: avatar8, name: 'Daniel Long' },
      ],
      description: 'Event is defined as a particular contest which is part of a program of contests. An example of an event is the long…',
      chips: [
        {
          title: 'Hubilo',
          color: 'success',
        },
      ],
    },
    {
      extraMembers: 45,
      title: 'Figma Resources',
      avatar: figmaLabel,
      avatarGroup: [
        { avatar: avatar1, name: 'Andrew Mostowy' },
        { avatar: avatar2, name: 'Micky Ressula' },
        { avatar: avatar3, name: 'Michel Pal' },
        { avatar: avatar4, name: 'Herman Lockard' },
      ],
      description: 'Explore, install, use, and remix thousands of plugins and files published to the Figma Community by designers and developers.',
      chips: [
        {
          title: 'UI/UX',
          color: 'success',
        },
        {
          title: 'Figma',
          color: 'secondary',
        },
      ],
    },
    {
      extraMembers: 50,
      title: 'Only Beginners',
      avatar: htmlLabel,
      avatarGroup: [
        { avatar: avatar5, name: 'Kim Karlos' },
        { avatar: avatar6, name: 'Katy Turner' },
        { avatar: avatar7, name: 'Peter Adward' },
        { avatar: avatar8, name: 'Leona Miller' },
      ],
      description: 'Learn the basics of how websites work, front-end vs back-end, and using a code editor. Learn basic HTML, CSS, and…',
      chips: [
        {
          title: 'CSS',
          color: 'info',
        },
        {
          title: 'HTML',
          color: 'warning',
        },
      ],
    },
  ],
  projects: [
    {
      title: '건강한 나를 위한 챌린지1', //챌린지 제목
      startDate: '24/1/12', //시작일
      deadline: '24/3/01', //종료일
      client: 'HealthyReal', //방장
      pay: 5000, //참가비
      members: 4, //참여인원
      totalTask: 344,
      tasks: '290/344',
      completedTask: 328,
      avatar: socialLabel,
      percent:50,
      description: '설명란입니다.',
      avatarGroup: [ //참여자 정보
        { avatar: avatar1, name: 'Vinnie Mostowy' },
        { avatar: avatar2, name: 'Allen Rieske' },
        { avatar: avatar3, name: 'Julee Rossignol' },
      ],
    },
    {
      title: '건강한 나를 위한 챌린지2', //챌린지 제목
      startDate: '24/1/20', //시작일
      deadline: '24/4/01', //종료일
      client: 'HealthyReal', //방장
      pay: 5000, //참가비
      members: 4, //참여인원
      totalTask: 344,
      tasks: '290/344',
      completedTask: 328,
      avatar: socialLabel,
      percent:50,
      description: '설명란입니다.',
      avatarGroup: [ //참여자 정보
        { avatar: avatar1, name: 'Vinnie Mostowy' },
        { avatar: avatar2, name: 'Allen Rieske' },
        { avatar: avatar3, name: 'Julee Rossignol' },
      ],
    },
    {
      title: '건강한 나를 위한 챌린지3', //챌린지 제목
      startDate: '24/2/01', //시작일
      deadline: '24/6/01', //종료일
      client: 'HealthyReal', //방장
      pay: 5000, //참가비
      members: 4, //참여인원
      totalTask: 344,
      tasks: '290/344',
      completedTask: 328,
      avatar: socialLabel,
      percent:50,
      description: '설명란입니다.',
      avatarGroup: [ //참여자 정보
        { avatar: avatar1, name: 'Vinnie Mostowy' },
        { avatar: avatar2, name: 'Allen Rieske' },
        { avatar: avatar3, name: 'Julee Rossignol' },
      ],
    },
    {
      title: '건강한 나를 위한 챌린지4', //챌린지 제목
      startDate: '24/1/11', //시작일
      deadline: '24/2/01', //종료일
      client: 'HealthyReal', //방장
      pay: 5000, //참가비
      members: 4, //참여인원
      totalTask: 344,
      tasks: '290/344',
      completedTask: 328,
      avatar: socialLabel,
      percent:50,
      description: '설명란입니다.',
      avatarGroup: [ //참여자 정보
        { avatar: avatar1, name: 'Vinnie Mostowy' },
        { avatar: avatar2, name: 'Allen Rieske' },
        { avatar: avatar3, name: 'Julee Rossignol' },
      ],
    },
  ],
  connections: [
    {
      tasks: '834',
      projects: '18',
      isConnected: true,
      connections: '129',
      name: 'Mark Gilbert',
      designation: 'UI Designer',
      avatar: avatar1,
      chips: [
        {
          title: 'Figma',
          color: 'secondary',
        },
        {
          title: 'Sketch',
          color: 'warning',
        },
      ],
    },
    {
      tasks: '2.31k',
      projects: '112',
      isConnected: false,
      connections: '1.28k',
      name: 'Eugenia Parsons',
      designation: 'Developer',
      avatar: avatar2,
      chips: [
        {
          color: 'error',
          title: 'Angular',
        },
        {
          color: 'info',
          title: 'React',
        },
      ],
    },
    {
      tasks: '1.25k',
      projects: '32',
      isConnected: false,
      connections: '890',
      name: 'Francis Byrd',
      designation: 'Developer',
      avatar: avatar3,
      chips: [
        {
          title: 'HTML',
          color: 'primary',
        },
        {
          color: 'info',
          title: 'React',
        },
      ],
    },
    {
      tasks: '12.4k',
      projects: '86',
      isConnected: false,
      connections: '890',
      name: 'Leon Lucas',
      designation: 'UI/UX Designer',
      avatar: avatar4,
      chips: [
        {
          title: 'Figma',
          color: 'secondary',
        },
        {
          title: 'Sketch',
          color: 'warning',
        },
        {
          color: 'primary',
          title: 'Photoshop',
        },
      ],
    },
    {
      tasks: '23.8k',
      projects: '244',
      isConnected: true,
      connections: '2.14k',
      name: 'Jayden Rogers',
      designation: 'Full Stack Developer',
      avatar: avatar5,
      chips: [
        {
          color: 'info',
          title: 'React',
        },
        {
          title: 'HTML',
          color: 'warning',
        },
        {
          color: 'success',
          title: 'Node.js',
        },
      ],
    },
    {
      tasks: '1.28k',
      projects: '32',
      isConnected: false,
      designation: 'SEO',
      connections: '1.27k',
      name: 'Jeanette Powell',
      avatar: avatar6,
      chips: [
        {
          title: 'Analysis',
          color: 'secondary',
        },
        {
          color: 'success',
          title: 'Writing',
        },
      ],
    },
  ],
}

const projectTable = [
  {
    id: 1,
    status: 38,
    leader: 'Eileen',
    name: 'Website SEO',
    date: '10 may 2021',
    avatarColor: 'success',
    avatarGroup: [avatar1, avatar2, avatar3, avatar4],
  },
  {
    id: 2,
    status: 45,
    leader: 'Owen',
    date: '03 Jan 2021',
    name: 'Social Banners',
    avatar: socialLabel,
    avatarGroup: [avatar5, avatar6],
  },
  {
    id: 3,
    status: 92,
    leader: 'Keith',
    date: '12 Aug 2021',
    name: 'Logo Designs',
    avatar: '/images/icons/project-icons/sketch-label.png',
    avatarGroup: [avatar7, avatar8, avatar1, avatar2],
  },
  {
    id: 4,
    status: 56,
    leader: 'Merline',
    date: '19 Apr 2021',
    name: 'IOS App Design',
    avatar: '/images/icons/project-icons/sketch-label.png',
    avatarGroup: [avatar3, avatar4, avatar5, avatar6],
  },
  {
    id: 5,
    status: 25,
    leader: 'Harmonia',
    date: '08 Apr 2021',
    name: 'Figma Dashboards',
    avatar: figmaLabel,
    avatarGroup: [avatar7, avatar8, avatar1],
  },
  {
    id: 6,
    status: 36,
    leader: 'Allyson',
    date: '29 Sept 2021',
    name: 'Crypto Admin',
    avatar: htmlLabel,
    avatarGroup: [avatar2, avatar3, avatar4, avatar5],
  },
  {
    id: 7,
    status: 72,
    leader: 'Georgie',
    date: '20 Mar 2021',
    name: 'Create Website',
    avatar: reactLabel,
    avatarGroup: [avatar6, avatar7, avatar8, avatar1],
  },
  {
    id: 8,
    status: 89,
    leader: 'Fred',
    date: '09 Feb 2021',
    name: 'App Design',
    avatar: xdLabel,
    avatarGroup: [avatar2, avatar3, avatar4, avatar5],
  },
  {
    id: 9,
    status: 77,
    leader: 'Richardo',
    date: '17 June 2021',
    name: 'Angular APIs',
    avatar: figmaLabel,
    avatarGroup: [avatar6, avatar7, avatar8, avatar1],
  },
  {
    id: 10,
    status: 100,
    leader: 'Genevra',
    date: '06 Oct 2021',
    name: 'Admin Template',
    avatar: vueLabel,
    avatarGroup: [avatar2, avatar3, avatar4, avatar5],
  },
]

mock.onGet('/pages/profile').reply(config => {
  const { tab = '' } = config.params ?? ''
  
  return [200, data[tab]]
})
mock.onGet('/pages/profile-header').reply(() => {
  return [200, data.profileHeader]
})
mock.onGet('/pages/profile-table').reply(config => {
  const { q = '' } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = projectTable.filter(row => {
    return (row.name.toLowerCase().includes(queryLowered)
            || row.date.toLowerCase().includes(queryLowered)
            || row.leader.toLowerCase().includes(queryLowered))
  })

  return [200, filteredData]
})
