import React from "react";
import Ratings from "../ratings/ratings";
import ProgressBar from "../progress-bar/progress-bar";

interface RatingScore {
    [key: number]: number;
}

interface ReviewOverviewProps {
    averageRating?: number;
    reviewCount?: number;
    maxRating?: number;
    minRating?: number;
    ratings?: RatingScore;
}

export const ReviewOverview: React.FC<ReviewOverviewProps> = ({ averageRating = 2.5, reviewCount = 1, maxRating = 5, minRating = 1, ratings = {}}) => {
    const getTotalRatings = () => {
        return Object.values(ratings).reduce((total, count) => total + count, 0);
    };

    const totalRatings = getTotalRatings();

    const ratingValues = Array.from(
        { length: maxRating - minRating + 1 }, 
        (_, i) => maxRating - i
    );

    return (
        <div className="flex flex-col w-full gap-6">
            <h3 className="text-2lg font-medium">Customer Reviews</h3>
            <div className="flex gap-3">
                <Ratings rating={averageRating} maxRating={5} className="skin-primary" />
                <span className="text-body font-medium">({averageRating})</span>
            </div>
            <span className="text-body font-medium">{totalRatings} Reviews</span>
            <div className="grid grid-cols-8 gap-2">
                {Object.keys(ratings).length > 0 && (
                    <>
                        {ratingValues.map((ratingValue) => {
                            const ratingCount = ratings[ratingValue] || 0;
                            return (
                                <>
                                    <div className="col-span-7 flex gap-3 items-center">
                                        <span>{ratingValue}</span>
                                        <Ratings rating={1} maxRating={1} iconCount={1} className="skin-primary shrink-0" />
                                        <ProgressBar
                                            key={`bar-${ratingValue}`}
                                            className="skin-primary w-full"
                                            value={ratingCount}
                                            maxValue={totalRatings}
                                            label={`Rating ${ratingValue}`}
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-baseline">
                                        <span key={`count-${ratingValue}`} className="text-sm">
                                            {ratings[ratingValue] || 0}
                                        </span>
                                    </div>
                                </>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}

export default ReviewOverview