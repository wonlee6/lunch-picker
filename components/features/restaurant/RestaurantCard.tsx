import { Restaurant } from '@/types/restaurant'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/common/ui/card'
import { Separator } from '@/components/common/ui/separator'
import { Button } from '@/components/common/ui/button'

export interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className='mt-6 py-4 gap-2'>
      <CardHeader>
        <CardTitle>{restaurant.place_name}</CardTitle>
        <div className='flex justify-between items-center'>
          <CardDescription>{restaurant.category_name}</CardDescription>
          {restaurant.place_url && (
            <div className='text-right'>
              <Button className='text-blue-500' variant='link' size='sm' asChild>
                <a href={restaurant.place_url} target='_blank' rel='noopener noreferrer'>
                  홈페이지 바로가기
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Separator />
          <p className='text-sm'>주소: {restaurant.road_address_name}</p>
        </div>
      </CardContent>
    </Card>
  )
}
