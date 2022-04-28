import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { createProduct } from "./marketplace";

export const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export async function createProductRecordOnIPFS(product) {
    const data =  JSON.stringify({
      name: product.name,
      image: product.image,
      description: product.description,
      location: product.location
    });
    try {
      // save product metadata to IPFS
      const added = await client.add(data);
      // IPFS url for uploaded metadata
      const url = `https://ipfs.io/ipfs/${added.path}`;
  
      let productData = {
        price: product.price,
        metadata: url
      };
      //now add the product, including the IPFS url to the blockchain
      let saveProduct = createProduct(productData);   
  
    } catch(error){
      console.log("Error saving products: ", error);
    }
}



// get the metedata for a product from IPFS
export const fetchProdMeta = async (ipfsUrl) => {
    try {
        if (!ipfsUrl) return null;
        const meta = await axios.get(ipfsUrl);
        return meta;
    } catch (e) {
        console.log({e});
    }
};
