import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { createMeme } from "./marketplace";

export const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export async function createMemeRecordOnIPFS(meme) {
    const data =  JSON.stringify({
      name: meme.name,
      image: meme.image,
      description: meme.description,
      location: meme.location
    });
    try {
      // save meme metadata to IPFS
      const added = await client.add(data);
      // IPFS url for uploaded metadata
      const url = `https://ipfs.io/ipfs/${added.path}`;
  
      let memeData = {
        price: meme.price,
        metadata: url
      };
      //now add the meme, including the IPFS url to the blockchain
      let saveMeme = createMeme(memeData);   
  
    } catch(error){
    }
}



// get the metedata for a meme from IPFS
export const fetchMemeMeta = async (ipfsUrl) => {
    try {
        if (!ipfsUrl) return null;
        const meta = await axios.get(ipfsUrl);
        return meta;
    } catch (e) {
        console.log({e});
    }
};
