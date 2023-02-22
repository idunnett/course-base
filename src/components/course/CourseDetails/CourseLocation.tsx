import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import {
  CircleF,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api'
import LoadingOrError from '../../common/LoadingOrError'

interface Props {
  lat: number | null
  lng: number | null
  color: string
  libraries?: (
    | 'drawing'
    | 'geometry'
    | 'localContext'
    | 'places'
    | 'visualization'
  )[]
  setIsLoaded?: Dispatch<SetStateAction<boolean>>
}

const CourseLocation: React.FC<Props> = ({
  lat,
  lng,
  color,
  libraries,
  setIsLoaded,
}) => {
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
      zoomControl: true,
      backgroundColor: 'transparent',
    }),
    []
  )

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries,
  })

  useEffect(() => {
    setIsLoaded && setIsLoaded(isLoaded)
  }, [isLoaded])

  if (!isLoaded) {
    return <LoadingOrError error={loadError?.message} />
  }

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-100">
      {lat && lng && (
        <GoogleMap
          options={mapOptions}
          zoom={17}
          center={{ lat, lng }}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={() => console.log('Map Component Loaded...')}
        >
          <MarkerF
            position={{ lat, lng }}
            onLoad={() => console.log('Marker Loaded')}
            icon="/map-pin-2-fill.svg"
          />
          <CircleF
            center={{ lat, lng }}
            radius={36}
            onLoad={() => console.log('Circle Load...')}
            options={{
              strokeWeight: 0,
              fillColor: color,
              fillOpacity: 0.2,
            }}
          />
        </GoogleMap>
      )}
    </div>
  )
}
export default CourseLocation
