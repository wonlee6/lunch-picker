'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Category, Restaurant } from '@/types/restaurant'
import { RestaurantPicker } from '@/components/features/restaurant/RestaurantPicker'
import { RestaurantCard } from '@/components/features/restaurant/RestaurantCard'
import { MapView } from '@/components/features/map/MapView'
import { RestaurantAddModal } from '@/components/features/restaurant/RestaurantAddModal'
import { Button } from '@/components/common/ui/button'

interface RestaurantContainerProps {
  initialRestaurants: Restaurant[]
}

export function RestaurantContainer({ initialRestaurants }: RestaurantContainerProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveRestaurant = (newRestaurant: Restaurant) => {
    setRestaurants((prev) => [...prev, newRestaurant])
  }

  return (
    <div className='flex flex-col lg:flex-row gap-4 h-full'>
      <div className='lg:w-1/3'>
        <Card className='h-auto'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>점심 메뉴 고르기</CardTitle>
            <Button onClick={handleOpenModal} variant={'ghost'}>
              가게 추가하기
            </Button>
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

      <div className='lg:w-2/3 flex-1 h-full'>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>위치 보기</CardTitle>
          </CardHeader>
          <CardContent className='p-0 h-[calc(100%-80px)]'>
            <MapView selectedRestaurant={selectedRestaurant} restaurants={restaurants} />
          </CardContent>
        </Card>
      </div>

      <RestaurantAddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRestaurant}
      />
    </div>
  )
}
