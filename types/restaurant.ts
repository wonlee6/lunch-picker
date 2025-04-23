export interface Restaurant {
  id: string
  title: string
  link: string
  category: string
  address: string
  roadAddress: string
  mapx: number
  mapy: number
  like: number
}

export const categoryList = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '패스트푸드',
  '카페',
  '기타',
  '음식점'
] as const
export type Category = (typeof categoryList)[number]
