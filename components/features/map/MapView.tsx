import { useRef } from 'react'
import { Restaurant } from '@/types/restaurant'
import { useKakaoMap } from '@/hooks/useKakaoMap'
import { useMapMarkers } from '@/hooks/useMapMarkers'

export interface MapViewProps {
  selectedRestaurant: Restaurant | null
  restaurants: Restaurant[]
  onSelectRestaurant: (restaurant: Restaurant) => void
}

export function MapView({ selectedRestaurant, restaurants, onSelectRestaurant }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const map = useKakaoMap(mapRef)

  useMapMarkers(map, restaurants, onSelectRestaurant, selectedRestaurant)

  return (
    <div className='relative w-full h-full'>
      {restaurants.length > 0 && (
        <div className='absolute top-4 left-4 w-64 max-h-60 overflow-y-auto bg-white/30 shadow rounded z-50 backdrop-blur-sm'>
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() => onSelectRestaurant(rest)}
              className={`cursor-pointer px-2 py-1 truncate text-sm transition-colors duration-300 ease-out ${
                selectedRestaurant && selectedRestaurant.id === rest.id
                  ? 'text-neutral-950 bg-blue-300/30 hover:bg-blue-500/20'
                  : 'text-neutral-500 hover:text-neutral-950 hover:bg-indigo-200/20'
              }`}
              title={rest.place_name}
            >
              {rest.place_name}
            </div>
          ))}
        </div>
      )}
      <div ref={mapRef} className='w-full h-full' />
    </div>
  )
}
