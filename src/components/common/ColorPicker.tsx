import { Dispatch, FC, SetStateAction } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import styles from './InputSegment/InputSegment.module.css'

interface Props {
  color: string
  setColor: Dispatch<SetStateAction<string>>
  label: string
}

const ColorPicker: FC<Props> = ({ color, setColor, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${styles.label} text-slate-500 dark:text-neutral-400`}>
        {label}
      </label>
      <div className="flex w-min flex-col items-center justify-center gap-1">
        <HexColorPicker color={color} onChange={setColor} />
        <div className="flex items-center gap-1">
          <span className="text-xl">#</span>
          <HexColorInput
            color={color}
            onChange={setColor}
            className={`${styles.input} font-mono text-black brightness-95 dark:text-white`}
            placeholder="ffffff"
          />
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
