import type { Segment } from '@prisma/client'
import { type FC, useEffect, useState } from 'react'
import type { CreateCourseFormData } from '../../../types'
import InputSegment from '../../common/InputSegment'
import Widget from '../../common/Widget'

interface Props {
  segments: Omit<Segment, 'id' | 'courseId'>[]
  updateFields: (fields: Partial<CreateCourseFormData>) => void
}

const CourseSegmentsForm: FC<Props> = ({ segments, updateFields }) => {
  const [selectedSegment, setSelectedSegment] = useState(
    segments.map((segment) => segment.value).reduce((a, b) => a + b, 0) >= 100
      ? 0
      : -1
  )
  const [segmentName, setSegmentName] = useState('')
  const [segmentValue, setSegmentValue] = useState('')
  const [segmentQuantity, setSegmentQuantity] = useState('')
  const [totalCourseValue, setTotalCourseValue] = useState(
    segments.map((segment) => segment.value).reduce((a, b) => a + b, 0)
  )
  const [selectInput, setSelectInput] = useState(false)

  useEffect(() => {
    setSegmentName(segments[selectedSegment]?.name || '')
    setSegmentValue(segments[selectedSegment]?.value.toString() || '')
    setSegmentQuantity(segments[selectedSegment]?.quantity.toString() || '')
  }, [selectedSegment])

  const handleAddSegment = () => {
    if (!!!segmentValue || !!!segmentName || !!!segmentQuantity) return
    const segmentValueNum = parseFloat(segmentValue)
    if (totalCourseValue + segmentValueNum > 100) {
      return alert('Total course value cannot exceed 100%')
    }
    setTotalCourseValue((prevState) => prevState + segmentValueNum)
    const newSegment = {
      name: segmentName,
      value: parseFloat(segmentValue),
      quantity: parseFloat(segmentQuantity),
    }
    const updatedSegments = [...segments, newSegment]
    updateFields({ segments: updatedSegments })
    if (totalCourseValue + segmentValueNum < 100) {
      setSelectedSegment(-1)
      setSegmentName('')
      setSegmentValue('')
      setSegmentQuantity('')
    } else {
      setSelectedSegment(segments.length)
    }
  }

  const handleRemoveSegment = () => {
    const segment = segments[selectedSegment]
    if (!segment) return
    setTotalCourseValue((prevState) => prevState - segment.value)
    const newSegments = [...segments]
    newSegments.splice(selectedSegment, 1)
    updateFields({ segments: newSegments })
    setSelectedSegment(-1)
  }

  const handleSaveSegment = () => {
    const segment = segments[selectedSegment]
    if (!segment) return
    if (!!!segmentValue || !!!segmentName || !!!segmentQuantity) return
    const segmentValueNum = parseFloat(segmentValue)
    if (totalCourseValue - segment.value + segmentValueNum > 100) {
      return alert('Total course value cannot exceed 100%')
    }
    setTotalCourseValue(
      (prevState) => prevState - segment.value + segmentValueNum
    )
    const newSegments = [...segments]
    newSegments[selectedSegment] = {
      name: segmentName,
      value: parseFloat(segmentValue),
      quantity: parseFloat(segmentQuantity),
    }
    updateFields({ segments: newSegments })
  }

  const isInputDataValid = () => {
    if (selectedSegment < 0)
      return !!segmentName && !!segmentValue && !!segmentQuantity
    const segment = segments[selectedSegment]
    if (!segment) return false
    return (
      segmentName != segment.name ||
      segmentValue != segment.value.toString() ||
      segmentQuantity != segment.quantity.toString()
    )
  }

  return (
    <Widget className="flex flex-col gap-2 p-4">
      <h1 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
        Create a Course
      </h1>
      <h2 className="text-xl font-medium text-slate-500 dark:text-zinc-400">
        Grading Scheme{' '}
        <small
          className={`ml-2 text-opacity-70 transition-all duration-200 ease-linear ${
            totalCourseValue === 100 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {100 - totalCourseValue}% remaining
        </small>
      </h2>
      <div className="flex">
        <div className="flex w-full flex-col items-start gap-1 rounded-l-md bg-gray-300 bg-opacity-30 p-2 dark:bg-zinc-800 dark:bg-opacity-30">
          {segments?.map((segment, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedSegment(i)}
              className={`list-button ${selectedSegment === i && 'active'}`}
            >
              <span className="text-md whitespace-nowrap font-normal text-slate-500 text-opacity-70">
                {segment.quantity}
              </span>
              {segment.name}
              <span className="whitespace-nowrap text-sm font-normal text-slate-500 text-opacity-70">
                {segment.value}%
              </span>
            </button>
          ))}
          {totalCourseValue < 100 && (
            <button
              type="button"
              onClick={() => {
                setSelectedSegment(-1)
                setSelectInput((prevState) => !prevState)
              }}
              className={`list-button ${selectedSegment === -1 && 'active'}`}
            >
              <span className="text-emerald-500">+</span> Add Segment{' '}
            </button>
          )}
        </div>
        <div className="flex w-full flex-col pl-4">
          <InputSegment
            label="Name"
            placeholder="Quizzes"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            selectInputTrigger={selectInput}
            autoComplete={false}
            animate={false}
          />
          <div className="flex gap-4">
            <InputSegment
              label="Value %"
              placeholder="30%"
              value={segmentValue}
              onChange={(e) => setSegmentValue(e.target.value)}
              type="number"
              animate={false}
            />
            <InputSegment
              label="Quantity"
              placeholder="4"
              value={segmentQuantity}
              onChange={(e) => setSegmentQuantity(e.target.value)}
              type="number"
              animate={false}
            />
          </div>
          <div className="mt-3 flex w-full items-center justify-start">
            {selectedSegment >= 0 && (
              <button
                type="button"
                onClick={handleRemoveSegment}
                className="secondary-btn"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                selectedSegment < 0 ? handleAddSegment() : handleSaveSegment()
                setSelectInput((prevState) => !prevState)
              }}
              className={`primary-btn ${
                isInputDataValid()
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'cursor-default bg-slate-400 hover:bg-slate-400'
              }`}
              disabled={!isInputDataValid()}
            >
              {selectedSegment < 0 ? 'Add' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default CourseSegmentsForm
