'use client'

import { useState, useCallback, useEffect } from 'react'
import { Restaurant } from '@/types/restaurant'
import { v4 as uuidv4 } from 'uuid'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog'
import { Input } from '@/components/common/ui/input'
import { Button } from '@/components/common/ui/button'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface RestaurantAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Restaurant) => void
}

// API 응답의 기본 형태 (타입스크립트 추론용)
interface ApiSearchResult {
  title: string
  address: string
  roadAddress: string
  category: string
  link: string
  mapx: string // 네이버 API는 문자열로 반환
  mapy: string // 네이버 API는 문자열로 반환
  // lat, lng 등 다른 필드는 Restaurant 타입 매핑 시 사용 안 함
}

// API 호출 및 Restaurant 타입으로 변환하는 함수
const fetchAndMapSearchResults = async (query: string): Promise<Restaurant[]> => {
  if (!query.trim()) {
    return []
  }
  const response = await fetch(`/api/search-place?query=${encodeURIComponent(query)}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || '검색 중 오류가 발생했습니다')
  }
  const data: ApiSearchResult[] = await response.json()

  if (Array.isArray(data)) {
    // API 결과를 Restaurant 타입으로 매핑
    return data.map((item) => ({
      id: uuidv4(), // 새 ID 생성
      title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      link: item.link,
      category: item.category, // 카테고리 매핑은 선택 시 수행
      address: item.address,
      roadAddress: item.roadAddress,
      mapx: parseFloat(item.mapx), // 문자열 -> 숫자 변환
      mapy: parseFloat(item.mapy), // 문자열 -> 숫자 변환
      like: 0 // 기본값
    }))
  } else {
    throw new Error('검색 결과를 처리할 수 없습니다.')
  }
}

export function RestaurantAddModal({ isOpen, onClose, onSave }: RestaurantAddModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)

  const {
    data: searchResults, // 이제 Restaurant[] 타입
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
    [onSave, onClose, supabase, isSaving]
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

            <div className='border rounded-md overflow-y-auto min-h-[200px] flex items-center justify-center'>
              {isActuallySearching ? (
                <div className='p-8 text-center text-muted-foreground'>
                  <span className='animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full inline-block mr-2'></span>
                  검색 중...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <ul className='divide-y w-full'>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      className={`p-3 transition-colors ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'
                      }`}
                      onClick={() => !isSaving && handleSelectSearchResult(result)}
                    >
                      <div className='font-medium'>{result.title}</div>
                      <div className='text-sm text-muted-foreground'>
                        {result.roadAddress || result.address}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>{result.category}</div>
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
