import axios from '@axios'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default function useDatabase() {
  const store = useStore()
  const userInfo = computed(() => store.state.userStore.userInfo)
  const connetId = userInfo.value.id
  const connetAv = userInfo.value.pro_filepath
  const isLoggedIn = computed(() => store.state.loginStore.isLogin)

  console.log("-----------------connetAv---------------------")

  console.log(connetAv)


  const database = ref({
    profileUser: {
      id: null,
      avatar: null,
      fullName: null,
      status: null,
    },
    contacts: [],  // 친구 목록을 저장할 배열
    chats: [],
    isLoading: true,
  })

  const chatsContacts = computed(() => {
    if (!Array.isArray(database.value.chats)) {
      return []
    }
  
    return database.value.chats.map(chat => {
      const contact = database.value.contacts.find(c => c.id === chat.userId)
  
      if (!contact) {
        return null 
      }
  
      const deepCopiedContact = JSON.parse(JSON.stringify(contact))
  
      deepCopiedContact.chat = { id: chat.id, unseenMsgs: chat.unseenMsgs, lastMessage: chat.messages.at(-1) }
      
      return deepCopiedContact
    }).filter(contact => contact !== null).reverse()
  })
  

  let activeChat = computed(() => 
    database.value.chats.find(chat => chat.userId === connetId),
  )


  async function fetchDatabase(userId) {
    try {
  
      const response = await axios.get("/comm/profile", { params: { id: userId } })
  
      if (response.data) {
        database.value.profileUser.id = userId
        database.value.profileUser.avatar = response.data.profilePath
        database.value.profileUser.fullName = response.data.name
        database.value.profileUser.status = isLoggedIn

        //console.log("database.profileUser.id", database.value.profileUser.id)
        //console.log("database.profileUser.avatar", database.value.profileUser.avatar)
        //console.log("database.profileUser.fullName", database.value.profileUser.fullName)
      }
    } catch (error) {
      console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
    }
  }


  async function allData(userId) {
    try {
  
      const response = await axios.get("/chat/allChating.do", { params: { id: userId } })
  
      if (response.data && Array.isArray(response.data)) {
  
        const newChats = [...database.value.chats]
  
        response.data.forEach((item, index) => {
          // 해당 userId를 가진 채팅 찾기
          const chat = newChats.find(chat => chat.userId === item.ruser)
  
          if (chat) {
            // 채팅이 존재하면 메시지 추가
            chat.messages.push({
              message: item.content,
              time: item.sendDate,
              senderId: item.id,
              feedback: {
                isSent: true,
                isDelivered: true,
                isSeen: false,
              },
            })
          } else {
            // 채팅이 존재하지 않으면 새 채팅 추가
            newChats.push({
              userId: item.ruser,
              unseenMsgs: 0,
              fullName: item.name,
              messages: [
                {
                  message: item.content,
                  time: item.sendDate,
                  senderId: item.id,
                  feedback: {
                    isSent: true,
                    isDelivered: true,
                    isSeen: false,
                  },
                },
              ],
            })
          }
        })
  
        database.value = { ...database.value, chats: newChats }
      }
  
    } catch (error) {
      console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
    }
  }
  

  async function fetchFriendDatabase(userId) {
    try {
      const response = await axios.get("/comm/friend", { params: { id: userId } })
      
      if (response.data && Array.isArray(response.data)) {

        const newContacts = [...database.value.contacts]

        response.data.forEach(item => {
          newContacts.push({
            id: item.friend_id,
            avatar: item.profilePath,
            fullName: item.name,
            status: 'online',
          })
        })

        database.value = { ...database.value, contacts: newContacts }
      }
    } catch (error) {
      console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
    }
  }

  onMounted(async () => {
    try {
      await Promise.all([
        fetchDatabase(connetId),
        fetchFriendDatabase(connetId),
        allData(connetId),
      ])

      database.value = { ...database.value, isLoading: false }
    } catch (error) {
      console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
      database.value = { ...database.value, isLoading: false }
    }
  })
  


  return {
    database,
    fetchDatabase,
    fetchFriendDatabase,
    allData,
    chatsContacts,
    connetId,
    activeChat,
    connetAv,
  }
}

// 다른 컴포넌트에서 사용할 때
//import useDatabase from '@/views/apps/chat/chatData.js'
//const { database, fetchDatabase, fetchFriendDatabase, allData, chatsContacts, connetId, activeChat, connetAv } = useDatabase()
