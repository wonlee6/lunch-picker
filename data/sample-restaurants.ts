import {Restaurant} from "@/types/restaurant";

export const sampleRestaurants: Restaurant[] = [
    {
        id: "1",
        name: "맛있는 한식당",
        category: "한식",
        address: "서울시 강남구 역삼동 123-45",
        lat: 37.502544,
        lng: 127.042842,
        rating: 4.5,
        priceRange: 2,
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733",
        menu: [
            {
                id: "101",
                name: "김치찌개",
                price: 8000,
                description: "국내산 돼지고기와 신선한 김치로 끓인 찌개"
            },
            {
                id: "102",
                name: "된장찌개",
                price: 8000,
                description: "국내산 콩으로 만든 된장으로 끓인 찌개"
            },
            {
                id: "103",
                name: "제육볶음",
                price: 10000,
                description: "매콤하게 볶아낸 국내산 돼지고기 요리"
            }
        ],
        votes: 28
    },
    {
        id: "2",
        name: "홍콩반점",
        category: "중식",
        address: "서울시 강남구 삼성동 45-67",
        lat: 37.506044,
        lng: 127.053814,
        rating: 4.2,
        priceRange: 2,
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
        menu: [
            {
                id: "201",
                name: "짜장면",
                price: 6000,
                description: "춘장과 야채, 돼지고기를 볶아 만든 소스와 면"
            },
            {
                id: "202",
                name: "짬뽕",
                price: 7000,
                description: "해산물과 매운 국물에 면을 넣은 요리"
            },
            {
                id: "203",
                name: "탕수육",
                price: 15000,
                description: "바삭하게 튀긴 돼지고기에 새콤달콤한 소스"
            }
        ],
        votes: 42
    },
    {
        id: "3",
        name: "스시히로",
        category: "일식",
        address: "서울시 강남구 청담동 78-90",
        lat: 37.519347,
        lng: 127.049834,
        rating: 4.8,
        priceRange: 3,
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        menu: [
            {
                id: "301",
                name: "모듬초밥",
                price: 25000,
                description: "12가지 신선한 해산물 초밥"
            },
            {
                id: "302",
                name: "연어초밥",
                price: 15000,
                description: "노르웨이산 연어를 사용한 초밥"
            },
            {
                id: "303",
                name: "우동",
                price: 8000,
                description: "진한 국물의 일본식 면 요리"
            }
        ],
        votes: 15
    },
    {
        id: "4",
        name: "라 트라토리아",
        category: "양식",
        address: "서울시 강남구 신사동 12-34",
        lat: 37.527624,
        lng: 127.03884,
        rating: 4.6,
        priceRange: 3,
        imageUrl: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85",
        menu: [
            {
                id: "401",
                name: "카르보나라",
                price: 16000,
                description: "생크림 소스의 파스타 요리"
            },
            {
                id: "402",
                name: "마르게리타 피자",
                price: 18000,
                description: "토마토, 모짜렐라, 바질을 토핑한 클래식 피자"
            },
            {
                id: "403",
                name: "티본스테이크",
                price: 45000,
                description: "최상급 소고기로 만든 스테이크"
            }
        ],
        votes: 23
    },
    {
        id: "5",
        name: "분식이네",
        category: "분식",
        address: "서울시 강남구 논현동 56-78",
        lat: 37.511147,
        lng: 127.021658,
        rating: 4.0,
        priceRange: 1,
        imageUrl: "https://images.unsplash.com/photo-1626520839353-401d7d837960",
        menu: [
            {
                id: "501",
                name: "떡볶이",
                price: 4000,
                description: "쫄깃한 떡과 매콤한 고추장 소스"
            },
            {
                id: "502",
                name: "김밥",
                price: 3500,
                description: "신선한 야채와 햄을 넣은 김밥"
            },
            {
                id: "503",
                name: "라면",
                price: 4000,
                description: "시원한 국물의 라면"
            }
        ],
        votes: 56
    }
];
