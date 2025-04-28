import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('query')

  if (!keyword) {
    return NextResponse.json(
      { error: '검색어를 제공해야 합니다.', success: false },
      { status: 400 }
    )
  }

  const kakaoRestAPIKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
  if (!kakaoRestAPIKey) {
    return NextResponse.json(
      { error: '카카오 API 인증 정보가 누락되었습니다.', success: false },
      { status: 500 }
    )
  }
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?y=37.507678&x=127.054957&radius=1000&size=15&category_group_code=FD6&query=${encodeURIComponent(
      keyword
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${kakaoRestAPIKey}`
      }
    }
  )

  if (!response.ok) {
    let errorMessage = `카카오 API 호출 실패: ${response.status}`
    // 401 오류 처리 (가장 흔한 오류)
    if (response.status === 401) {
      errorMessage = '카카오 API 인증 실패'
    }

    return NextResponse.json({ error: errorMessage, success: false }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data.documents)
}
