"use client";

import {Category} from "@/types/restaurant";
import {Button} from "@/components/common/ui/button";
import {Separator} from "@/components/common/ui/separator";
import {CATEGORIES} from "@/constants/categories";

interface RestaurantPickerProps {
    selectedCategory: Category | "all";
    onCategoryChange: (category: Category | "all") => void;
    onPickRandom: () => void;
}

export const RestaurantPicker = ({selectedCategory, onCategoryChange, onPickRandom}: RestaurantPickerProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-3 text-sm font-medium">카테고리 선택</h3>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCategoryChange(category.value)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={onPickRandom}>
                    랜덤 선택하기
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    선택한 카테고리에서 랜덤으로 식당을 추천해 드립니다.
                </p>
            </div>
        </div>
    );
};
