'use client'

import { useState, useCallback, useEffect } from 'react'
import { Restaurant } from '@/types/restaurant'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/common/ui/dialog'
import { Input } from '@/components/common/ui/input'
import { Button } from '@/components/common/ui/button'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface RestaurantAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Restaurant) => void
  restaurants: Restaurant[]
}

const fetchAndMapSearchResults = async (query: string): Promise<Restaurant[]> => {
  if (!query.trim()) {
    return []
  }
  const response = await fetch(`/api/search-place?query=${encodeURIComponent(query)}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || '검색 중 오류가 발생했습니다')
  }
  const data: Restaurant[] = await response.json()
  return data.map((item) => ({ ...item, id: uuidv4(), x: Number(item.x), y: Number(item.y) }))
}

export function RestaurantAddModal({
  isOpen,
  onClose,
  onSave,
  restaurants
}: RestaurantAddModalProps) {
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const {
    data: searchResults,
    error,
    isError,
    isLoading,
    isFetching,
    refetch
  } = useQuery<Restaurant[], Error>({
    queryKey: ['searchPlaces', searchQuery],
    queryFn: () => fetchAndMapSearchResults(searchQuery),
    enabled: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000
  })

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      refetch()
    }
  }, [searchQuery, refetch])

  const handleSelectSearchResult = useCallback(
    async (selectedRest: Restaurant) => {
      if (isSaving) return

      const hasRest = restaurants.some(
        (i) =>
          i.place_name === selectedRest.place_name &&
          i.road_address_name === selectedRest.road_address_name
      )
      if (hasRest) {
        toast.error('동일한 가게 정보가 이미 등록되어 있습니다.')
        return
      }

      setIsSaving(true)

      try {
        const { error: insertError } = await supabase.from('lunch_picker').insert([selectedRest])

        if (insertError) {
          toast.error(`데이터 저장 중 오류 발생: ${insertError.message}`)
          return
        }

        toast.success('가게 정보가 성공적으로 저장되었습니다.')
        onSave(selectedRest)
        onClose()
      } catch {
        toast.error('데이터 처리 중 예기치 않은 오류가 발생했습니다.')
      } finally {
        setIsSaving(false)
      }
    },
    [onSave, onClose, supabase, isSaving, restaurants]
  )

  const handleClose = useCallback(() => {
    if (isSaving) return
    onClose()
  }, [onClose, isSaving])

  useEffect(() => {
    if (!isOpen) {
      setIsSaving(false)
    }
  }, [isOpen])

  const isActuallySearching = isLoading || isFetching

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()} modal>
      <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col z-[220]'>
        <DialogHeader>
          <DialogTitle>가게 검색</DialogTitle>
          <DialogDescription>회사 중심으로 반경 1km 가게만 노출됩니다.</DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto py-4 flex-1'>
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Input
                placeholder='가게 이름 또는 주소 검색'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='flex-1'
                disabled={isSaving}
                maxLength={100}
              />
              <Button
                onClick={handleSearch}
                disabled={isActuallySearching || !searchQuery.trim() || isSaving}
                className='flex-shrink-0'
              >
                {!isActuallySearching && (
                  <span className='flex items-center gap-2'>
                    <Search className='h-4 w-4' />
                    검색
                  </span>
                )}
                {isActuallySearching && (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    검색 중...
                  </span>
                )}
              </Button>
            </div>

            {isError && (
              <div className='bg-destructive/10 text-destructive text-sm p-3 rounded-md'>
                {error?.message || '검색 중 오류가 발생했습니다.'}
              </div>
            )}

            <div className='border rounded-md overflow-y-auto h-[400px] flex items-center justify-center'>
              {isActuallySearching ? (
                <div className='p-8 text-center text-muted-foreground'>
                  <span className='animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full inline-block mr-2'></span>
                  검색 중...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <ul className='divide-y size-full'>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      className={`p-3 transition-colors ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'
                      }`}
                      onClick={() => !isSaving && handleSelectSearchResult(result)}
                    >
                      <div className='font-medium'>{result.place_name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {result.road_address_name || result.address_name}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        {result.category_name}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : !isError ? (
                <div className='p-8 text-center text-muted-foreground'>
                  검색 결과가 여기에 표시됩니다.
                  {searchResults === null && ' 이전에 검색한 결과가 없습니다.'}
                  {searchResults?.length === 0 &&
                    ' 검색 결과가 없습니다. 다른 검색어를 시도해보세요.'}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
