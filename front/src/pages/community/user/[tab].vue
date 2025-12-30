<script setup>
import UserProfileHeader from '@/views/pages/user-profile/UserProfileHeader.vue'
import Friend from '@/views/pages/user-profile/friend/index.vue'
import Mate from '@/views/pages/user-profile/mate/index.vue'
import Subscriber from '@/views/pages/user-profile/subscriber/index.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab)
const selectedSwitch = ref(['Primary'])
const switches = ref(['Primary'])
const text = ref(['추천보기'])

// 탭
const tabs = [
  {
    title: '친구',
    icon: 'mdi-account-group-outline',
    tab: 'friend',
  },
  {
    title: '메이트',
    icon: 'mdi-account-group-outline',
    tab: 'mate',
  },
  {
    title: '구독자',
    icon: 'mdi-account-outline',
    tab: 'subscriber',
  },
]
</script>

<template>
  <div>
    <UserProfileHeader class="mb-6" />

    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'community-user-tab', params: { tab: item.tab } }"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
      <!--
        <VSwitch
        v-for="item in switches"
        :key="item"
        v-model="selectedSwitch"
        style="margin-left: auto;"
        :label="text"
        :value="item"
        :color="item.toLowerCase()"
        />
      -->
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <VWindowItem value="friend">
        <Friend />
      </VWindowItem>

      <VWindowItem value="mate">
        <Mate />
      </VWindowItem>

      <VWindowItem value="subscriber">
        <Subscriber />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: community-user-tab
</route>
