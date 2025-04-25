'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Category, Restaurant } from '@/types/restaurant'
import { RestaurantPicker } from '@/components/features/restaurant/RestaurantPicker'
import { RestaurantCard } from '@/components/features/restaurant/RestaurantCard'
import { MapView } from '@/components/features/map/MapView'
import { RestaurantAddModal } from '@/components/features/restaurant/RestaurantAddModal'
import { Button } from '@/components/common/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/ui/tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/common/ui/table'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/common/ui/alert-dialog'
import { supabase } from '@/lib/services/supabase'
import { toast } from 'sonner'

interface RestaurantContainerProps {
  initialRestaurants: Restaurant[]
}

export function RestaurantContainer({ initialRestaurants }: RestaurantContainerProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePickRandom = () => {
    if (filteredRestaurantsList.length === 0) return

    const randomIndex = Math.floor(Math.random() * filteredRestaurantsList.length)
    setSelectedRestaurant(filteredRestaurantsList[randomIndex])
  }

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category)
    setSelectedRestaurant(null)
  }

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveRestaurant = (newRestaurant: Restaurant) => {
    if (!restaurants.some((r) => r.id === newRestaurant.id)) {
      setRestaurants((prev) => [...prev, newRestaurant])
    }
    if (selectedRestaurant?.id === newRestaurant.id) {
      setSelectedRestaurant(newRestaurant)
    }
  }

  const handleDeleteRestaurant = async (id: Restaurant['id']) => {
    const { error } = await supabase.from('lunch_picker').delete().eq('id', id)
    if (!error) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id))
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant(null)
      }
      toast.success('가게 정보가 성공적으로 삭제되었습니다.')
    } else {
      toast.error('데이터 처리 중 예기치 않은 오류가 발생했습니다.')
    }
  }

  const filteredRestaurantsList = useMemo(() => {
    return selectedCategory === 'all'
      ? restaurants
      : restaurants.filter((r) => r.category_name.includes(selectedCategory))
  }, [restaurants, selectedCategory])

  return (
    <div className='flex flex-col lg:flex-row gap-4 h-full'>
      <div className='lg:w-1/3 flex flex-col gap-4'>
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
          <RestaurantCard restaurant={selectedRestaurant} onReset={handlePickRandom} />
        )}
      </div>

      <div className='lg:w-2/3 flex-1 h-full'>
        <Tabs className='size-full' defaultValue='map'>
          <TabsList>
            <TabsTrigger value='map'>위치 보기</TabsTrigger>
            <TabsTrigger value='info'>가게 리스트</TabsTrigger>
          </TabsList>
          <TabsContent value='map'>
            <Card className='h-full p-0 gap-0'>
              <CardHeader className='pt-2'>
                <CardTitle className='text-lg'>위치 보기</CardTitle>
              </CardHeader>
              <CardContent className='p-2 h-full'>
                <MapView
                  selectedRestaurant={selectedRestaurant}
                  restaurants={filteredRestaurantsList}
                  onSelectRestaurant={handleSelectRestaurant}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='info'>
            <RestaurantList
              restaurants={filteredRestaurantsList}
              onDelete={handleDeleteRestaurant}
            />
          </TabsContent>
        </Tabs>
      </div>

      <RestaurantAddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRestaurant}
      />
    </div>
  )
}

function RestaurantList({
  restaurants,
  onDelete
}: {
  restaurants: Restaurant[]
  onDelete: (id: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>가게명</TableHead>
          <TableHead className='text-center'>카테고리</TableHead>
          <TableHead className='text-center'>주소</TableHead>
          <TableHead className='text-center'>액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {restaurants.map((rest) => (
          <TableRow key={rest.id}>
            <TableCell>{rest.place_name}</TableCell>
            <TableCell>{rest.category_name}</TableCell>
            <TableCell>{rest.road_address_name}</TableCell>
            <TableCell className='flex gap-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 해당 식당 정보를 영구히 삭제합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await onDelete(rest.id)
                      }}
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
