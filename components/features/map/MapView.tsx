'use client'

import { Restaurant } from '@/types/restaurant'
import useNaverMap from '@/hooks/useNaverMap'
import { useMapMarkers } from '@/hooks/useMapMarkers'

interface MapViewProps {
  selectedRestaurant: Restaurant | null
  restaurants: Restaurant[]
  onSelectRestaurant: (restaurant: Restaurant) => void
}

export const MapView = ({ selectedRestaurant, restaurants, onSelectRestaurant }: MapViewProps) => {
  const { mapRef, map, isMapLoading, mapError } = useNaverMap()
  useMapMarkers(map, restaurants, onSelectRestaurant, selectedRestaurant)
  return (
    <div className='relative w-full h-full'>
      {/* 지도 로딩 및 오류 처리 UI */}
      {isMapLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10'>
          <div className='text-center'>
            <div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-2'></div>
            <p>지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      {mapError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 z-10'>
          <div className='text-center max-w-md p-4'>
            <div className='text-red-500 text-4xl mb-2'>⚠️</div>
            <h3 className='text-lg font-semibold mb-2'>지도 로드 오류</h3>
            <p className='text-sm text-gray-700'>{mapError}</p>
          </div>
        </div>
      )}

      {/* 좌측 상단 카테고리 리스트 */}
      {restaurants.length > 0 && (
        <div className='absolute top-4 left-4 w-64 max-h-60 overflow-y-auto bg-white/30 shadow rounded z-50 backdrop-blur-sm'>
          {restaurants.slice(0, 5).map((rest) => (
            <div
              key={rest.id}
              onClick={() => onSelectRestaurant(rest)}
              className='cursor-pointer px-2 py-1 truncate hover:bg-indigo-200/20 text-sm text-neutral-500 hover:text-neutral-950 transition-colors duration-300 ease-out'
              title={rest.title}
            >
              {rest.title}
            </div>
          ))}
        </div>
      )}

      {/* 지도 컨테이너 */}
      <div ref={mapRef} className='w-full h-full' />

      {/* 내부 스타일 (마커, 정보창 등) */}
      <style jsx global>{`
        .marker {
          padding: 5px 10px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .marker:hover {
          transform: scale(1.05);
        }
        .marker.selected {
          background: #4f46e5; /* Tailwind indigo-600 */
          color: white;
          border-color: #4f46e5;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
