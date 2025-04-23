import { Category } from '@/types'

export const CATEGORIES: Array<{ value: Category | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: '한식', label: '한식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '양식', label: '양식' },
  { value: '분식', label: '분식' },
  { value: '패스트푸드', label: '패스트푸드' },
  { value: '카페', label: '카페' },
  { value: '음식점', label: '기타' }
]
