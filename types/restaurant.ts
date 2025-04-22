export interface Restaurant {
  id: string
  name: string
  category: string
  address: string
  lat: number
  lng: number
  rating: number
  priceRange: 1 | 2 | 3
  imageUrl?: string
  like: number
}

export type PriceRange = 1 | 2 | 3

export type Category = '한식' | '중식' | '일식' | '양식' | '분식' | '패스트푸드' | '카페' | '기타'
