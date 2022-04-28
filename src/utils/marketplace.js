import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import {fetchProdMeta} from "./ipfs"

const GAS = 100000000000000;



export function createProduct(product) {
  product.id = uuid4();
  product.price = parseNearAmount(product.price + "");
  return window.contract.setProduct({ product });
}

export async function getProducts() {
  try{
    const products = await window.contract.getProducts();
    console.log(products);
    const productList = [];    
    products.forEach(prod => {
      const prodItem = new Promise( async (resolve) => {
        const meta = await fetchProdMeta(prod.metadata);
        resolve({
          id: prodItem.id,
          price: prodItem.price,
          owner: prodItem.owner,
          sold: prodItem.sold,
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
          location: meta.data.location
        });  
    });
    productList.push(prodItem);
  });
  console.log(productList);
    return Promise.all(productList);
  } catch(e){
    console.log({e});
  }   
}

export async function buyProduct({ id, price }) {
  await window.contract.buyProduct({ productId: id }, GAS, price);
}
