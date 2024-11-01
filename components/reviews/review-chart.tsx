import { useMemo } from "react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { ReviewsWithUser } from "@/lib/infer-type";
import { Progress } from "../ui/progress";
import { getReviewAverage } from "@/lib/review-average";


export default function ReviewChart({
    reviews
}: {
    reviews: ReviewsWithUser[]
}) {
    const getRatingByStars = useMemo(() => {
        const ratingValues = Array.from({ length: 5 }, () => 0);
        const totalReviews = reviews.length;

        reviews.forEach((review) => {
            const startIndex = review.rating - 1;
            if (startIndex > 0 && startIndex < 5) {
                ratingValues[startIndex]++
            }
        })

        return ratingValues.map((rating) => (rating / totalReviews) * 100)

    }, [reviews])
    const totalRating = getReviewAverage(reviews.map((review) => review.rating))
    return (
        <Card className="flex flex-col p-8 rounded-md gap-4">
            <div className="flex flex-col gap-2">
                <CardTitle>Product Rating</CardTitle>
                <CardDescription className="text-lg font-medium">
                    {totalRating.toFixed(1)} stars
                </CardDescription>
            </div>
            {
                getRatingByStars.map((rating, index) => (
                    <div key={index} className="flex gap-2 justify-between items-center">
                        <p>{index + 1} <span>stars</span></p>
                        <Progress value={rating} />
                    </div>
                ))
            }
        </Card>
    )
}