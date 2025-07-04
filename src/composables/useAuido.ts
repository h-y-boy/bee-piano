import { PitchDetector } from 'pitchy'

const noteFreqMap: { note: string; freq: number }[] = [
  { note: 'C0', freq: 16.35 },
  { note: 'C#0', freq: 17.32 },
  { note: 'D0', freq: 18.35 },
  { note: 'D#0', freq: 19.45 },
  { note: 'E0', freq: 20.6 },
  { note: 'F0', freq: 21.83 },
  { note: 'F#0', freq: 23.12 },
  { note: 'G0', freq: 24.5 },
  { note: 'G#0', freq: 25.96 },
  { note: 'A0', freq: 27.5 },
  { note: 'A#0', freq: 29.14 },
  { note: 'B0', freq: 30.87 },
  { note: 'C1', freq: 32.7 },
  { note: 'C#1', freq: 34.65 },
  { note: 'D1', freq: 36.71 },
  { note: 'D#1', freq: 38.89 },
  { note: 'E1', freq: 41.2 },
  { note: 'F1', freq: 43.65 },
  { note: 'F#1', freq: 46.25 },
  { note: 'G1', freq: 49.0 },
  { note: 'G#1', freq: 51.91 },
  { note: 'A1', freq: 55.0 },
  { note: 'A#1', freq: 58.27 },
  { note: 'B1', freq: 61.74 },
  { note: 'C2', freq: 65.41 },
  { note: 'C#2', freq: 69.3 },
  { note: 'D2', freq: 73.42 },
  { note: 'D#2', freq: 77.78 },
  { note: 'E2', freq: 82.41 },
  { note: 'F2', freq: 87.31 },
  { note: 'F#2', freq: 92.5 },
  { note: 'G2', freq: 98.0 },
  { note: 'G#2', freq: 103.83 },
  { note: 'A2', freq: 110.0 },
  { note: 'A#2', freq: 116.54 },
  { note: 'B2', freq: 123.47 },
  { note: 'C3', freq: 130.81 },
  { note: 'C#3', freq: 138.59 },
  { note: 'D3', freq: 146.83 },
  { note: 'D#3', freq: 155.56 },
  { note: 'E3', freq: 164.81 },
  { note: 'F3', freq: 174.61 },
  { note: 'F#3', freq: 185.0 },
  { note: 'G3', freq: 196.0 },
  { note: 'G#3', freq: 207.65 },
  { note: 'A3', freq: 220.0 },
  { note: 'A#3', freq: 233.08 },
  { note: 'B3', freq: 246.94 },
  { note: 'C4', freq: 261.63 },
  { note: 'C#4', freq: 277.18 },
  { note: 'D4', freq: 293.66 },
  { note: 'D#4', freq: 311.13 },
  { note: 'E4', freq: 329.63 },
  { note: 'F4', freq: 349.23 },
  { note: 'F#4', freq: 369.99 },
  { note: 'G4', freq: 392.0 },
  { note: 'G#4', freq: 415.3 },
  { note: 'A4', freq: 440.0 },
  { note: 'A#4', freq: 466.16 },
  { note: 'B4', freq: 493.88 },
  { note: 'C5', freq: 523.25 },
  { note: 'C#5', freq: 554.37 },
  { note: 'D5', freq: 587.33 },
  { note: 'D#5', freq: 622.25 },
  { note: 'E5', freq: 659.25 },
  { note: 'F5', freq: 698.46 },
  { note: 'F#5', freq: 739.99 },
  { note: 'G5', freq: 783.99 },
  { note: 'G#5', freq: 830.61 },
  { note: 'A5', freq: 880.0 },
  { note: 'A#5', freq: 932.33 },
  { note: 'B5', freq: 987.77 },
  { note: 'C6', freq: 1046.5 },
  { note: 'C#6', freq: 1108.73 },
  { note: 'D6', freq: 1174.66 },
  { note: 'D#6', freq: 1244.51 },
  { note: 'E6', freq: 1318.51 },
  { note: 'F6', freq: 1396.91 },
  { note: 'F#6', freq: 1479.98 },
  { note: 'G6', freq: 1567.98 },
  { note: 'G#6', freq: 1661.22 },
  { note: 'A6', freq: 1760.0 },
  { note: 'A#6', freq: 1864.66 },
  { note: 'B6', freq: 1975.53 },
  { note: 'C7', freq: 2093.0 },
]

export const useDetectNote = (
  analyser: AnalyserNode,
  sampleRate: number,
  fftSize: number
) => {
  const currentNote = ref('')

  const detector = PitchDetector.forFloat32Array(fftSize)
  const input = new Float32Array(detector.inputLength)

  const getNearestNote = (freq: number) => {
    let minDiff = Infinity
    let match = ''

    for (const { note, freq: f } of noteFreqMap) {
      const diff = Math.abs(f - freq)
      if (diff < minDiff) {
        minDiff = diff
        match = note
      }
    }
    return match
  }

  const detect = () => {
    analyser.getFloatTimeDomainData(input) // 填充音频数据
    const [freq] = detector.findPitch(input, sampleRate)
    if (freq > 80 && freq < 1000) {
      const note = getNearestNote(freq)
      currentNote.value = note
    }
  }

  return {
    currentNote,
    detect,
  }
}
