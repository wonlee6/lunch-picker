import { useEffect, useState } from 'react'

// kakao 타입 선언
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any
  }
}

export const useKakaoMap = (mapRef: React.RefObject<HTMLDivElement | null>) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!mapRef || !mapRef.current) return

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false&libraries=services,clusterer,drawing`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        const imageSize = new window.kakao.maps.Size(30, 30)
        const imageOption = { offset: new window.kakao.maps.Point(0, 40) }
        const markerImage = new window.kakao.maps.MarkerImage(
          'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          imageSize,
          imageOption
        )

        const mapOption = {
          center: new window.kakao.maps.LatLng(37.507678, 127.054957),
          level: 3
        }
        const mapInstance = new window.kakao.maps.Map(mapRef.current, mapOption)
        // 커스텀 마커 추가 (MarkerImage 적용)
        new window.kakao.maps.Marker({
          position: mapOption.center,
          image: markerImage,
          map: mapInstance
        })
        setMap(mapInstance)
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [mapRef])

  return map
}
