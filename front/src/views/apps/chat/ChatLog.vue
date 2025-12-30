<script setup>
import useDatabase from '@/views/apps/chat/chatData.js'
import { formatDate } from '@core/utils/formatters'
import { computed, defineProps } from 'vue'


const props = defineProps({
  newChat: {
    type: Object,
    required: true,
  },
  receivedMessage: {
    type: Object,
    required: true,
  },
})

const { activeChat, database, connetId, connetAv } = useDatabase()

console.log("activeChat------------")
console.log(activeChat) //내가 받은 메세지
console.log("datavbase------------")
console.log(database)
console.log("props.newChat------------------")
console.log(props.newChat) //내가 보낸 메세지
console.log("props.receivedMessage------------------")
console.log(props.receivedMessage) //내가 보낸 메세지

const contact = computed(() => {
  if (activeChat.value) {
    return {
      id: activeChat.value.messages.senderId,
      avatar: props.newChat?.contact?.avatar,
    }
  } else {
    return {
      id: null,
      avatar: null,
    }
  }
})

const resolveFeedbackIcon = feedback => {
  if (feedback.isSeen)
    return {
      icon: 'mdi-check-all',
      color: 'success',
    }
  else if (feedback.isDelivered)
    return {
      icon: 'mdi-check-all',
      color: undefined,
    }
  else
    return {
      icon: 'mdi-check',
      color: undefined,
    }
}

function computeMsgGroups(messages) {
  const _msgGroups = []


  // 메시지 그룹 합치기 및 정렬
  messages.sort((a, b) => new Date(a.time) - new Date(b.time))
  messages = messages
    .filter(msg => msg.senderId === props.newChat?.contact?.id || msg.senderId === connetId)
    .map(msg => ({ ...msg }))

  let msgSenderId = messages[0]?.senderId
  let msgGroup = {
    senderId: msgSenderId,
    messages: [],
  }

  messages.forEach((msg, index) => {
    if (msg.message.trim() === '') {
      return
    }

    if (msgSenderId === msg.senderId) {
      msgGroup.messages.push(msg)
    } else {
      _msgGroups.push(msgGroup) // 이전 그룹을 _msgGroups에 추가
      msgSenderId = msg.senderId // 새로운 그룹의 senderId를 설정
      msgGroup = {
        // 새로운 그룹을 시작
        senderId: msgSenderId,
        messages: [msg], // 현재 메시지를 새로운 그룹에 추가
      }
    }

    // 마지막 메시지인 경우, 현재 그룹을 _msgGroups에 추가
    if (index === messages.length - 1) {
      _msgGroups.push(msgGroup)
    }
  })

  return _msgGroups
}

const msgGroups = computed(() => {
  let activeMessages = []
  let newMessages = []
  let reMessages = []

  if (activeChat.value && activeChat.value.messages) {
    activeMessages = activeChat.value.messages.map(msg => ({
      ...msg,
      senderId: msg.senderId,
    }))
  }

  if (props.newChat?.chat && props.newChat.chat.messages) {
    newMessages = props.newChat.chat.messages.map(msg => ({
      ...msg,
      senderId: msg.senderId,
    }))
  }
  if (props.receivedMessage) {
    reMessages = props.receivedMessage.map(msg => ({
      ...msg,
      senderId: msg.senderId,
    }))
  }

  let messages = [...activeMessages, ...newMessages, ...reMessages]

  console.log(JSON.stringify(messages, null, 2));

  return computeMsgGroups(messages)
})

</script>

<template>
  <div class="chat-log pa-5">
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start"
      :class="[{
        'flex-row-reverse': msgGrp.senderId == connetId,
        'mb-8': msgGroups.length - 1 !== index,
      }]"
    >
      <div
        class="chat-avatar"
        :class="msgGrp.senderId == connetId ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg :src="msgGrp.senderId !== connetId ? contact.avatar : connetAv" />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="msgGrp.senderId == connetId ? 'align-end' : 'align-start'"
      >
        <p
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgData.time"
          class="chat-content text-sm py-3 px-4 elevation-1"
          :class="[
            msgGrp.senderId !== connetId ? 'bg-surface chat-left' : 'bg-primary text-white chat-right',
            msgGrp.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1',
          ]"
        >
          {{ msgData.message }}
        </p>
        <div :class="{ 'text-right': msgGrp.senderId == connetId }">
          <span class="text-xs me-1 text-disabled">{{ formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, { hour: 'numeric', minute: 'numeric' }) }}</span>
          <VIcon
            v-if="msgGrp.senderId == connetId"
            size="16"
            :color="resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).color"
          >
            {{ resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).icon }}
          </VIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=scss>
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}
</style>
