<template>
  <div class="h-400px w-full">
    <div class="flex items-center my-1 gap-2">
      tempo:<NInputNumber v-model:value="tempo" :show-button="false" />
      <button @click="handleTest">test</button>
      <div class="flex items-center">
        键盘提示: <NSwitch v-model:value="showTips" />
      </div>
    </div>
    <canvas
      ref="canvas"
      class="h-300px w-full border-white/80 rounded border-2 border-solid"
    />
    <KeyBorad
      ref="keyborad"
      :play="playNote"
      :release="releaseNote"
      :base="2"
      :show-key-tips="showTips"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import * as Tone from 'tone'
import { NInputNumber, NSwitch } from 'naive-ui'
import KeyBorad from '@/components/KeyBorad.vue'
import PianoMp3 from 'tonejs-instrument-piano-mp3'
import { useDetectNote } from '@/composables/useAuido'
import { splitNote } from '@/utils/tools'

const synth: Tone.Sampler = new PianoMp3().toDestination()
const analyser = synth.context.createAnalyser()
analyser.fftSize = 2048
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)

const tempo = ref(120)
const tempoTime = computed(() => (60 / tempo.value).toFixed(2))

const canvas$ = useTemplateRef<HTMLCanvasElement>('canvas')
const keyborad$ = useTemplateRef<InstanceType<typeof KeyBorad>>('keyborad')
const showTips = ref(false)

const { detect, currentNote } = useDetectNote(
  analyser,
  Tone.getContext().sampleRate,
  analyser.fftSize
)

// 关键修改：将 Tone 乐器输出连接到分析器
synth.connect(analyser)
onMounted(async () => {
  await until(canvas$).toBeTruthy()
  // 初始化画布尺寸
  syncCanvasSize()
  // 首次清空画布
  ctx.value?.clearRect(
    0,
    0,
    canvas$.value?.width || 0,
    canvas$.value?.height || 0
  )

  // 启动可视化动画循环
  draw()
})

// 修正：添加画布尺寸同步（避免 CSS 缩放导致的模糊）
const syncCanvasSize = () => {
  const canvasEl = canvas$.value
  if (canvasEl) {
    // 将画布绘制尺寸设置为 CSS 显示尺寸
    canvasEl.width = canvasEl.clientWidth
    canvasEl.height = canvasEl.clientHeight
  }
}

const ctx = computed(() => canvas$.value?.getContext('2d'))

const sleep = (ms: number) => {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}

// 示例：触发 Tone 声音（可通过按钮或其他交互调用）
const handleTest = async () => {
  const list: { time: number; note: string; duration: number }[] = [
    { time: 0.0, note: 'C4', duration: 0.5 },
    { time: 0.5, note: 'D4', duration: 0.5 },
    { time: 1.0, note: 'E4', duration: 0.5 },
    { time: 1.5, note: 'C4', duration: 0.5 },
    { time: 2.0, note: 'D4', duration: 0.5 },
    { time: 2.5, note: 'G4', duration: 0.5 },
    { time: 3.0, note: 'A4', duration: 0.5 },
    { time: 3.5, note: 'A4', duration: 0.5 },
    { time: 4.0, note: 'A4', duration: 0.5 },
    { time: 4.5, note: 'G4', duration: 0.5 },
    { time: 5.0, note: 'A4', duration: 0.5 },
    { time: 5.5, note: 'G4', duration: 0.5 },
    { time: 6.0, note: 'F4', duration: 0.5 },
    { time: 6.5, note: 'E4', duration: 0.5 },
    { time: 7.0, note: 'C4', duration: 1.0 },

    { time: 8.0, note: 'C4', duration: 0.5 },
    { time: 8.5, note: 'D4', duration: 0.5 },
    { time: 9.0, note: 'E4', duration: 0.5 },
    { time: 9.5, note: 'C4', duration: 0.5 },
    { time: 10.0, note: 'D4', duration: 0.5 },
    { time: 10.5, note: 'G4', duration: 0.5 },
    { time: 11.0, note: 'A4', duration: 0.5 },
    { time: 11.5, note: 'A4', duration: 0.5 },
    { time: 12.0, note: 'A4', duration: 0.5 },
    { time: 12.5, note: 'G4', duration: 0.5 },
    { time: 13.0, note: 'A4', duration: 0.5 },
    { time: 13.5, note: 'G4', duration: 0.5 },
    { time: 14.0, note: 'F4', duration: 0.5 },
    { time: 14.5, note: 'E4', duration: 0.5 },
    { time: 15.0, note: 'C4', duration: 1.0 },

    { time: 16.0, note: 'E4', duration: 0.5 },
    { time: 16.5, note: 'F4', duration: 0.5 },
    { time: 17.0, note: 'G4', duration: 0.5 },
    { time: 17.5, note: 'E4', duration: 0.5 },
    { time: 18.0, note: 'D4', duration: 0.5 },
    { time: 18.5, note: 'E4', duration: 0.5 },
    { time: 19.0, note: 'F4', duration: 0.5 },
    { time: 19.5, note: 'G4', duration: 0.5 },
    { time: 20.0, note: 'A4', duration: 0.5 },
    { time: 20.5, note: 'C5', duration: 0.5 },
    { time: 21.0, note: 'B4', duration: 0.5 },
    { time: 21.5, note: 'A4', duration: 0.5 },
    { time: 22.0, note: 'G4', duration: 0.5 },
    { time: 22.5, note: 'E4', duration: 0.5 },
    { time: 23.0, note: 'F4', duration: 0.5 },
    { time: 23.5, note: 'G4', duration: 0.5 },

    { time: 24.0, note: 'C5', duration: 0.5 },
    { time: 24.5, note: 'C5', duration: 0.5 },
    { time: 25.0, note: 'C5', duration: 0.5 },
    { time: 25.5, note: 'A4', duration: 0.5 },
    { time: 26.0, note: 'B4', duration: 0.5 },
    { time: 26.5, note: 'C5', duration: 0.5 },
    { time: 27.0, note: 'D5', duration: 0.5 },
    { time: 27.5, note: 'C5', duration: 0.5 },
    { time: 28.0, note: 'B4', duration: 0.5 },
    { time: 28.5, note: 'A4', duration: 0.5 },
    { time: 29.0, note: 'G4', duration: 1.0 },
  ]
  let times = 0

  while (true) {
    const n = list[times]!
    if (Array.isArray(n.note)) {
      const [n1, n2] = n.note
      const notes1 = splitNote(n1!)
      const notes2 = splitNote(n2!)
      if (!notes1 || !notes2) continue

      const [note1, time1] = notes1
      const [note2, time2] = notes2

      const idx1 = keyborad$.value?.keyRefs.findIndex(
        (r) => r.id === `${note1}-${time1}`
      )!
      const idx2 = keyborad$.value?.keyRefs.findIndex(
        (r) => r.id === `${note2}-${time2}`
      )!

      // console.log(idx1, idx2, notes1, notes2, n)
      if (idx1 >= 0 && idx2 >= 0) {
        playNote(note1!, +time1!)
        playNote(note2!, +time2!)
        keyborad$.value?.keyRefs[idx1]?.classList.add('active')
        keyborad$.value?.keyRefs[idx2]?.classList.add('active')
        await sleep(+n.duration * 1000)
        keyborad$.value?.keyRefs[idx1]?.classList.remove('active')
        keyborad$.value?.keyRefs[idx2]?.classList.remove('active')
        releaseNote(note1!, +time1!)
        releaseNote(note2!, +time2!)
      }
    } else {
      const notes = splitNote(n.note)
      if (!notes) continue
      const [note, time] = notes
      const idx = keyborad$.value?.keyRefs.findIndex(
        (r) => r.id === `${note}-${time}`
      )!
      if (idx >= 0) {
        playNote(note!, +time!)
        keyborad$.value?.keyRefs[idx]?.classList.add('active')
        await sleep(n.duration * 1000)
        keyborad$.value?.keyRefs[idx]?.classList.remove('active')
        releaseNote(note!, +time!)
      }
    }
    times++
    if (times >= list.length) break
  }
}

let animationFrameId: number | null = null

// 新增：维护历史柱状条高度数组（保存最近的柱状条数据）
const WIDTH = 16

const draw = () => {
  animationFrameId = requestAnimationFrame(draw)

  syncCanvasSize()
  analyser.getByteFrequencyData(dataArray) // 获取实时音频数据

  detect()
  console.log('currentNote', currentNote.value)

  //来源于B站
  ctx.value!.clearRect(0, 0, canvas$.value!.width, canvas$.value!.height)
  //   ctx.value!.fillStyle = "rgb(0, 0, 0)";
  //   ctx.value!.fillRect(0, 0, canvas$.value!.width, canvas$.value!.height);
  const barWidth = (canvas$.value!.width / dataArray.length) * WIDTH
  let x = 0
  for (let i = 0; i < dataArray.length / WIDTH; i++) {
    let barHeight = dataArray[i * WIDTH]!
    const [r, g, b] = [
      255 - Math.random() * barHeight,
      Math.random() * barHeight,
      120,
    ]
    const color = `rgb(${r}, ${g}, ${b})`
    ctx.value!.fillStyle = color
    ctx.value!.fillRect(
      x,
      canvas$.value!.height - barHeight,
      barWidth,
      barHeight * 10
    )
    x += barWidth + WIDTH / 4
  }
}

const playNote = (note: string, base: number) => {
  console.log(note, base)
  synth.triggerAttack(`${note}${base}`) // 播放 1/8 拍
}

const releaseNote = (note: string, base: number) => {
  synth.triggerRelease(`${note}${base}`)
}

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
<style scoped lang="scss"></style>
