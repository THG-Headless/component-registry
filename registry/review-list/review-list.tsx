import React from "react"

interface ReviewListProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export const ReviewList: React.FC<ReviewListProps> = ({title = "Top Customer Reviews", subtitle = "", children}) => {
    return (
        <div className="flex flex-col w-full gap-6">
            <h3 className="text-2lg font-medium">{title}</h3>
            <p className="text-body">{subtitle}</p>
            {children}
        </div>
    )
}

export default ReviewList