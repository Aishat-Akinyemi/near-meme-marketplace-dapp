import { Meme, memesStorage } from './model';
import { context, ContractPromiseBatch, PersistentSet } from "near-sdk-as";

/**
 * 
 * This function changes the state of data in the blockchain. 
 * It is used to issue buy transactions when a meme is purchased from a given seller (if the meme is available)
 * 
 * @param memeId - an identifier of a meme that is the subject of purchase
 */
export function buyMeme(memeId: string): void {
    const meme = getMeme(memeId);
    if (meme == null) {
        throw new Error("meme not found");
    }
    if (meme.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should be greater than the meme's price");
    }
    /*
        `ContractPromiseBatch` is used here to create a transaction to transfer the money to the seller
        The amount of money to be used in the transaction is taken from `context.attachedDeposit` 
        which is defined by `--depositYocto=${AMOUNT}` parameter during the invocation 
    */
    ContractPromiseBatch.create(meme.owner).transfer(context.attachedDeposit);
    meme.incrementSoldAmount();
    memesStorage.set(meme.id, meme);
}

/**
 * 
 * @param meme - a meme to be added to the blockchain
 */
export function setMeme(meme: Meme): void {
    let storedMeme = memesStorage.get(meme.id);
    if (storedMeme !== null) {
        throw new Error(`a meme with id=${meme.id} already exists`);
    }
    const memeLength = memesStorage.length;
    meme.up_votes = new PersistentSet<string>(`upvote${memeLength}`);
    meme.down_votes = new PersistentSet<string>(`downvote${memeLength}`);    
    memesStorage.set(meme.id, Meme.fromPayload(meme));
}

/**
 * 
 * A function that returns a single meme for given owner and meme id
 * 
 * @param id - an identifier of a meme to be returned
 * @returns a meme for a given @param id
 */
export function getMeme(id: string): Meme | null {
    return memesStorage.get(id);
}

/**
 * 
 * A function that returns an array of memes for all accounts
 * 
 * @returns an array of objects that represent a meme
 */
export function getMemes(): Array<Meme> {
    return memesStorage.values();
    
}

/**
 * returns the no of votes, downvotes in index[0], upvotes in index[1] on a meme
 */
export function getMemeVotes(memeId: string) : Array<u32> | null {    
    const meme = memesStorage.get(memeId);
    //check if meme is null, in case meme is null we can't access its properties
    if(meme == null){
       return null;
    } else {
        let votes_length_array = new Array<u32>(2);
        votes_length_array[0] = meme.down_votes.size;
        votes_length_array[1] = meme.up_votes.size;
        return votes_length_array;
    } 
}
