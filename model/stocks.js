import { signOut } from 'firebase/auth';
import {collection, getDoc, query, doc, getDocs} from 'firebase/firestore';
import { getSystemErrorMap } from 'util';
import {db} from '../Controller/firebase.js';

const StocksCol = collection(db, 'Stocks');
const CryptoCol = collection(db, 'Crypto')

async function getAllAssets(){
    const docRef = query(StocksCol);
    const docSnap = await getDocs(docRef);
    const stocks = [];
    docSnap.forEach((doc) => {
        stocks.push(doc.data());
    })
    const docRef2 = query(CryptoCol);
    const docSnap2 = await getDocs(docRef2);
    docSnap2.forEach((doc) => {
        stocks.push(doc.data());
    })
    return stocks;
}

async function getAsset(name){
    const docRef = doc(StocksCol , name);
    const docSnap = await getDoc(docRef);
    if(docSnap.data() != undefined){
        console.log("stock")
        console.log(docSnap.data())
        return docSnap.data();
    }else{
        const docRef = doc(CryptoCol , name);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data())
        return docSnap.data();   
    }
}

function getProfit(investment, stock){
    //  profit = ((amount of shares    * current price ) - (amount of shares   * price at purchase))
    let profit = ((investment.quantity * stock.Value.pop()) - (investment.quantity * investment.price));
    return (Math.floor(profit * 100) / 100);
}

function detectPriceMovement(stock_arr){
    let noty_stocks = [];
    stock_arr.forEach((stock)=>{
        if(stock.Value.slice(-1) > (stock.Value.slice(-2, -1)*1.01)){
            let percentage = Math.round(((stock.Value.slice(-1) - stock.Value.slice(-2, -1)*1.01) / stock.Value.slice(-1)) * 100 * 100)/100
            noty_stocks.push({'stock':stock, 'val':1, 'perc': percentage})
        }
        if((stock.Value.slice(-1)*1.01) < stock.Value.slice(-2, -1)){
            let percentage = Math.round(((stock.Value.slice(-2, -1)*1.01 - stock.Value.slice(-1)) / stock.Value.slice(-2, -1)*1.01) * 100 * 100)/100 * -1
            noty_stocks.push({'stock':stock, 'val':-1, 'perc': percentage})
        }
    })
    return noty_stocks
}
export {getAsset as getStock, getAllAssets as getAllStocks, getProfit, detectPriceMovement};