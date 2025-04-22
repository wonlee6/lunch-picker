export interface Restaurant {
    id: string;
    name: string;
    category: string;
    address: string;
    lat: number;
    lng: number;
    rating: number;
    priceRange: 1 | 2 | 3;
    imageUrl?: string;
    menu?: Menu[];
    votes?: number;
}

export interface Menu {
    id: string;
    name: string;
    price: number;
    description?: string;
}

export type PriceRange = 1 | 2 | 3;

export type Category = "한식" | "중식" | "일식" | "양식" | "분식" | "패스트푸드" | "카페" | "기타";
