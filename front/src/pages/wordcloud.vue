<template>
  <button @click="getWordCloud">워드 클라우드 가져오기</button>
  <div v-if="imageData">
    <img :src="imageData" alt="WordCloud">
  </div>
</template>

<script setup>
import axiosflask from '@/plugins/axiosflask';
//sdsd

const imageData = ref('');
const getWordCloud = async () => {
  await axiosflask.post('/wordcloud', {
    text: '<p>오늘은 학교에 다녀온 날이었습니다. 아침 일찍 일어나서 준비를 마치고 학교로 향했습니다. 학교에 도착하니 이미 많은 친구들이 모여있었고, 활기찬 분위기가 느껴졌습니다.</p><p>수업 시작 전에는 친구들과 이야기를 나누고 웃음 가득한 시간을 보냈습니다. 서로의 추억이 담긴 이야기를 나누며 학교 생활이 그리워졌던 순간이었습니다.</p><p>수업 시간에는 열심히 공부에 집중했습니다. 선생님들께서는 열정적으로 지식을 전달해 주셨고, 저희 학생들도 질문을 하며 적극적으로 수업에 참여했습니다. 새로운 지식을 습득하고 배우는 과정은 항상 흥미로웠습니다.</p><p>점심 시간에는 친구들과 함께 급식을 먹으며 이야기를 나누었습니다. 맛있는 음식을 함께 나누는 시간은 항상 즐거웠습니다. 함께 웃고 이야기하며 친밀감을 느낄 수 있어서 기분이 좋았습니다.</p>',
  }).then(response => {
    console.log('체크..', response.data);
    // 여기서 가져온 데이터를 원하는 방식으로 처리할 수 있습니다.
    imageData.value = 'data:image/png;base64,' + response.data.image; // 이미지 데이터 저장 및 화면 업데이트
  }).catch(error => {
    console.error('워드 클라우드를 가져오는 동안 오류가 발생했습니다:', error);
  });
}
</script>