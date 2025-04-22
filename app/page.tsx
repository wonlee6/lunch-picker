import { RestaurantContainer } from '@/components/features/restaurant/RestaurantContainer'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('lunch_picker').select()

  const processedData =
    data?.map((restaurant) => ({
      ...restaurant,
      menu: typeof restaurant.menu === 'string' ? JSON.parse(restaurant.menu) : restaurant.menu
    })) || []

  return (
    <div className='flex flex-col h-screen p-4 md:p-8'>
      <header className='mb-4'>
        <h1 className='text-3xl font-bold text-center'>오늘 점심 뭐 먹지?</h1>
        <p className='text-center text-muted-foreground mt-2'>회사 근처 맛집 랜덤 추천!</p>
      </header>

      <div className='flex-1 h-[calc(100vh-120px)]'>
        <RestaurantContainer initialRestaurants={processedData} />
      </div>
    </div>
  )
}
