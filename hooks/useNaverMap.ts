import { useEffect, useRef, useCallback, useState } from 'react'

declare global {
  interface Window {
    naver: typeof naver
  }
}

export default function useNaverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)

  const initializeMap = useCallback(() => {
    if (!window.naver || !mapRef.current) return
    const initialPosition = new window.naver.maps.LatLng(37.507678, 127.054957)
    const mapOptions: naver.maps.MapOptions = {
      center: initialPosition,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
      mapTypeControl: true,
      scaleControl: true,
      minZoom: 12,
    }
    mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)
    setIsMapLoading(false)
  }, [])

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    if (!clientId) {
      setIsMapLoading(false)
      setMapError('API 클라이언트 ID가 설정되지 않았습니다')
      return
    }
    const existingScript = document.querySelector('script[src*="maps.js"]')
    if (existingScript) {
      if (window.naver) initializeMap()
      else {
        existingScript.addEventListener('load', initializeMap)
        existingScript.addEventListener('error', () => {
          setIsMapLoading(false)
          setMapError('지도 API를 로드할 수 없습니다.')
        })
      }
      return
    }
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder,drawing,visualization,panorama,drawing,search`
    script.async = true
    script.onload = initializeMap
    script.onerror = () => {
      setIsMapLoading(false)
      setMapError('지도 API를 로드할 수 없습니다.')
    }
    document.head.appendChild(script)
    return () => {
      if (script.parentNode) document.head.removeChild(script)
    }
  }, [initializeMap])

  return { mapRef, map: mapInstanceRef.current, isMapLoading, mapError }
}
