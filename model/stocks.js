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

export {getStock, getAllStocks};