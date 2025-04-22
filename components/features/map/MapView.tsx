'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Restaurant } from '@/types/restaurant'

// 네이버 맵 타입 정의를 위한 전역 선언
declare global {
  interface Window {
    naver: typeof naver
  }
}

// 플레이스 검색 결과 인터페이스
interface PlaceSearchResult {
  title: string
  address: string
  roadAddress: string
  mapx: string
  mapy: string
  category: string
  description: string
  telephone: string
  link: string
  // 백엔드에서 변환된 좌표
  lat: number
  lng: number
}

interface MapViewProps {
  selectedRestaurant: Restaurant | null
  restaurants: Restaurant[]
}

export const MapView = ({ selectedRestaurant, restaurants }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const markersRef = useRef<naver.maps.Marker[]>([])
  const infoWindowsRef = useRef<naver.maps.InfoWindow[]>([])
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [placeInfo, setPlaceInfo] = useState<PlaceSearchResult[]>([])
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number>(-1)
  const [isPlaceLoading, setIsPlaceLoading] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)
  const searchMarkersRef = useRef<naver.maps.Marker[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // 플레이스 정보 가져오기
  const fetchPlaceInfo = useCallback(async (restaurantName: string, address: string) => {
    try {
      setIsPlaceLoading(true)
      setPlaceError(null)

      // 검색 마커 제거
      searchMarkersRef.current.forEach((marker) => marker.setMap(null))
      searchMarkersRef.current = []

      // 실제 서비스에서는 백엔드 API를 통해 호출해야 합니다 (CORS 이슈 방지)
      const response = await fetch(
        `/api/search-place?query=${encodeURIComponent(restaurantName)}&address=${encodeURIComponent(
          address
        )}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '장소 검색 API 호출에 실패했습니다')
      }

      const data = await response.json()

      if (data && data.length > 0) {
        setPlaceInfo(data)
        setSelectedPlaceIndex(-1) // 선택 초기화

        // 검색된 장소들에 마커 생성
        if (mapInstanceRef.current) {
          data.forEach((place: PlaceSearchResult, index: number) => {
            // 백엔드에서 이미 변환된 좌표 사용
            if (!place.lat || !place.lng) return

            // 네이버 좌표 생성
            const latLng = new window.naver.maps.LatLng(place.lat, place.lng)

            // 마커 생성
            const marker = new window.naver.maps.Marker({
              position: latLng,
              map: mapInstanceRef.current || undefined,
              title: place.title,
              icon: {
                content: `<div class="search-marker">${index + 1}</div>`,
                size: new window.naver.maps.Size(30, 30),
                anchor: new window.naver.maps.Point(15, 15)
              },
              zIndex: 20
            })

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              setSelectedPlaceIndex(index)
            })

            searchMarkersRef.current.push(marker)
          })

          // 지도 영역 조정
          if (searchMarkersRef.current.length > 0) {
            // 첫 번째 마커 위치로 이동
            if (searchMarkersRef.current[0] && searchMarkersRef.current[0].getPosition()) {
              mapInstanceRef.current.setCenter(
                searchMarkersRef.current[0].getPosition() as naver.maps.LatLng
              )
              mapInstanceRef.current.setZoom(15)
            }
          }
        }
      } else {
        setPlaceInfo([])
        setPlaceError('검색 결과가 없습니다. 네이버 검색 API 키 설정과 검색어를 확인해주세요.')
      }
    } catch (error) {
      setPlaceInfo([])
      setPlaceError(
        error instanceof Error ? error.message : '장소 정보를 가져오는 중 오류가 발생했습니다'
      )
    } finally {
      setIsPlaceLoading(false)
    }
  }, [])

  // 마커 생성 함수를 useCallback으로 메모이제이션
  const createMarkers = useCallback(() => {
    if (!window.naver || !mapInstanceRef.current) return

    // 기존 마커와 정보창 제거
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
    infoWindowsRef.current = []

    // 새 마커 생성
    restaurants.forEach((restaurant) => {
      const markerPosition = new window.naver.maps.LatLng(restaurant.lat, restaurant.lng)
      if (!mapInstanceRef.current) return

      // 마커 아이콘 설정
      const isSelected = selectedRestaurant?.id === restaurant.id
      const marker = new window.naver.maps.Marker({
        position: markerPosition,
        map: mapInstanceRef.current,
        title: restaurant.name,
        icon: {
          content: `<div class="marker ${isSelected ? 'selected' : ''}">${restaurant.name}</div>`,
          size: new window.naver.maps.Size(38, 58),
          anchor: new window.naver.maps.Point(55, 42)
        },
        zIndex: isSelected ? 40 : 30
      })

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div class="info-window">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.category} | ${restaurant.address}</p>
            <button class="place-details-btn" data-id="${restaurant.id}">상세 정보 보기</button>
          </div>
        `,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: 'transparent'
      })

      infoWindowsRef.current.push(infoWindow)

      // 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (!mapInstanceRef.current) return

        // 다른 정보창 닫기
        infoWindowsRef.current.forEach((iw) => iw.close())

        // 선택된 정보창 열기
        infoWindow.open(mapInstanceRef.current, marker)

        // 상세 정보 버튼 클릭 이벤트 등록 (DOM이 생성된 후)
        setTimeout(() => {
          const detailsBtn = document.querySelector(
            `.place-details-btn[data-id="${restaurant.id}"]`
          )
          if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
              fetchPlaceInfo(restaurant.name, restaurant.address)
            })
          }
        }, 100)
      })

      markersRef.current.push(marker)
    })
  }, [restaurants, selectedRestaurant, fetchPlaceInfo])

  // 지도 초기화 함수를 useCallback으로 메모이제이션
  const initializeMap = useCallback(() => {
    if (!window.naver || !mapRef.current) return

    // 초기 위치 (서울 강남역)
    const initialPosition = new window.naver.maps.LatLng(37.507678, 127.054957)

    // 맵 인스턴스 생성
    const mapOptions: naver.maps.MapOptions = {
      center: initialPosition,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT
      },
      mapTypeControl: true,
      scaleControl: true,
      minZoom: 12
    }

    mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)

    // 로딩 상태 업데이트
    setIsMapLoading(false)

    // 모든 식당 마커 생성
    createMarkers()
  }, [createMarkers])

  // 스크립트 로드
  useEffect(() => {
    // 환경 변수 확인
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    if (!clientId) {
      setIsMapLoading(false)
      setMapError('API 클라이언트 ID가 설정되지 않았습니다')
      return
    }

    // 이미 로드된 스크립트 확인
    const existingScript = document.querySelector('script[src*="maps.js"]')
    if (existingScript) {
      if (window.naver) {
        initializeMap()
      } else {
        existingScript.addEventListener('load', initializeMap)
        existingScript.addEventListener('error', () => {
          setIsMapLoading(false)
          setMapError('지도 API를 로드할 수 없습니다. 네트워크 연결 및 API 키를 확인하세요.')
        })
      }
      return
    }

    // 새 스크립트 로드 (places 라이브러리 추가)
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder,drawing,visualization,panorama,drawing,search`
    script.async = true
    script.onload = () => initializeMap()
    script.onerror = () => {
      setIsMapLoading(false)
      setMapError('지도 API를 로드할 수 없습니다. 네트워크 연결 및 API 키를 확인하세요.')
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [initializeMap])

  // 선택된 식당이 변경될 때 지도 이동 및 마커 갱신
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return

    createMarkers()

    if (selectedRestaurant) {
      const position = new window.naver.maps.LatLng(selectedRestaurant.lat, selectedRestaurant.lng)
      mapInstanceRef.current.setCenter(position)
      mapInstanceRef.current.setZoom(16)

      // 선택된 식당의 마커를 찾아 정보창 열기
      const selectedMarkerIndex = markersRef.current.findIndex(
        (_, index) => restaurants[index]?.id === selectedRestaurant.id
      )

      if (selectedMarkerIndex >= 0) {
        // 다른 정보창 닫기
        infoWindowsRef.current.forEach((iw) => iw.close())

        // 선택된 정보창 열기
        if (infoWindowsRef.current[selectedMarkerIndex]) {
          infoWindowsRef.current[selectedMarkerIndex].open(
            mapInstanceRef.current,
            markersRef.current[selectedMarkerIndex]
          )

          // 선택된 가게의 플레이스 정보 가져오기
          fetchPlaceInfo(selectedRestaurant.name, selectedRestaurant.address)
        }
      }
    } else {
      // 선택된 가게가 없으면 플레이스 정보 초기화
      setPlaceInfo([])
    }
  }, [selectedRestaurant, restaurants, createMarkers, fetchPlaceInfo])

  // 선택한 장소를 서버에 저장
  const saveSelectedPlace = useCallback(async () => {
    if (selectedPlaceIndex === -1 || placeInfo.length === 0) return

    const place = placeInfo[selectedPlaceIndex]
    if (!place) return

    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      // 저장할 데이터 구성
      const restaurantData = {
        name: place.title.replace(/<[^>]*>/g, ''),
        category: place.category,
        address: place.roadAddress || place.address,
        lat: place.lat,
        lng: place.lng,
        rating: 4.0, // 기본값
        priceRange: 2, // 기본값
        imageUrl: '' // 기본값
      }

      // 서버에 데이터 저장 요청
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurantData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '가게 정보 저장에 실패했습니다')
      }

      // 성공 처리
      setSaveSuccess(true)

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '가게 정보 저장 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }, [selectedPlaceIndex, placeInfo])

  // 플레이스 정보 카드 렌더링
  const renderPlaceInfoCard = () => {
    if (placeError) {
      return (
        <div className='place-info-card place-info-error'>
          <h3 className='place-info-title'>오류 발생</h3>
          <div className='place-info-content'>
            <p>{placeError}</p>
            <p className='text-sm mt-2'>
              네이버 개발자 센터에서 검색 API 애플리케이션을 등록하고 권한을 받아야 합니다.
            </p>
          </div>
        </div>
      )
    }

    if (placeInfo.length === 0 || selectedPlaceIndex === -1) {
      return (
        <div className='place-info-card'>
          <h3 className='place-info-title'>검색 결과</h3>
          <div className='place-info-content'>
            {placeInfo.length === 0 ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              <>
                <p>검색된 {placeInfo.length}개의 장소가 있습니다.</p>
                <p className='text-sm mt-2'>지도에서 번호를 클릭하여 상세 정보를 확인하세요.</p>
              </>
            )}
          </div>
        </div>
      )
    }

    const place = placeInfo[selectedPlaceIndex]
    if (!place) return null

    return (
      <div className='place-info-card'>
        <h3 className='place-info-title'>{place.title.replace(/<[^>]*>/g, '')}</h3>
        <div className='place-info-content'>
          <p>
            <strong>카테고리:</strong> {place.category}
          </p>
          <p>
            <strong>주소:</strong> {place.roadAddress || place.address}
          </p>
          {place.telephone && (
            <p>
              <strong>전화:</strong> {place.telephone}
            </p>
          )}
          {place.description && (
            <p>
              <strong>설명:</strong> {place.description}
            </p>
          )}

          <div className='place-info-actions'>
            <a
              href={place.link}
              target='_blank'
              rel='noopener noreferrer'
              className='place-info-link text-center'
            >
              네이버 플레이스에서 보기
            </a>

            <button
              className={`save-place-btn ${isSaving ? 'saving' : ''}`}
              onClick={saveSelectedPlace}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className='save-spinner'></span>
                  저장 중...
                </>
              ) : (
                '내 맛집 목록에 저장'
              )}
            </button>

            {saveSuccess && (
              <div className='save-success-message'>✓ 가게가 성공적으로 저장되었습니다!</div>
            )}

            {saveError && <div className='save-error-message'>✗ {saveError}</div>}
          </div>
        </div>
      </div>
    )
  }

  // 검색 결과 목록 렌더링
  const renderPlaceList = () => {
    if (placeInfo.length === 0) return null

    return (
      <div className='place-list-overlay'>
        <div className='place-list-card'>
          <h3 className='place-list-title'>검색 결과 ({placeInfo.length})</h3>
          <div className='place-list-content'>
            <ul className='place-list'>
              {placeInfo.map((place, index) => (
                <li
                  key={index}
                  className={`place-list-item ${selectedPlaceIndex === index ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedPlaceIndex(index)
                    // 지도 이동
                    if (mapInstanceRef.current && searchMarkersRef.current[index]) {
                      const position = searchMarkersRef.current[index].getPosition()
                      mapInstanceRef.current.setCenter(position)
                      mapInstanceRef.current.setZoom(18)
                    }
                  }}
                >
                  <span className='place-list-number'>{index + 1}</span>
                  <span className='place-list-name'>{place.title.replace(/<[^>]*>/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='relative w-full h-full'>
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
            <div className='mt-4 text-sm text-gray-500'>
              <p>네이버 클라우드 플랫폼에서 다음 사항을 확인하세요:</p>
              <ul className='list-disc pl-5 mt-2 text-left'>
                <li>API 키(클라이언트 ID)가 올바른지 확인</li>
                <li>웹 서비스 URL에 현재 도메인이 등록되어 있는지 확인</li>
                <li>개발 환경이라면 localhost:3000이 등록되어 있어야 함</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div ref={mapRef} className='w-full h-full' />

      {/* 현재 위치로 돌아오는 버튼 */}
      <button
        onClick={() => {
          if (mapInstanceRef.current && window.naver) {
            // 현재 내 위치 가져오기
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentLocation = new window.naver.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                )

                // 지도 중심 이동 및 줌 레벨 설정
                mapInstanceRef.current?.setCenter(currentLocation)
                mapInstanceRef.current?.setZoom(16)

                // 알림 표시
                alert('현재 위치로 이동했습니다.')
              },
              () => {
                alert('위치 정보를 가져오는데 실패했습니다. 브라우저 위치 권한을 확인해주세요.')
              }
            )
          }
        }}
        className='absolute bottom-10 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 z-50'
        title='현재 위치로 이동'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      </button>

      {placeInfo.length > 0 && renderPlaceList()}

      {(selectedRestaurant || placeInfo.length > 0) && (
        <div className='place-info-overlay'>
          {isPlaceLoading ? (
            <div className='place-info-loading'>
              <div className='animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mr-2'></div>
              <span>정보를 불러오는 중...</span>
            </div>
          ) : (
            renderPlaceInfoCard()
          )}
        </div>
      )}

      <style jsx global>{`
        /* 기존 스타일 */
        .marker {
          padding: 5px 10px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        .marker:hover {
          transform: scale(1.05);
        }
        .marker.selected {
          background: #4a56e2;
          color: white;
          border-color: #4a56e2;
          font-weight: bold;
        }

        /* 검색 마커 스타일 */
        .search-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        .search-marker:hover {
          transform: scale(1.1);
          background: #ff5252;
        }

        /* 정보창 스타일 */
        .info-window {
          background: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          max-width: 200px;
        }
        .info-window h3 {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .info-window p {
          margin: 3px 0;
          font-size: 12px;
        }
        .place-details-btn {
          margin-top: 8px;
          padding: 4px 8px;
          background: #4a56e2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .place-details-btn:hover {
          background: #3a46d2;
        }

        /* 장소 정보 스타일 */
        .place-info-overlay {
          position: absolute;
          bottom: 20px;
          right: 20px;
          max-width: 300px;
          z-index: 1000;
        }
        .place-info-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .place-info-title {
          padding: 12px 16px;
          background: #4a56e2;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        .place-info-content {
          padding: 12px 16px;
        }
        .place-info-content p {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.4;
        }
        .place-info-link {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 12px;
          background: #03c75a;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
        }
        .place-info-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .place-info-error .place-info-title {
          background: #e53e3e;
        }

        /* 장소 목록 스타일 */
        .place-list-overlay {
          position: absolute;
          top: 20px;
          left: 20px;
          max-width: 300px;
          z-index: 1000;
        }
        .place-list-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          max-height: 500px;
          display: flex;
          flex-direction: column;
        }
        .place-list-title {
          padding: 12px 16px;
          background: #4a56e2;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        .place-list-content {
          padding: 8px;
          overflow-y: auto;
          max-height: 400px;
        }
        .place-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .place-list-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.2s;
        }
        .place-list-item:hover {
          background-color: #f5f5f5;
        }
        .place-list-item.selected {
          background-color: #e8f0fe;
        }
        .place-list-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          font-size: 12px;
          margin-right: 10px;
        }
        .place-list-name {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        /* 저장 버튼 스타일 */
        .place-info-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }

        .save-place-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          background: #4a56e2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-place-btn:hover {
          background: #3a46d2;
        }

        .save-place-btn.saving {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .save-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          margin-right: 8px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .save-success-message {
          color: #10b981;
          font-size: 14px;
          margin-top: 5px;
        }

        .save-error-message {
          color: #ef4444;
          font-size: 14px;
          margin-top: 5px;
        }
      `}</style>
    </div>
  )
}
