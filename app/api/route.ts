import { NextResponse } from 'next/server'
import { sampleRestaurants } from '@/data/sample-restaurants'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: sampleRestaurants
    })
  } catch (error) {
    console.error('API 처리 중 오류 발생:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다', success: false }, { status: 500 })
  }
}
