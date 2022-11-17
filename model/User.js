import {collection, getDocs, addDoc, query, where, doc, updateDoc, arrayUnion, DocumentReference, setDoc, deleteDoc} from 'firebase/firestore';
import {db} from '../Controller/firebase.js';
import { getStock, getProfit } from "./stocks.js";
import { auth} from '../Controller/firebase.js';


const TradersCol = collection(db, 'User_Traders');
const BrokersCol = collection(db, 'User_Brokers');

//function handling the registration of new traders
async function addTrader(user){
    await setDoc(doc(TradersCol, user.uid), {
        UID: user.uid,
        acount: "Direct User",
        username: user.displayName,
        email: user.email,
    });
};

//function handling the registration of new brokers
async function addBroker(user){
    await setDoc(doc(BrokersCol, user.uid), {
        UID: user.uid,
        account: "Broker",
        username: user.displayName,
        email: user.email,
        institution: "IBA", //this is temporary
        Traders: {}
    });
};

async function buyStock(stock_name, buy_amount){
    getStock(stock_name).then((res)=>{
        let docRef = doc(TradersCol, auth.currentUser.uid);

        //res.Array[0] represents the current price for now, this is a placeholder until we get the actual stock prices into the the database
        let shares = buy_amount / res.Array[0];

        addDoc(collection(TradersCol, auth.currentUser.uid, 'investment'), {
            stock: res.Name,
            quantity: shares,
            price: res.Value.pop(),
            timestamp: new Date()
        });
        console.log(auth.currentUser.displayName + " bought " + shares + " shares of: " + stock_name + ", with: " + buy_amount + ", at price of: " + res.Array[0]);
    })
}

async function sellStock(stock_name){
    if(auth.currentUser){
        getStock(stock_name).then(async (res)=>{
            const querySnapshot = await getDocs(query(collection(TradersCol, auth.currentUser.uid, 'investment'), where("stock", "==", stock_name)));
            querySnapshot.forEach((doc) => {
                let profit = getProfit(doc.data(), res);
                console.log("profit: " + profit);
                deleteDoc(doc.ref);
            });
        });
    }
}

async function getInvestment(){
    const investments = [];
    const users_stocks = [];
    
    const querySnapshot = await getDocs(query(collection(TradersCol, auth.currentUser.uid, 'investment'), where("stock", "!=", null)));
    querySnapshot.forEach((doc)=>{investments.push(doc.data())});
    for(const inv of investments){
        await getStock(inv.stock).then((res)=>{
            users_stocks.push(res);
        });
    }
    return {investments, users_stocks};
}

async function getBrokers(){
    const brokers_arr = [];
    
    const querySnapshot = await getDocs(query(collection(BrokersCol), where("account", "=", "Broker")));
    querySnapshot.forEach((doc)=>{brokers_arr.push(doc.data())});
    
    return brokers_arr;
}

export {addTrader, addBroker, buyStock, sellStock, getInvestment, getBrokers};