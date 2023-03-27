import Widget from '../common/Widget'

interface Props {
  title: string
  price: number
  includes: string[]
}

const Card: React.FC<Props> = ({ title, price, includes }) => {
  return (
    <Widget className="w-80">
      <h3 className="mb-1 text-2xl font-semibold text-slate-500">{title}</h3>
      <small className="text-xs font-medium text-slate-400">CAD</small>
      <p className="mb-4 text-3xl text-slate-600">
        ${price} <span className="text-base text-gray-500">/ month</span>
      </p>
      <ul className="my-4 list-disc text-slate-500">
        {includes.map((include, index) => (
          <li className="ml-4" key={index}>
            {include}
          </li>
        ))}
      </ul>
    </Widget>
  )
}
export default Card
