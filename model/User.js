import {collection, getDocs, addDoc, query, where, doc, updateDoc, arrayUnion, DocumentReference, setDoc, deleteDoc} from 'firebase/firestore';
import {db} from '../Controller/firebase.js';
import { getStock } from "./stocks.js";
import { auth , onAuthStateChanged} from '../Controller/firebase.js';


const TradersCol = collection(db, 'User_Traders');
const BrokersCol = collection(db, 'User_Brokers');

//function handling the registration of new users
async function addTrader(user){
    await setDoc(doc(TradersCol, user.uid), {
        UID: user.uid,
        username: user.displayName,
        email: user.email,
    });
};

async function buyStock(stock_name, buy_amount){
    getStock(stock_name).then((res)=>{
        let docRef = doc(TradersCol, auth.currentUser.uid);

        //res.Array[0] represents the current price for now, this is a placeholder until we get the actual stock prices into the the database
        let shares = buy_amount / res.Array[0];

        addDoc(collection(TradersCol, docRef.id, 'investment'), {
            stock: res.Name,
            quantity: shares,
            price: res.Array[0],
            timestamp: new Date()
        });
        console.log(auth.currentUser.displayName + " bought " + shares + " shares of: " + stock_name + ", with: " + buy_amount + ", at price of: " + res.Array[0]);
    })
}

async function sellStock(stock_name){
    getStock(stock_name).then(async (res)=>{
        const q = query(collection(TradersCol, auth.currentUser.uid, 'investment'), where("stock", "==", stock_name));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);

            let profit = ((doc.data().quantity * doc.data().price) - (doc.data().quantity * res.Array[0]));
    
            console.log("profit: " + profit);
        });
    });
}


export {addTrader, buyStock, sellStock};