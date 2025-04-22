import {Restaurant} from "@/types/restaurant";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/common/ui/card";
import {Separator} from "@/components/common/ui/separator";
import {Button} from "@/components/common/ui/button";

interface RestaurantCardProps {
    restaurant: Restaurant;
    onReset: () => void;
}

export const RestaurantCard = ({restaurant, onReset}: RestaurantCardProps) => {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>추천 메뉴</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-xl">{restaurant.name}</h3>
                        <p className="text-muted-foreground">{restaurant.category}</p>
                    </div>
                    <Separator />
                    <div>
                        <p className="text-sm">주소: {restaurant.address}</p>
                        <p className="text-sm">가격대: {"₩".repeat(restaurant.priceRange)}</p>
                    </div>
                    {restaurant.menu && restaurant.menu.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">대표 메뉴</h4>
                                <ul className="space-y-2">
                                    {restaurant.menu.slice(0, 3).map((item) => (
                                        <li key={item.id} className="flex justify-between">
                                            <span>{item.name}</span>
                                            <span>{item.price.toLocaleString()}원</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={onReset}>
                    다시 고르기
                </Button>
            </CardFooter>
        </Card>
    );
};
