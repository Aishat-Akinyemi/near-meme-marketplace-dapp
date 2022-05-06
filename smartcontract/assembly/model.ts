import { PersistentUnorderedMap, context, PersistentSet, u128 } from "near-sdk-as";

@nearBindgen
export class Meme {
    id: string;
    metadata: string;
    price: u128;
    owner: string;
    up_votes:  PersistentSet<string>;
    down_votes: PersistentSet<string>;
    sold: u32;
    public static fromPayload(payload: Meme): Meme {
        const meme = new Meme();
        meme.id = payload.id;
        meme.metadata = payload.metadata;               
        meme.price = payload.price;
        meme.owner = context.sender;
        meme.up_votes = payload.up_votes;
        meme.down_votes = payload.down_votes;
        return meme;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
    // 0 if upvote, 1 is downvote
    public vote(voteType: i8): bool {
        const senderAccount = context.sender;
        assert(!(this.down_votes.has(senderAccount)), "already voted");
        assert(!(this.up_votes.has(senderAccount)), "already voted");
        assert((voteType ==0 || voteType ==1), "not a valid vote");
        switch (voteType) {
            case 0:
                this.down_votes.add(senderAccount);
                return true;
                
            case 1:
                this.up_votes.add(senderAccount);
                return true;
        }
        return false;
    }
}


export const memesStorage = new PersistentUnorderedMap<string, Meme>("LISTED_MEMES");

