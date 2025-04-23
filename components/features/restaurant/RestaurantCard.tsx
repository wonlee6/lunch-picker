import { Restaurant } from '@/types/restaurant'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/common/ui/card'
import { Separator } from '@/components/common/ui/separator'
import { Button } from '@/components/common/ui/button'

interface RestaurantCardProps {
  restaurant: Restaurant
  onReset: () => void
}

export const RestaurantCard = ({ restaurant, onReset }: RestaurantCardProps) => {
  return (
    <Card className='mt-6 py-3 gap-2'>
      <CardHeader>
        <CardTitle>{restaurant.title}</CardTitle>
        <div className='flex justify-between items-center'>
          <CardDescription>{restaurant.category}</CardDescription>
          {restaurant.link && (
            <div className='text-right'>
              <Button className='text-blue-500' variant={'link'} size='sm'>
                홈페이지 바로가기
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Separator />
          <p className='text-sm'>주소: {restaurant.address}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant='outline' className='w-full' onClick={onReset}>
          다시 고르기
        </Button>
      </CardFooter>
    </Card>
  )
}
