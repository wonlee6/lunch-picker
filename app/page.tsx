import { RestaurantContainer } from '@/components/features/restaurant/RestaurantContainer'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  // API에서 메뉴 데이터 가져오기
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 테이블 이름에 하이픈(-) 대신 언더스코어(_) 사용
  const { data, error } = await supabase.from('lunch_picker').select()

  const processedData =
    data?.map((restaurant) => ({
      ...restaurant,
      menu: typeof restaurant.menu === 'string' ? JSON.parse(restaurant.menu) : restaurant.menu
    })) || []

  console.log(data)

  return (
    <div className='min-h-screen p-4 md:p-8'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-center'>오늘 점심 뭐 먹지?</h1>
        <p className='text-center text-muted-foreground mt-2'>회사 근처 맛집 랜덤 추천!</p>
      </header>

      <RestaurantContainer initialRestaurants={processedData} />
    </div>
  )
}
