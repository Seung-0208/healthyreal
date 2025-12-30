<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  choicecategory: {
    type: String,
    required: true,
  },
  dietPlansListtype: {
    type: Number,
    required: true,
  },
})


const emit = defineEmits(['update:isDialogVisible'])

const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'
const currentTab = ref('tab-1')
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 340"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <VTabs
        v-model="currentTab"
        align-tabs="center"
        class="v-tabs-pill"
        style="margin: 10px;"
      >
        <VTab
          block
          @click="$emit('update:choicecategory', {choicecategory:'전체', dietType:dietPlansListtype})"
        >
          <VIcon icon="mdi-food" />
          <span>전체</span>
        </VTab>
      </VTabs>
      <VTabs
        v-model="currentTab"
        class="v-tabs-pill"
        style="margin: 5px 20px;"
      >
        <VTab
          style="width: 40px;margin: 0 5px;"
          value="tab-1"
          @click="$emit('update:choicecategory', {choicecategory:'육류', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-food-steak"
            class="mb-2"
          />
          <span>육류</span>
        </VTab>
      
        <VTab
          style="width: 40px;margin: 0 5px;"
          value="tab-2"
          @click="$emit('update:choicecategory', {choicecategory:'양식', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-bread-slice"
            class="mb-2"
          />
          <span>양식</span>
        </VTab>
        
        <VTab
          style="width: 40px;margin: 0 5px;"
          value="tab-3"
          @click="$emit('update:choicecategory', {choicecategory:'다이어트', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-egg-fried"
            class="mb-2"
          />
          <span>감량</span>
        </VTab>
      </VTabs>
      <VTabs
        v-model="currentTab"
        class="v-tabs-pill"
        style="margin: 0 20px;"
      >
        <VTab
          value="tab-4"
          style="width: 40px;margin: 0 5px;"
          @click="$emit('update:choicecategory', {choicecategory:'영양식', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-seed"
            class="mb-2"
          />
          <span>영양</span>
        </VTab>
      
        <VTab
          style="width: 40px;margin: 0 5px;"
          value="tab-5"
          @click="$emit('update:choicecategory', {choicecategory:'일상', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-land-plots-circle-variant"
            class="mb-2"
          />
          <span>일상</span>
        </VTab>
        
        <VTab
          style="width: 40px;margin: 0 5px;"
          value="tab-6"
          @click="$emit('update:choicecategory', {choicecategory:'찌개', dietType:dietPlansListtype})"
        >
          <VIcon
            icon="mdi-beer"
            class="mb-2"
          />
          <span>찌개</span>
        </VTab>
      </VTabs>
    </VCard>
  </VDialog>
</template>
          