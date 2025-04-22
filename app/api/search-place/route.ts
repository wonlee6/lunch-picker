import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 제공해야 합니다.', success: false },
        { status: 400 }
      )
    }

    // 네이버 API 클라이언트 ID와 시크릿 확인
    const clientId =
      process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    const clientSecret =
      process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: '네이버 API 인증 정보가 누락되었습니다.', success: false },
        { status: 500 }
      )
    }

    // 강남구 위치를 검색어에 추가
    const finalQuery = `${query} 강남구`

    // 네이버 장소 검색 API 호출
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        finalQuery
      )}&display=30`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret
        }
      }
    )
    if (!response.ok) {
      let errorMessage = `네이버 API 호출 실패: ${response.status}`

      // 401 오류 처리 (가장 흔한 오류)
      if (response.status === 401) {
        errorMessage =
          '네이버 API 인증 실패: API 키를 확인하고, 네이버 개발자 센터에서 검색 API 권한이 부여되었는지 확인하세요.'
      }

      return NextResponse.json({ error: errorMessage, success: false }, { status: response.status })
    }

    const data = await response.json()

    // 검색 결과에 위도/경도 좌표를 추가
    const processedItems =
      (data.items &&
        data.items.map((item) => {
          return {
            ...item,
            lat: parseFloat(item.mapy) / 10000000, // 단순화된 변환
            lng: parseFloat(item.mapx) / 10000000 // 단순화된 변환
          }
        })) ||
      []

    // 강남구 데이터만 필터링 (주소에 '강남구'가 포함된 결과만)
    const gangnamResults = processedItems.filter(
      (item: { roadAddress: string; category: string }) =>
        item.roadAddress.includes('테헤란로') ||
        (item.roadAddress.includes('삼성로') && item.category.startsWith('음식점'))
    )
    return NextResponse.json(gangnamResults)
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다', success: false }, { status: 500 })
  }
}
