import { Review, VoteType } from "../../registry/review/review"

export const ReviewWrapper = () => {
    const onButtonVote = (voteType: VoteType) => {
        console.log(voteType);
    }
    return (
        <Review onVote={onButtonVote} headline="Review Title" rating={4} maxRating={5} comments="Review comments" date="2025-03-31" author="John" upVoteCount={0} downVoteCount={2}/>
    )
}

export default ReviewWrapper