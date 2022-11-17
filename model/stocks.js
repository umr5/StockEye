import {collection, getDoc, query, doc, getDocs} from 'firebase/firestore';
import {db} from '../Controller/firebase.js';

const StocksCol = collection(db, 'Stocks');

async function getAllStocks(){
    const docRef = query(StocksCol);
    const docSnap = await getDocs(docRef);
    const stocks = [];
    docSnap.forEach((doc) => {
        stocks.push(doc.data());
    })
    return stocks;
}

async function getStock(name){
    const docRef = doc(StocksCol , name);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

function getProfit(investment, stock){
    //  profit = ((amount of shares    * current price ) - (amount of shares   * price at purchase))
    let profit = ((investment.quantity * stock.Value.pop()) - (investment.quantity * investment.price));
    return profit;
}

export {getStock, getAllStocks, getProfit};