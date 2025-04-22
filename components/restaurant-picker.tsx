'use client'

import { Category } from '@/types/restaurant'
import { Button } from './common/ui/button'
import { Separator } from './common/ui/separator'

interface RestaurantPickerProps {
  selectedCategory: Category | 'all'
  onCategoryChange: (category: Category | 'all') => void
  onPickRandom: () => void
}

const categories: Array<{ value: Category | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: '한식', label: '한식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '양식', label: '양식' },
  { value: '분식', label: '분식' },
  { value: '패스트푸드', label: '패스트푸드' },
  { value: '카페', label: '카페' },
  { value: '기타', label: '기타' }
]

export default function RestaurantPicker({
  selectedCategory,
  onCategoryChange,
  onPickRandom
}: RestaurantPickerProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 text-sm font-medium'>카테고리 선택</h3>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className='space-y-2'>
        <Button className='w-full' size='lg' onClick={onPickRandom}>
          랜덤 선택하기
        </Button>
        <p className='text-xs text-center text-muted-foreground'>
          선택한 카테고리에서 랜덤으로 식당을 추천해 드립니다.
        </p>
      </div>
    </div>
  )
}
