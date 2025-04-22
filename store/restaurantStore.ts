import { create } from 'zustand'
import { Restaurant } from '@/types/restaurant'

interface RestaurantState {
  restaurants: Restaurant[]
  selectedRestaurant: Restaurant | null
  setRestaurants: (restaurants: Restaurant[]) => void
  addRestaurant: (restaurant: Restaurant) => void
  updateRestaurant: (restaurant: Restaurant) => void
  deleteRestaurant: (id: string) => void
  selectRestaurant: (restaurant: Restaurant | null) => void
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedRestaurant: null,

  setRestaurants: (restaurants) => set({ restaurants }),

  addRestaurant: (restaurant) =>
    set((state) => ({
      restaurants: [...state.restaurants, restaurant]
    })),

  updateRestaurant: (restaurant) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) => (r.id === restaurant.id ? restaurant : r)),
      selectedRestaurant:
        state.selectedRestaurant?.id === restaurant.id ? restaurant : state.selectedRestaurant
    })),

  deleteRestaurant: (id) =>
    set((state) => ({
      restaurants: state.restaurants.filter((r) => r.id !== id),
      selectedRestaurant: state.selectedRestaurant?.id === id ? null : state.selectedRestaurant
    })),

  selectRestaurant: (restaurant) => set({ selectedRestaurant: restaurant })
}))
