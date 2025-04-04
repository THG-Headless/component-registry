import React from "react";
import Ratings from "@registry/ratings/ratings";
import { Button } from "@registry/button/button";

export enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  REPORT = "REPORT",
}

interface ReviewProps {
  headline: string;
  rating: number;
  comments: string;
  maxRating?: number;
  date?: string;
  author?: string;
  onVote?: (voteType: VoteType) => void;
  upVoteCount?: number;
  downVoteCount?: number;
}

export const Review: React.FC<ReviewProps> = ({
  headline,
  rating,
  maxRating = 5,
  comments,
  date,
  author,
  onVote,
  upVoteCount,
  downVoteCount,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h4 className="text-md font-medium">{headline}</h4>
      {rating && maxRating && (
        <Ratings
          rating={rating}
          maxRating={maxRating}
          className="skin-primary"
        />
      )}
      <p className="text-body">{comments}</p>
      {(date || author) && (
        <div className="flex items-center text-body font-bold gap-1">
          <span>{date}</span>
          <span>by {author}</span>
        </div>
      )}
      {onVote && (
        <div className="flex flex-col gap-2">
          <p>Was this review helpful?</p>
          <div className="flex gap-2">
            <Button
              className="skin-secondary"
              onClick={() => onVote(VoteType.UPVOTE)}
            >
              Yes {typeof upVoteCount === "number" ? `(${upVoteCount})` : ``}
            </Button>
            <Button
              className="skin-secondary"
              onClick={() => onVote(VoteType.DOWNVOTE)}
            >
              No {typeof downVoteCount === "number" ? `(${downVoteCount})` : ``}
            </Button>
            <Button
              className="skin-secondary"
              onClick={() => onVote(VoteType.REPORT)}
            >
              Report this review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
