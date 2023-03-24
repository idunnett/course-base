import { type FormEvent, useEffect, useState, ChangeEvent } from 'react'
import CourseSegmentsForm from './CourseSegmentsForm'
import CourseInfoForm from './CourseInfoForm'
import { useMultiStepForm } from '../../../hooks/useMultiStepForm'
import { getTerm } from '../../../utils/termUtils'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import { useRouter } from 'next/router'
import type { CreateCourseFormData } from '../../../types'
import { trpc } from '../../../utils/trpc'
import { School, Term } from '@prisma/client'
import CourseDetailsForm from './CourseDetailsForm'
import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api'
import { readFile } from '../../../utils/fileUtils'
import { RiUploadCloud2Line } from 'react-icons/ri'

const INITIAL_DATA: CreateCourseFormData = {
  name: '',
  color: '',
  year: '',
  term: '',
  instructor: '',
  code: '',
  school: null,
  degreeYear: undefined,
  credits: '',
  segments: [],
  lat: null,
  lng: null,
  address: null,
}

const NewCourseForm = ({ school }: { school: School | null }) => {
  const router = useRouter()
  const [data, setData] = useState(INITIAL_DATA)
  const [syllabus, setSyllabus] = useState<File | null>(null)

  useEffect(() => {
    updateFields({ school })
  }, [school])

  const { mutate: createCourse } = trpc.course.create.useMutation({
    onSuccess: (res) => {
      router.push(`/my/courses/${res}`)
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const { mutate: extractCourseInfo, isLoading: isExtractingCourseInfo } =
    trpc.gpt.extractCourseInfo.useMutation({
      onSuccess: (res) => {
        if (!res)
          return alert('Failed to find course info in the syllabus provided.')
        const segments = res.gradingCriteria.map((val) => ({
          name: val.title,
          value: val.value,
          quantity: val.quantity,
        }))
        updateFields({
          name: res.name || '',
          code: res.code || '',
          credits: res.credits?.toString() || '',
          year: res.year?.toString() || '',
          term: res.term ? getTerm(res.term) : Term.F,
          instructor: res.instructor || '',
          segments: segments || [],
        })
      },
      onError: (error) => {
        alert(error.message)
      },
    })

  const { currentStepIndex, steps, step, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <CourseInfoForm
        {...data}
        updateFields={updateFields}
        key={1}
        isExtractingCourseInfo={isExtractingCourseInfo}
      />,
      <CourseDetailsForm {...data} updateFields={updateFields} key={2} />,
      <CourseSegmentsForm {...data} updateFields={updateFields} key={3} />,
    ])

  function updateFields(fields: Partial<CreateCourseFormData>) {
    setData((prev) => ({ ...prev, ...fields }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isLastStep) return next()

    const totalSegmentVal = data.segments
      .map((segment) => segment.value)
      .reduce((a, b) => a + b, 0)
    if (totalSegmentVal !== 100)
      return alert('The combined segment value is not 100%')

    if (!data.school) return alert('Please assign a school.')

    const { segments } = data
    createCourse({
      code: data.code,
      name: data.name,
      color: data.color,
      degreeYear: Number(data.degreeYear),
      credits: Number(data.credits),
      schoolId: data.school.id,
      course: {
        year: Number(data.year),
        term: getTerm(data.term),
        instructor: data.instructor,
        segments,
        location: {
          lat: data.lat,
          lng: data.lng,
          address: data.address,
        },
      },
    })
  }

  function isTextMarkedContentType(
    obj: TextMarkedContent | TextItem
  ): obj is TextMarkedContent {
    return !!(obj as TextMarkedContent).type
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const fileInput = e.target.files?.[0]
    if (!fileInput) return
    setSyllabus(fileInput)

    const file = await readFile(fileInput)
    if (!file) return

    const pdfjs = await import('pdfjs-dist')
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    const pdf = await pdfjs.getDocument(file).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      for (const item of textContent.items) {
        if (!isTextMarkedContentType(item)) text += ' ' + item.str
        // if (text.length / 4 > 2049) break
      }
      // if (text.length / 4 > 2049) break
    }
    text = text.replaceAll(/  +/g, ' ')
    extractCourseInfo(text)
  }

  return (
    <div className="relative flex w-full justify-evenly py-16">
      <form
        className={`relative ${
          currentStepIndex === 2
            ? 'ml-4 w-1/2'
            : 'w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2'
        }`}
        onSubmit={handleSubmit}
      >
        {isFirstStep && (
          <div className="flex flex-col py-2">
            <h3 className="text-base font-medium text-gray-500">
              Syllabus{' '}
              <span className="text-xs font-normal text-gray-400">
                (Optional)
              </span>
            </h3>
            <small className="text-gray-400 dark:text-gray-500">
              Upload the course syllabus to let AI try pre-filling the form.
            </small>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <RiUploadCloud2Line className="h-6 w-6 text-slate-500" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}
        {step}
        <div className="mt-4 flex items-center gap-2">
          {!isFirstStep && (
            <button type="button" className="secondary-btn" onClick={back}>
              Back
            </button>
          )}
          <button type="submit" className="primary-btn">
            {isLastStep ? 'Submit' : 'Next'}
          </button>
          <div className="mx-2 text-sm text-slate-500">
            {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </form>
      {currentStepIndex === 2 && (
        <div className="flex w-1/2 flex-col items-center justify-center gap-24 text-slate-700 dark:text-neutral-300">
          <h2
            className="mx-4 text-4xl font-bold"
            style={{
              color: data.color,
            }}
          >
            {data.name}
          </h2>
          <SegmentPieChart
            segments={data.segments.map((seg) => {
              const dataEntry = {
                ...seg,
                color: data.color ?? '#64748b',
                title: seg.name,
              }
              return dataEntry
            })}
          />
        </div>
      )}
    </div>
  )
}

export default NewCourseForm
