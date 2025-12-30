<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'
import backgroundimg from '@images/pages/writing.jpg'
import { ref } from 'vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  postToEdit: {
    type: Object,
    default: () => ({}),
  },
  comments: {
    type: Array,
    required: true,
  },
  bno: {
    type: Number,
    required: true,
  },
  openUserProfileModal: {
    type: Function,
    required: true,
  },
  insertComment: {
    type: Function,
    required: true,
  },
  searchuser: {
    type: String,
    required: true,
  },
  getComment: {
    type: Function,
    required: true,
  },
  likespro: {
    type: Array,
    required: true,
  },
  likesuser: {
    type: Array,
    required: true,
  },
})

const commentval = ref()
let commentAddevent = ref(false)

const commentAdd = (event, val) => {
  commentAddevent.value = !commentAddevent.value
}

const newcomment = ref()
let parentcomm = ref(0)


const parent_comment = val => {
  console.log('클릭한 댓글:', val)
  parentcomm.value = val
  console.log(parentcomm)
}

const toggleComment = (comment, comments) => {
  // 다른 댓글들의 clicked 속성 초기화
  comments.forEach(c => {
    if (c !== comment) {
      c.clicked = false
    }
  })

  // 현재 클릭된 댓글의 clicked 속성 토글
  comment.clicked = !comment.clicked

  // commentAddevent 속성 토글
  comments.forEach(c => {
    if (c === comment) {
      c.commentAddevent = !c.commentAddevent
    } else {
      c.commentAddevent = false
    }
  })
}

const editMode = ref(false)

const actionType = async (typeNo, C_NO, val) => {
  const params = {
    c_no: C_NO,
  }

  if (typeNo == 1) {
    params.ccomment = val
    await axios.put(`/commentline/Edit.do`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      // 성공적으로 업데이트되었을 때의 처리
      console.log('성공')
      props.getComment()
    }).catch(error => {
      // 업데이트 중 오류가 발생했을 때의 처리
      console.log('실패', error)
    })
  }
  else if (typeNo == 2) {
    await axios.delete(`/commentline/Delete.do`, {
      params: params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      // 성공적으로 업데이트되었을 때의 처리
      console.log('성공')
      props.getComment()
    }).catch(error => {
      // 업데이트 중 오류가 발생했을 때의 처리
      console.log('실패', error)
    })
  }
}
</script>

<template>
  <section>
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 1100" :model-value="props.isDialogVisible"
      @update:model-value="dialogVisibleUpdate">
      <!-- 닫기 버튼 -->
      <VBtn icon @click="$emit('update:isDialogVisible', false)">
        <VIcon>mdi-close</VIcon>
      </VBtn>
      <VCol cols="12">
        <VCard width="90rem" height="150%" style="margin: auto;">
          <VRow>
            <VCol cols="6" style="margin: auto;">
              <VCol v-if="postToEdit.files && postToEdit.files.length == 1" class="transparent-carousel"
                show-arrows-on-hover color="success">
                <VCol v-for="(img, index) in postToEdit.files" :key="index">
                  <VImg :src="img" style="margin-top: 15%;" />
                </VCol>
              </VCol>
              <VImg v-if="postToEdit.files && postToEdit.files.length == 0" :src="backgroundimg" />
              <VCarousel v-if="postToEdit.files && postToEdit.files.length >= 2" class="transparent-carousel"
                show-arrows-on-hover color="success" cycle interval="2000">
                <VCarouselItem v-for="(img, index) in postToEdit.files" :key="index">
                  <VImg :src="img" />
                </VCarouselItem>
              </VCarousel>
            </VCol>
            <VCol cols="6">
              <VRow>
                <VCol>
                  <VRow style="margin-top: 1%;">
                    <VCol cols="1">
                      <!-- image도 대표사진 받아와서 뿌려야합니다 -->
                      <VAvatar class="text-sm pointer-cursor" :image="postToEdit.profilepath"
                        @click="openUserProfileModal(postToEdit)" />
                    </VCol>
                    <VCol cols="6">
                      <VCol cols="12">
                        <VCardSubtitle class="text-sm pointer-cursor" :image="avatar1"
                          @click="openUserProfileModal(postToEdit.id)">
                          {{ postToEdit.id }} <!-- 유저 아이디 뿌려주기 -->
                        </VCardSubtitle>
                      </VCol>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="1">
                  <!-- -->
                </VCol>
                <VCol cols="10" style="height: 400px; margin-left: 10px;">
                  {{ postToEdit.content }}
                  <br>{{ postToEdit.hashTag }}
                  <VDivider />
                  <br>
                  <!-- 댓글 시작 -->
                  <div style="overflow: auto;width: 100%;height: 350px;font-size: 14px;" class="scrollbar">
                    <div v-if="comments">
                      <div v-for="comment in comments" :key="comment.C_NO">
                        <!-- 최상위 댓글 -->
                        <div v-if="comment.LEVEL == 1">
                          <VAlert border="start" color="success" variant="tonal" style="height: 50px; opacity: 0.8;"
                            :class="{ 'blink': comment.clicked && !editMode }"
                            @click="editMode ? null : (parent_comment(comment.C_NO), toggleComment(comment, comments))">
                            <div style="display: flex; justify-content: space-between;">
                              <div>
                                <VAvatar :image="comment.PRO_FILEPATH" style="padding: 5px;margin: 2px;"
                                  @click="openUserProfileModal(comment.ID)" />
                                <span style="margin-right: 10px;font-size: 12px;">{{ comment.ID }}</span>
                                <strong v-if="!comment.editMode">{{ comment.CCOMMENT }}</strong> <!-- 수정 모드가 아닐 때 -->
                                <input v-else v-model="comment.CCOMMENT" type="text"
                                  @keydown.enter="actionType(1, comment.C_NO, comment.CCOMMENT), comment.editMode = !comment.editMode">
                                <!-- 수정 모드일 때 -->
                              </div>
                              <VBtn v-if="searchuser === comment.ID" icon variant="text" size="small"
                                color="medium-emphasis">
                                <VIcon size="24" icon="mdi-dots-vertical" />

                                <VMenu activator="parent">
                                  <VList v-if="!comment.editMode">
                                    <VListItem @click="comment.editMode = !comment.editMode">
                                      <template #prepend>
                                        <VIcon icon="mdi-comment-edit-outline" />
                                      </template>
                                      <VListItemTitle>수정하기</VListItemTitle>
                                    </VListItem>

                                    <VListItem @click="actionType(2, comment.C_NO, 0)">
                                      <template #prepend>
                                        <VIcon icon="mdi-delete-outline" />
                                      </template>
                                      <VListItemTitle>삭제하기</VListItemTitle>
                                    </VListItem>
                                  </VList>
                                  <VList v-else>
                                    <VListItem @click=" comment.editMode = !comment.editMode">
                                      <template #prepend>
                                        <VIcon icon="mdi-comment-edit-outline" />
                                      </template>
                                      <VListItemTitle>수정 취소</VListItemTitle>
                                    </VListItem>
                                  </VList>
                                </VMenu>
                              </VBtn>
                            </div>
                          </VAlert>

                          <!-- 최상위 댓글에 댓글 달기 -->
                          <VAlert v-if="comment.commentAddevent" border="start" color="info" variant="tonal"
                            style="height: 50px;margin-left: 20px; opacity: 0.8;">
                            <VTextarea v-if="comment.commentAddevent" v-model="commentval" label="댓글달기" color="success"
                              rows="1" style="height: 55px; border: none;" variant="plain" no-resize
                              @keydown.enter="insertComment(bno, commentval, 2, parentcomm); commentval = ''; parentcomm = 0;" />
                          </VAlert>
                        </div>

                        <!-- 대댓글 이후 적용 코드 -->
                        <div v-else :style="{ marginLeft: (comment.LEVEL - 1) * 20 + 'px' }">
                          <VAlert border="start" color="info" variant="tonal" style="height: 50px; opacity: 0.8;"
                            :class="{ 'blink': comment.clicked && !comment.editMode, 'white-background': comment.editMode }"
                            @click="comment.editMode ? null : (parent_comment(comment.C_NO), toggleComment(comment, comments))">
                            <div style="display: flex; justify-content: space-between;">
                              <div>
                                <VAvatar :image="comment.PRO_FILEPATH" style="padding: 5px;margin: 2px;"
                                  @click="openUserProfileModal(comment.ID)" />
                                <span style="margin-right: 10px;font-size: 12px;">{{ comment.ID }}</span>
                                <strong v-if="!comment.editMode">{{ comment.CCOMMENT }}</strong> <!-- 수정 모드가 아닐 때 -->
                                <input v-else v-model="comment.CCOMMENT" type="text"
                                  @keydown.enter="actionType(1, comment.C_NO, comment.CCOMMENT), comment.editMode = !comment.editMode">
                                <!-- 수정 모드일 때 -->
                              </div>
                              <VBtn v-if="searchuser === comment.ID" icon variant="text" size="small"
                                color="medium-emphasis">
                                <VIcon size="24" icon="mdi-dots-vertical" />

                                <VMenu activator="parent">
                                  <VList v-if="!comment.editMode">
                                    <VListItem @click="comment.editMode = !comment.editMode">
                                      <template #prepend>
                                        <VIcon icon="mdi-comment-edit-outline" />
                                      </template>
                                      <VListItemTitle>수정하기</VListItemTitle>
                                    </VListItem>

                                    <VListItem @click="actionType(2, comment.C_NO, 0)">
                                      <template #prepend>
                                        <VIcon icon="mdi-delete-outline" />
                                      </template>
                                      <VListItemTitle>삭제하기</VListItemTitle>
                                    </VListItem>
                                  </VList>
                                  <VList v-else>
                                    <VListItem @click=" comment.editMode = !comment.editMode">
                                      <template #prepend>
                                        <VIcon icon="mdi-comment-edit-outline" />
                                      </template>
                                      <VListItemTitle>수정 취소</VListItemTitle>
                                    </VListItem>
                                  </VList>
                                </VMenu>
                              </VBtn>
                            </div>
                          </VAlert>

                          <!-- 대댓글에 댓글 달기 -->
                          <VAlert v-if="comment.commentAddevent" border="start" color="info" variant="tonal"
                            style="height: 50px;margin-left: 20px; opacity: 0.8;">
                            <VTextarea v-if="comment.commentAddevent" v-model="commentval" label="답글달기" color="info"
                              rows="1" style="height: 55px; flex: 1; border: none;" variant="plain" no-resize
                              @keydown.enter="insertComment(bno, commentval, 2, parentcomm); commentval = ''; parentcomm = 0;" />
                          </VAlert>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      작성된 댓글이 없습니다.
                    </div>
                  </div>
                </VCol>
              </VRow>
              <VRow style="margin-top: 100px;">
                <VCol cols="2" class="v-avatar-group" style="margin-left: 2%;">
                  <VAvatar v-for="(avatar, index) in props.likespro" :key="index" :image="avatar" size="30" />
                </VCol>
                <VCol v-if="props.likesuser && props.likesuser.length > 0" class="font-weight-medium">
                  {{ props.likesuser[0] }}님 외 {{ postToEdit.likesnum[0] }}명이 좋아합니다
                </VCol>
              </VRow>
              <VRow style="margin-bottom: 5px;">
                <VCol cols="9">
                  <VTextarea v-model="newcomment" label="댓글달기" rows="1" style="height: 20px; border: none;"
                    variant="underlined" prepend-icon="mdi-emoticon" no-resize
                    @keydown.enter="insertComment(bno, newcomment, 1, 0); newcomment = '';" />
                </VCol>
                <VCol cols="1">
                  <VBtn size="large" @click="insertComment(bno, newcomment, 1, 0); newcomment = '';">
                    게시
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VDialog>
  </section>
</template>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>

<style>
.disabled-textarea {
  color: black;
  /* 텍스트 색상을 검정색으로 설정합니다. */
}

.active-slide {
  color: success;
}

.transparent-carousel .v-carousel__controls {
  background-color: transparent;
}

.scrollbar {
  block-size: 250px;
  inline-size: 250px;
  overflow-y: scroll;
}

/* 스크롤바의 폭 너비 */
.scrollbar::-webkit-scrollbar {
  inline-size: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* 스크롤바 둥근 테두리 */
  background: rgba(0, 220, 60);
  /* 스크롤바 색상 */
}

.scrollbar::-webkit-scrollbar-track {
  background: rgba(220, 20, 60, 10%);
  /* 스크롤바 뒷 배경 색상 */
}

.solid-effect {
  border-width: 2px;
  border-style: solid;
  border-color: red;
}

@keyframes sparkle {
  0% {
    background-color: #fff;
  }

  50% {
    background-color: #fc0;
  }

  100% {
    background-color: #fff;
  }

  /* 0%{
    opacity: 1;
  }
  50%{
    opacity: 0.3;
  }
  100%{
    opacity: 1;
  } */
}

.blink {
  animation: sparkle 2s infinite;
}

.white-background {
  color: white;
}
</style>
