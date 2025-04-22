'use client'

import { useState } from 'react'
import { Restaurant } from '@/types/restaurant'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/common/ui/input'
import { Button } from '@/components/common/ui/button'
import { Label } from '@/components/common/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card'
import { CATEGORIES } from '@/constants/categories'

interface RestaurantFormProps {
  initialData?: Restaurant
  onSubmit: (data: Restaurant) => void
  onCancel: () => void
}

export function RestaurantForm({ initialData, onSubmit, onCancel }: RestaurantFormProps) {
  const [formData, setFormData] = useState<Restaurant>({
    id: initialData?.id || uuidv4(),
    name: initialData?.name || '',
    category: initialData?.category || '한식',
    address: initialData?.address || '',
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    rating: initialData?.rating || 4.0,
    priceRange: initialData?.priceRange || 2,
    imageUrl:
      initialData?.imageUrl || 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
    like: initialData?.like || 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'rating' || name === 'lat' || name === 'lng') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'priceRange') {
      const priceValue = parseInt(value)
      setFormData((prev) => ({
        ...prev,
        [name]: priceValue as 1 | 2 | 3
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader className='px-0 pt-0'>
        <CardTitle className='text-2xl'>
          {initialData ? '가게 정보 수정' : '새 가게 추가'}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-muted/40 rounded-lg p-4'>
            <h3 className='text-lg font-medium mb-4'>기본 정보</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>가게 이름 *</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>카테고리 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='카테고리 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((cat) => cat.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address'>주소 *</Label>
                <Input
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lat'>위도 *</Label>
                <Input
                  type='number'
                  id='lat'
                  name='lat'
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  step='any'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lng'>경도 *</Label>
                <Input
                  type='number'
                  id='lng'
                  name='lng'
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  step='any'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='imageUrl'>이미지 URL</Label>
                <Input
                  id='imageUrl'
                  name='imageUrl'
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='priceRange'>가격대</Label>
                <Select
                  value={formData.priceRange.toString()}
                  onValueChange={(value) => handleSelectChange('priceRange', value)}
                >
                  <SelectTrigger id='priceRange'>
                    <SelectValue placeholder='가격대 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>₩ (저렴함)</SelectItem>
                    <SelectItem value='2'>₩₩ (보통)</SelectItem>
                    <SelectItem value='3'>₩₩₩ (비쌈)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='rating'>평점</Label>
                <Input
                  type='number'
                  id='rating'
                  name='rating'
                  value={formData.rating}
                  onChange={handleChange}
                  min='1'
                  max='5'
                  step='0.1'
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3 px-4'>
            <Button type='button' variant='outline' onClick={onCancel}>
              취소
            </Button>
            <Button type='submit'>{'저장'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
