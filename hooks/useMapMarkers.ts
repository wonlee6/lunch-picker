import { useEffect, useRef } from 'react'
import { Restaurant } from '@/types/restaurant'

// kakao map 타입 지정
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapType = any | null

export function useMapMarkers(
  map: MapType,
  restaurants: Restaurant[],
  onSelectRestaurant: (restaurant: Restaurant) => void,
  selectedRestaurant: Restaurant | null
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!map || !window.kakao) return

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    restaurants.forEach((restaurant) => {
      const position = new window.kakao.maps.LatLng(restaurant.y, restaurant.x)
      const isSelected = selectedRestaurant?.id === restaurant.id

      // 마커 크기 조정 (일반/선택)
      const markerSize = isSelected
        ? new window.kakao.maps.Size(40, 55)
        : new window.kakao.maps.Size(40, 60)

      const markerImage = isSelected
        ? new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            markerSize
          )
        : undefined

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: restaurant.place_name,
        zIndex: isSelected ? 40 : 30,
        clickable: true,
        image: markerImage
      })
      if (isSelected) {
        map.setCenter(position)
        map.setLevel(3)
      }
      window.kakao.maps.event.addListener(marker, 'click', () => {
        map.setCenter(position)
        onSelectRestaurant(restaurant)
      })
      markersRef.current.push(marker)
    })
  }, [map, restaurants, selectedRestaurant, onSelectRestaurant])
}
