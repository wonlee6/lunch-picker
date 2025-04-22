'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Category, Restaurant } from '@/types/restaurant'
import { RestaurantPicker } from '@/components/features/restaurant/RestaurantPicker'
import { RestaurantCard } from '@/components/features/restaurant/RestaurantCard'
import { MapView } from '@/components/features/map/MapView'

interface RestaurantContainerProps {
  initialRestaurants: Restaurant[]
}

export function RestaurantContainer({ initialRestaurants }: RestaurantContainerProps) {
  const [restaurants] = useState<Restaurant[]>(initialRestaurants)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')

  const handlePickRandom = () => {
    const filteredRestaurants =
      selectedCategory === 'all'
        ? restaurants
        : restaurants.filter((r) => r.category === selectedCategory)

    if (filteredRestaurants.length === 0) return

    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length)
    setSelectedRestaurant(filteredRestaurants[randomIndex])
  }

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category)
    setSelectedRestaurant(null)
  }

  const handleReset = () => {
    setSelectedRestaurant(null)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-1'>
        <Card>
          <CardHeader>
            <CardTitle>점심 메뉴 고르기</CardTitle>
          </CardHeader>
          <CardContent>
            <RestaurantPicker
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onPickRandom={handlePickRandom}
            />
          </CardContent>
        </Card>

        {selectedRestaurant && (
          <RestaurantCard restaurant={selectedRestaurant} onReset={handleReset} />
        )}
      </div>

      <div className='lg:col-span-2'>
        <Card className='h-[600px]'>
          <CardHeader>
            <CardTitle>위치 보기</CardTitle>
          </CardHeader>
          <CardContent className='p-0 h-[calc(100%-80px)]'>
            <MapView selectedRestaurant={selectedRestaurant} restaurants={restaurants} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
