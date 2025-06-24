<template>
  <div class="piano-container relative h-80">
    <div class="piano-header">
      <div v-if="editKeyBorad" class="ml-auto">
        <NButton
          type="tertiary"
          size="tiny"
          class="mr-3"
          @click="handleConfirm"
        >
          确定
        </NButton>
        <NButton type="error" secondary size="tiny" @click="handleCancel">
          取消
        </NButton>
      </div>
      <NIcon
        v-else
        :size="20"
        color="white"
        class="ml-auto"
        @click="editKeyBorad = true"
      >
        <EditSettings24Filled />
      </NIcon>
    </div>
    <template v-for="(times, idx) in 5" :key="times">
      <div
        v-for="note in whiteKeys"
        :id="`${note}-${idx + base}`"
        :ref="refs.set"
        :key="note"
        class="white-key"
        :class="{
          'pointer-events-none': editKeyBorad,
        }"
        @mousedown="play(note, base + idx)"
        @mouseup="release(note, base + idx)"
      >
        <div class="mb-2">
          <input
            v-if="editKeyBorad"
            class="w-5 pointer-events-auto"
            :value="noteProxyKey[`${note}${idx + base}`]"
            @input="(e) => handleSwitchKey(e, `${note}${idx + base}`)"
            @mousedown.stop=""
            @mouseup.stop=""
          />
          <span v-else>{{ noteProxyKey[`${note}${idx + base}`] }}</span>
        </div>
        <span class="note-label">{{ note }}{{ base + idx }}</span>
      </div>
      <div
        v-for="note in blackKeys"
        :id="`${note}-${idx + base}`"
        :key="note"
        :ref="refs.set"
        class="black-key"
        :class="{
          'pointer-events-none': editKeyBorad,
        }"
        :style="{ left: calLeft(note, idx) }"
        @mousedown="play(note, base + idx)"
        @mouseup="release(note, base + idx)"
      >
        <div class="mb-2">{{ noteProxyKey[`${note}${idx + base}`] }}</div>
        <span class="note-label">{{ note }}</span>
        <span>{{ base + idx }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  play: (note: string, base: number) => void
  release: (note: string, base: number) => void
  base: number
  showKeyTips: boolean
}>()

import keyProxy from '@/assets/keyboradProxy.json'
import { flipObject, splitNote } from '@/utils/tools'
import { EditSettings24Filled } from '@vicons/fluent'
import { NIcon, NButton } from 'naive-ui'

const refs = useTemplateRefsList<HTMLDivElement>()

const noteProxyKey = ref(flipObject(keyProxy))
const editKeyBorad = ref(false)

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#']

const calLeft = (note: string, times: number) => {
  const key = note.slice(0, 1)
  const index = whiteKeys.indexOf(key)
  return `${(index + 1) * 36 - 10 + times * 36 * 7}px`
}

const keydownList: string[] = []

useEventListener('keyup', (e) => {
  if (editKeyBorad.value) return
  const key = e.key.toUpperCase()
  const res = splitNote((keyProxy as Record<string, string>)[key] ?? '')

  const idx = keydownList.findIndex((k) => k === key)
  if (idx >= 0) {
    keydownList.splice(idx, 1)
  }

  if (res) {
    const [note, times] = res
    props.release(note!, +times!)
    const idx = refs.value.findIndex((r) => r.id === `${note}-${times}`)
    refs.value[idx]?.classList.remove('active')
  }
})

useEventListener('keydown', (e) => {
  if (editKeyBorad.value) return
  const key = e.key.toUpperCase()
  const idx = keydownList.findIndex((k) => k === key)
  if (idx >= 0) {
    return
  }

  keydownList.push(key)

  const res = splitNote((keyProxy as Record<string, string>)[key] ?? '')
  if (res) {
    const [note, times] = res
    props.play(note!, +times!)

    const idx = refs.value.findIndex((r) => r.id === `${note}-${times}`)
    refs.value[idx]?.classList.add('active')
  }
})

const handleSwitchKey = (e: Event, note: string) => {
  const { data } = e as InputEvent
  noteProxyKey.value[note] = data
}

const handleConfirm = () => {
  editKeyBorad.value = false
}

const handleCancel = () => {
  editKeyBorad.value = false
  noteProxyKey.value = flipObject(keyProxy)
}

defineExpose({
  keyRefs: refs,
})
</script>
<style scoped lang="scss">
.piano-container {
  margin: 0 auto;
  background: black;
  border-style: solid;
  border-color: black;
  // border-top-width: 30px;
  border-left-width: 10px;
  border-right-width: 10px;
  border-bottom-width: 20px;
  padding-top: 30px;
  position: relative;

  .piano-header {
    position: absolute;
    top: 0;
    left: 10;
    width: 100%;
    height: 30px;
    background: black;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5); /* 阴影向下投射 */
    z-index: 2;
    display: flex;
    align-items: center;
  }
}

.white-key {
  width: 36px;
  height: 100%;
  background: white;
  border: 1px solid #333;
  border-radius: 0 0 10px 10px;
  float: left;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding-bottom: 10px;
  cursor: pointer;
  transition: all 0.1s;

  &.active,
  &:active {
    background: #eee;
    transform: scale(0.98);
  }

  &::after {
    content: '';
    width: 100%;
    height: 0.5rem;
    border-radius: 0 0 10px 10px;
    position: absolute;
    background: rgba(128, 128, 128, 0.3);
    bottom: 0;
    left: 0;
  }
}

.black-key {
  position: absolute;
  top: 30px;
  width: 20px;
  height: 60%;
  background: #333;
  border: 1px solid #000;
  border-radius: 0 0 8px 8px;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding-bottom: 5px;
  cursor: pointer;
  transition: all 0.1s;

  &.active,
  &:active {
    background: #111;
    transform: scale(0.98);
  }

  &::after {
    content: '';
    width: 100%;
    height: 0.5rem;
    border-radius: 0 0 10px 10px;
    position: absolute;
    background: rgba(0, 0, 0, 0.3);
    bottom: 0;
    left: 0;
  }
}

.note-label {
  font-size: 12px;
  user-select: none;
}
</style>
