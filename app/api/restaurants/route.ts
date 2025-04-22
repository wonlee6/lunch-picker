import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// 가게 정보 인터페이스
interface RestaurantData {
  id: string
  name: string
  category: string
  address: string
  lat: number
  lng: number
  imageUrl?: string
  priceRange?: number
  rating?: number
}

// POST - 새 가게 추가
export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const data: RestaurantData = await request.json()

    // 필수 필드 검증
    if (!data.name || !data.category || !data.address || data.lat == null || data.lng == null) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 정보가 누락되었습니다 (이름, 카테고리, 주소, 위치 정보가 필요합니다)'
        },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 기본값 설정
    const restaurantData = {
      name: data.name,
      category: data.category,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
      priceRange: data.priceRange || 2,
      rating: data.rating || 4.0,
      like: 0
    }

    // 데이터베이스에 저장
    const { error } = await supabase.from('lunch_picker').insert(restaurantData)

    if (error) {
      return NextResponse.json(
        { success: false, error: `데이터 저장 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '가게 정보가 성공적으로 저장되었습니다',
      data: restaurantData
    })
  } catch {
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// GET - 저장된 가게 목록 조회
export async function GET() {
  try {
    // Supabase 클라이언트 생성
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 데이터 조회
    const { data, error } = await supabase.from('lunch_picker').select()

    if (error) {
      return NextResponse.json(
        { success: false, error: `데이터 조회 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
