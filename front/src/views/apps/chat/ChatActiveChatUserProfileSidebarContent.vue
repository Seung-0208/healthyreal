<script setup>
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { avatarText } from '@core/utils/formatters'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useChat } from './useChat'

const emit = defineEmits(['close'])

const store = useChatStore()
const { resolveAvatarBadgeVariant } = useChat()
</script>

<template>
  <template v-if="store.activeChat">
    <!-- 사용자 아이콘 눌렀을 때 닫기버튼 -->
    <div
      class="pt-2 me-2"
      :class="$vuetify.locale.isRtl ? 'text-left' : 'text-right'"
    >
      <IconBtn @click="$emit('close')">
        <VIcon
          icon="mdi-close"
          class="text-medium-emphasis"
        />
      </IconBtn>
    </div>

    <!-- 사용자 프로필 정보 표시 -->
    <div class="text-center px-6">
      <!-- 사용자 아바타 + 이름 + 역할 -->
      <VBadge
        location="bottom right"
        offset-x="7"
        offset-y="4"
        bordered
        :color="resolveAvatarBadgeVariant(store.activeChat.contact.status)"
        class="chat-user-profile-badge mb-4"
      >
        <VAvatar
          size="84"
          :variant="!store.activeChat.contact.avatar ? 'tonal' : undefined"
          :color="!store.activeChat.contact.avatar ? resolveAvatarBadgeVariant(store.activeChat.contact.status) : undefined"
        >
          <VImg
            v-if="store.activeChat.contact.avatar"
            :src="store.activeChat.contact.avatar"
          />
          <span
            v-else
            class="text-3xl"
          >{{ avatarText(store.activeChat.contact.fullName) }}</span>
        </VAvatar>
      </VBadge>
      <h2 class="mb-1 font-weight-medium text-high-emphasis text-base">
        {{ store.activeChat.contact.fullName }}
      </h2>
      <p class="text-capitalize text-sm text-medium-emphasis">
        {{ store.activeChat.contact.role }}
      </p>
    </div>

    <!-- User Data -->
    <PerfectScrollbar
      class="ps-chat-user-profile-sidebar-content text-medium-emphasis pb-5 px-5"
      :options="{ wheelPropagation: false }"
    >
      <!-- About -->
      <div class="mt-8 mb-6">
        <span
          for="textarea-user-about"
          class="text-sm text-disabled"
        >자기소개</span>
        <p class="mt-1 text-sm">
          {{ store.activeChat.contact.about }}
        </p>
      </div>

      <!-- Personal Information -->
      <div class="mb-8">
        <span class="d-block text-sm text-disabled mb-3">사용자 정보</span>
        <div class="d-flex align-center">
          <VIcon
            class="me-2"
            icon="mdi-email-outline"
          />
          <span class="text-sm">lucifer@email.com</span>
        </div>
        <div class="d-flex align-center text-sm my-4">
          <VIcon
            class="me-2"
            icon="mdi-phone-outline"
          />
          <span>+1(123) 456 - 7890</span>
        </div>
        <div class="d-flex align-center text-sm">
          <VIcon
            class="me-2"
            icon="mdi-clock-outline"
          />
          <span>Mon - Fri 10AM - 8PM</span>
        </div>
      </div>

      <!-- 사용자 프로필 눌렀을 때 기능들 -->
      <div>
        <span class="d-block text-sm text-disabled mb-3">추가 기능</span>
        <div class="d-flex align-center">
          <VIcon
            class="me-2"
            icon="mdi-bookmark-outline"
          />
          <span class="text-sm">구독하기</span>
        </div>
        <div class="d-flex align-center my-3">
          <VIcon
            class="me-2"
            icon="mdi-star-outline"
          />
          <span class="text-sm">즐겨찾기</span>
        </div>
        <div class="d-flex align-center mb-3">
          <VIcon
            class="me-2"
            icon="mdi-image-outline"
          />
          <span class="text-sm">공유하기</span>
        </div>
        <div class="d-flex align-center mb-3">
          <VIcon
            class="me-2"
            icon="mdi-trash-can-outline"
          />
          <span class="text-sm">친구 삭제하기</span>
        </div>
        <div class="d-flex align-center">
          <VIcon
            class="me-3 ms-1"
            size="16"
            icon="mdi-block-helper"
          />
          <span class="text-sm">차단하기</span>
        </div>
      </div>
    </PerfectScrollbar>
  </template>
</template>
