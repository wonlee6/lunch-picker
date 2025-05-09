import { RestaurantContainer } from '@/components/features/restaurant/RestaurantContainer'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

const HEADER_HEIGHT = 120
const HEADER_CLASS = 'mb-4'
const TITLE_CLASS = 'text-3xl font-bold text-center'
const SUBTITLE_CLASS = 'text-center text-muted-foreground mt-2'
const CONTAINER_CLASS = 'flex flex-col h-screen p-4 md:p-8'

export const metadata: Metadata = {
  metadataBase: new URL('https://bizflow-lunch-picker.vercel.app/'),
  title: '오늘 점심 뭐 먹지?',
  description: '회사 근처 맛집을 랜덤으로 추천해주는 서비스입니다.',
  openGraph: {
    title: '오늘 점심 뭐 먹지?',
    description: '회사 근처 맛집을 랜덤으로 추천해주는 서비스입니다.',
    images: [
      {
        url: '/cat.jpeg',
        width: 800,
        height: 600,
        alt: '대표 이미지 설명'
      }
    ],
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '오늘 점심 뭐 먹지?',
    description: '회사 근처 맛집을 랜덤으로 추천해주는 서비스입니다.',
    images: ['/cat.jpeg']
  }
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('lunch_picker').select()

  const processedData =
    data?.map((restaurant) => {
      const isMenuString = typeof restaurant.menu === 'string'
      return {
        ...restaurant,
        menu: isMenuString ? JSON.parse(restaurant.menu) : restaurant.menu
      }
    }) || []

  return (
    <div className={CONTAINER_CLASS}>
      <header className={HEADER_CLASS}>
        <h1 className={TITLE_CLASS}>오늘 점심 뭐 먹지?</h1>
        <p className={SUBTITLE_CLASS}>회사 근처 맛집 랜덤 추천!</p>
      </header>

      <div className={`flex-1 h-[calc(100vh-${HEADER_HEIGHT}px)]`}>
        <RestaurantContainer initialRestaurants={processedData} />
      </div>
    </div>
  )
}
