'use client'

import { useState, useCallback, useEffect } from 'react'
import { Restaurant, Category } from '@/types/restaurant'
import { v4 as uuidv4 } from 'uuid'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog'
import { Input } from '@/components/common/ui/input'
import { Button } from '@/components/common/ui/button'
import { Search } from 'lucide-react'

interface RestaurantAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Restaurant) => void
}

interface SearchResult {
  title: string
  address: string
  roadAddress: string
  category: string
  telephone: string
  lat: number
  lng: number
  link: string
}

export function RestaurantAddModal({ isOpen, onClose, onSave }: RestaurantAddModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // 검색 함수
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await fetch(`/api/search-place?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '검색 중 오류가 발생했습니다')
      }

      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0) {
        setSearchResults(data)
      } else {
        setSearchResults([])
        setSearchError('검색 결과가 없습니다. 다른 검색어를 시도해보세요.')
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  // 검색 결과 선택 함수
  const handleSelectSearchResult = useCallback(
    (result: SearchResult) => {
      // API에서 받은 카테고리 문자열을 Category 타입으로 매핑
      const mapCategory = (apiCategory: string): Category => {
        // 카테고리 문자열에 특정 키워드가 포함되어 있는지 확인
        if (apiCategory.includes('한식')) return '한식'
        if (apiCategory.includes('중식') || apiCategory.includes('중국')) return '중식'
        if (apiCategory.includes('일식') || apiCategory.includes('일본')) return '일식'
        if (apiCategory.includes('양식')) return '양식'
        if (apiCategory.includes('분식')) return '분식'
        if (apiCategory.includes('패스트푸드') || apiCategory.includes('패스트'))
          return '패스트푸드'
        if (apiCategory.includes('카페') || apiCategory.includes('커피')) return '카페'

        // 기본값
        return '기타'
      }

      const restaurantData: Restaurant = {
        id: uuidv4(), // 새 UUID 생성
        name: result.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
        category: mapCategory(result.category),
        address: result.roadAddress || result.address,
        lat: result.lat,
        lng: result.lng,
        rating: 0, // 기본값 설정
        priceRange: 2, // 기본값 설정
        imageUrl: '', // 기본값 설정
        like: 0 // 기본값 설정
      }

      // 검색 결과를 선택하면 바로 저장하고 모달을 닫음
      onSave(restaurantData)
      onClose()
    },
    [onSave, onClose]
  )

  // 모달 닫기 함수
  const handleClose = useCallback(() => {
    // 상태 초기화
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)

    onClose()
  }, [onClose])

  // ESC 키 눌렀을 때 모달 닫기
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setSearchQuery('')
      setSearchResults([])
      setSearchError(null)
    }
  }, [isOpen])

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
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className='flex-shrink-0'
              >
                {isSearching ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    검색 중...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <Search className='h-4 w-4' />
                    검색
                  </span>
                )}
              </Button>
            </div>

            {searchError && (
              <div className='bg-destructive/10 text-destructive text-sm p-3 rounded-md'>
                {searchError}
              </div>
            )}

            <div className='border rounded-md overflow-y-auto'>
              {searchResults.length > 0 ? (
                <ul className='divide-y'>
                  {searchResults.map((result, index) => (
                    <li
                      key={index}
                      className='p-3 hover:bg-muted cursor-pointer transition-colors'
                      onClick={() => handleSelectSearchResult(result)}
                    >
                      <div className='font-medium'>{result.title.replace(/<[^>]*>/g, '')}</div>
                      <div className='text-sm text-muted-foreground'>
                        {result.roadAddress || result.address}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>{result.category}</div>
                    </li>
                  ))}
                </ul>
              ) : !isSearching && !searchError ? (
                <div className='p-8 text-center text-muted-foreground'>
                  검색 결과가 여기에 표시됩니다
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
