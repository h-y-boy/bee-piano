<template>
  <div class="piano-background px-8">
    <div ref="notes" class="notes"></div>
    <RouterView />
  </div>
</template>
<script setup lang="ts">
// 音符漂浮
const notesContainer = useTemplateRef('notes')
const symbols = ['♩', '♪', '♫', '♬']

function createNote() {
  const note = document.createElement('div')
  note.className = 'note'
  note.innerText = symbols[Math.floor(Math.random() * symbols.length)]!
  note.style.left = Math.random() * 100 + '%'
  note.style.fontSize = 16 + Math.random() * 20 + 'px'
  note.style.animationDuration = 4 + Math.random() * 3 + 's'
  notesContainer.value?.appendChild(note)
  setTimeout(() => note.remove(), 7000)
}
useIntervalFn(createNote, 500)
</script>
<style scoped lang="scss">
.piano-background {
  position: relative;
  width: 100%;
  height: 100%;
}

.notes {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  left: 0;
}

.note {
  position: absolute;
  font-size: 20px;
  color: #ffffffcc;
  animation: floatUp 5s linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(100%);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>
