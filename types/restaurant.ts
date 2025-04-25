export interface Restaurant {
  id: string
  place_name: string
  place_url: string
  category_name: string
  address_name: string
  road_address_name: string
  category_group_code: string
  category_group_name: string
  distance: string
  phone: string
  x: number
  y: number
}

export const categoryList = ['한식', '중식', '일식', '양식', '분식', '패스트푸드', '카페'] as const
export type Category = (typeof categoryList)[number]
