import Card from '../components/pricing/Card'

const LIMITED_INCLUDES = [
  'Up to 4 Courses',
  'Some Grade Visualization Diagrams',
]

const FULL_INCLUDES = [
  'Unlimited Courses',
  'All Grade Visualization Diagrams',
  'Degrees',
  'Schedule Builder',
  'Syllabus Upload Feature (powered by ChatGPT)',
]

export default function Pricing() {
  return (
    <div className="flex w-full flex-col items-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-bold text-slate-500 dark:text-white">
        Pricing
      </h1>
      <div className="flex w-full justify-center">
        <div className="flex gap-4">
          <Card title="Limited" price={0.0} includes={LIMITED_INCLUDES} />
          <Card title="Full" price={5} includes={FULL_INCLUDES} />
        </div>
      </div>
    </div>
  )
}
