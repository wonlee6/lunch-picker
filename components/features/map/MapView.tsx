"use client";

import {useEffect, useRef, useCallback} from "react";
import {Restaurant} from "@/types/restaurant";

// Naver Maps 타입 정의
declare global {
    interface Window {
        naver: {
            maps: {
                Map: new (element: HTMLElement, options: MapOptions) => NaverMap;
                Marker: new (options: MarkerOptions) => NaverMarker;
                InfoWindow: new (options: InfoWindowOptions) => NaverInfoWindow;
                LatLng: new (lat: number, lng: number) => NaverLatLng;
                Size: new (width: number, height: number) => NaverSize;
                Point: new (x: number, y: number) => NaverPoint;
                Event: {
                    addListener: (instance: NaverMap | NaverMarker, eventName: string, handler: () => void) => void;
                };
                Position: {
                    TOP_RIGHT: string;
                };
            };
        };
    }
}

// Naver Maps 인터페이스 정의
interface MapOptions {
    center: NaverLatLng;
    zoom: number;
    zoomControl: boolean;
    zoomControlOptions: {
        position: string;
    };
}

interface MarkerOptions {
    position: NaverLatLng;
    map: NaverMap;
    title?: string;
    icon?: {
        content: string;
        size?: NaverSize;
        anchor?: NaverPoint;
    };
    zIndex?: number;
}

interface InfoWindowOptions {
    content: string;
    borderWidth?: number;
    disableAnchor?: boolean;
    backgroundColor?: string;
}

interface NaverMap {
    setCenter: (latlng: NaverLatLng) => void;
    setZoom: (level: number) => void;
}

interface NaverMarker {
    setMap: (map: NaverMap | null) => void;
}

interface NaverLatLng {
    lat: () => number;
    lng: () => number;
}

interface NaverSize {
    width: number;
    height: number;
}

interface NaverPoint {
    x: number;
    y: number;
}

interface NaverInfoWindow {
    open: (map: NaverMap, marker: NaverMarker) => void;
}

interface MapViewProps {
    selectedRestaurant: Restaurant | null;
    restaurants: Restaurant[];
}

export const MapView = ({selectedRestaurant, restaurants}: MapViewProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<NaverMap | null>(null);
    const markersRef = useRef<NaverMarker[]>([]);

    // 마커 생성 함수를 useCallback으로 메모이제이션
    const createMarkers = useCallback(() => {
        if (!window.naver || !mapInstanceRef.current) return;

        // 기존 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 새 마커 생성
        restaurants.forEach((restaurant) => {
            const markerPosition = new window.naver.maps.LatLng(restaurant.lat, restaurant.lng);

            const marker = new window.naver.maps.Marker({
                position: markerPosition,
                map: mapInstanceRef.current,
                title: restaurant.name,
                icon: {
                    content: `<div class="marker ${selectedRestaurant?.id === restaurant.id ? "selected" : ""}">${
                        restaurant.name
                    }</div>`,
                    size: new window.naver.maps.Size(38, 58),
                    anchor: new window.naver.maps.Point(19, 58)
                },
                zIndex: selectedRestaurant?.id === restaurant.id ? 100 : 80
            });

            // 정보창 생성
            const infoWindow = new window.naver.maps.InfoWindow({
                content: `
          <div class="info-window">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.category} | ${restaurant.address}</p>
            <p>평점: ${restaurant.rating}점</p>
          </div>
        `,
                borderWidth: 0,
                disableAnchor: true,
                backgroundColor: "transparent"
            });

            // 클릭 이벤트
            window.naver.maps.Event.addListener(marker, "click", () => {
                infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
        });
    }, [restaurants, selectedRestaurant]);

    // 지도 초기화 함수를 useCallback으로 메모이제이션
    const initializeMap = useCallback(() => {
        if (!window.naver || !mapRef.current) return;

        // 초기 위치 (서울 강남역)
        const initialPosition = new window.naver.maps.LatLng(37.498095, 127.02761);

        // 맵 인스턴스 생성
        const mapOptions = {
            center: initialPosition,
            zoom: 14,
            zoomControl: true,
            zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT
            }
        };

        mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 모든 식당 마커 생성
        createMarkers();
    }, [createMarkers]);

    // 스크립트 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
        script.async = true;
        script.onload = () => initializeMap();
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, [initializeMap]);

    // 선택된 식당이 변경될 때 지도 이동 및 마커 갱신
    useEffect(() => {
        if (!mapInstanceRef.current || !window.naver) return;

        createMarkers();

        if (selectedRestaurant) {
            const position = new window.naver.maps.LatLng(selectedRestaurant.lat, selectedRestaurant.lng);
            mapInstanceRef.current.setCenter(position);
            mapInstanceRef.current.setZoom(16);
        }
    }, [selectedRestaurant, restaurants, createMarkers]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            <style jsx global>{`
                .marker {
                    padding: 5px 10px;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 20px;
                    font-size: 12px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }
                .marker.selected {
                    background: #4a56e2;
                    color: white;
                    border-color: #4a56e2;
                    font-weight: bold;
                }
                .info-window {
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    max-width: 200px;
                }
                .info-window h3 {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .info-window p {
                    margin: 3px 0;
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};
