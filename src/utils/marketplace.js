import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import {fetchMemeMeta} from "./ipfs"

const GAS = 100000000000000;



export async function createMeme(meme) {
  meme.id = uuid4();
  meme.price = parseNearAmount(meme.price + "");
  return await window.contract.setMeme({ meme });
}

export async function getMemes() {
  try{
    const memes = await window.contract.getMemes();
    const memeList = [];    
    memes.forEach(meme => {
      const memeItem = new Promise( async (resolve) => {
        const meta = await fetchMemeMeta(meme.metadata);      
        //call contract method to get votes count  
        const vote= await window.contract.getMemeVotes({ memeId: meme.id});
        resolve({
          id: meme.id,
          price: meme.price,
          owner: meme.owner,
          sold: meme.sold,          
          downvotes_count: vote[0],
          upvotes_count: vote[1],
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
          location: meta.data.location
        });  
    });
    memeList.push(memeItem);
  });
    return Promise.all(memeList);
  } catch(e){
    console.log({e});
  }   
}

export async function buyMeme({ id, price }) {
  await window.contract.buyMeme({ memeId: id }, GAS, price);
}

export async function voteMeme({id, voteType}){
   const isSuccess = await window.contract.voteMeme({memeId: id, voteType: voteType}, GAS);
   if (isSuccess){
      return Promise.resolve(isSuccess);
   } else{
     return Promise.reject();
   }
}
