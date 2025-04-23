import { useEffect, useRef } from 'react'
import { Restaurant } from '@/types/restaurant'

type MapType = naver.maps.Map | null

export function useMapMarkers(
  map: MapType,
  restaurants: Restaurant[],
  onSelectRestaurant: (restaurant: Restaurant) => void,
  selectedRestaurant: Restaurant | null
) {
  const markersRef = useRef<naver.maps.Marker[]>([])

  useEffect(() => {
    if (!map) return

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    restaurants.forEach((restaurant) => {
      const position = new window.naver.maps.LatLng(restaurant.mapy, restaurant.mapx)
      const isSelected = selectedRestaurant?.id === restaurant.id

      const marker = new window.naver.maps.Marker({
        position,
        map,
        title: restaurant.title,
        icon: {
          content: `<div class="marker ${isSelected ? 'selected' : ''}">${restaurant.title}</div>`,
          size: new window.naver.maps.Size(38, 58),
          anchor: new window.naver.maps.Point(25, 42)
        },
        zIndex: isSelected ? 40 : 30
      })

      marker.addListener('click', () => {
        map.setCenter(position)
        onSelectRestaurant(restaurant)
      })

      markersRef.current.push(marker)

      if (isSelected) {
        map.setCenter(position)
        map.setZoom(17)
      }
    })
  }, [map, restaurants, selectedRestaurant, onSelectRestaurant])
}
