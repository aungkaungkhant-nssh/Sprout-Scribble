"use client"
import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from 'framer-motion'
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns"
import Starts from "./stars";
export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
    return (
        <motion.div className="flex flex-col gap-4 my-2">
            {
                reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                        <div  >
                            <Image
                                className="rounded-full"
                                src={review.user.image!}
                                width={32}
                                height={32}
                                alt={review.user.name!}

                            />
                            <div>
                                <p>{review.user.name}</p>
                                <div>
                                    <Starts rating={review.rating} />
                                    <p className="text-xs text-bold text-muted-foreground">
                                        {formatDistance(subDays(review.created!, 0), new Date())}
                                    </p>
                                </div>
                            </div>
                        </div >
                        <p className="py-2 font-medium">{review.comment}</p>
                    </Card >
                ))
            }
        </motion.div >
    )
}