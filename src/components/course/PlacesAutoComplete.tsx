import usePlacesAutocomplete from 'use-places-autocomplete'
import InputSegment from '../common/InputSegment'

const PlacesAutoComplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: ['us', 'ca'] } },
    debounce: 300,
    cache: 86400,
  })

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false)
            clearSuggestions()
            onAddressSelect && onAddressSelect(description)
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })
  }

  return (
    <div>
      <InputSegment
        label="Course Location"
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="123 University Ave"
      />

      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}

export default PlacesAutoComplete
