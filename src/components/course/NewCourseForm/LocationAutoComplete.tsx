import { useMemo, useState } from 'react'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import CourseLocation from '../CourseDetails/CourseLocation'
import PlacesAutoComplete from '../PlacesAutoComplete'

interface Props {
  lat: number | null
  lng: number | null
  setLat: (val: number) => void
  setLng: (val: number) => void
  color?: string
}

const LocationAutoComplete: React.FC<Props> = ({
  lat,
  lng,
  setLat,
  setLng,
  color = '#000',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const libraries: (
    | 'drawing'
    | 'geometry'
    | 'localContext'
    | 'places'
    | 'visualization'
  )[] = useMemo(() => ['places'], [])
  return (
    <div>
      {isLoaded && (
        <div>
          {/* render Places Auto Complete and pass custom handler which updates the state */}
          <PlacesAutoComplete
            onAddressSelect={(address) => {
              getGeocode({ address: address }).then((results) => {
                if (!results?.[0]) return
                const { lat, lng } = getLatLng(results[0])

                setLat(lat)
                setLng(lng)
              })
            }}
          />
        </div>
      )}
      <CourseLocation
        lat={lat}
        lng={lng}
        color={color}
        libraries={libraries}
        setIsLoaded={setIsLoaded}
      />
    </div>
  )
}
export default LocationAutoComplete
