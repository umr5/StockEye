import {collection, getDocs, addDoc, query, where, doc, updateDoc, arrayUnion, DocumentReference, setDoc, deleteDoc, getDoc, FieldValue} from 'firebase/firestore';
import {db} from '../Controller/firebase.js';
import { getStock, getProfit } from "./stocks.js";
import { auth} from '../Controller/firebase.js';


const TradersCol = collection(db, 'User_Traders');
const BrokersCol = collection(db, 'User_Brokers');

let currentuser_cache;

//function handling the registration of new traders
async function addTrader(user){
    await setDoc(doc(TradersCol, user.uid), {
        UID: user.uid,
        account: "User",
        username: user.displayName,
        email: user.email,
        Brokers: [],
        wallet: 0
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
        Traders: []
    });
};

// function for handling stock purchase
async function buyStock(stock_name, buy_amount){
    getStock(stock_name).then(async (res)=>{
        //gets the userdoc of the current user
        let docRef = doc(TradersCol, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        let userwallet = docSnap.data().wallet
        //checks if user has enough money
        if(buy_amount > docSnap.data().wallet){
            return false
        }else{
            //creates a new document in a users investment subcollection
            let shares = buy_amount / res.Value.pop();
            addDoc(collection(TradersCol, auth.currentUser.uid, 'investment'), {
                stock: res.Name,
                quantity: shares,
                price: res.Value.pop(),
                timestamp: new Date()
            });
            await updateDoc(docRef, {wallet: userwallet - buy_amount})
            //logs the result
            console.log(auth.currentUser.displayName + " bought " + shares + " shares of: " + stock_name + ", with: " + buy_amount + ", at price of: " + res.Array[0]);
            //updates the server-side user cache
            await set_currenuser_cache('User');
            return true
        }
    });
}

//function for handling stock sale
async function sellStock(stock_name){
    if(auth.currentUser){
        //gets the userdoc of the current user and extracts wallet data
        let docRef = doc(TradersCol, auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        let userwallet = docSnap.data().wallet
        //gets all investments based on stock_name
        getStock(stock_name).then(async (res)=>{
            const querySnapshot = await getDocs(query(collection(TradersCol, auth.currentUser.uid, 'investment'), where("stock", "==", stock_name)));
            querySnapshot.forEach(async (doc) => {
                //calculates the profit using the profit function
                let profit = getProfit(doc.data(), res);
                //logs profit
                console.log("profit: " + profit);
                //updates user wallet with new funds
                await updateDoc(docRef, {wallet: userwallet + profit})
                //archives the investment document 
                await archiveIvestment(doc.ref, profit);
                deleteDoc(doc.ref)
            });
        });
    }
    await set_currenuser_cache('User');
}

async function archiveIvestment(stock_docRef, profit){
    const docSnap = await getDoc(stock_docRef);
    let stockData = docSnap.data()
    addDoc(collection(TradersCol, auth.currentUser.uid, 'archive'), {
        stock: stockData.stock,
        quantity: stockData.quantity,
        price: stockData.price,
        purchase_time: stockData.timestamp,
        sell_time: new Date(),
        profit: profit
    });
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

async function getAllBrokers(){
    const brokers_arr = [];
    
    const querySnapshot = await getDocs(query(BrokersCol, where("account", "==", "Broker")));
    querySnapshot.forEach((doc)=>{brokers_arr.push(doc.data())});
    
    return brokers_arr;
}

async function getUsersBrokers(){
    const docRef = doc(TradersCol, auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let broker_docs = [];
    if(docSnap.data().Brokers != null){
        for await (const ref of docSnap.data().Brokers){
            const docRef = doc(BrokersCol, ref);
            const docSnap = await getDoc(docRef);
            broker_docs.push(docSnap.data());
        }
    }   
    return broker_docs;
}
async function getBrokersUsers(){
    const docRef = doc(BrokersCol, auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let trader_docs = [];
    if(docSnap.data().Traders != null){
        for await (const ref of docSnap.data().Traders){
            const docRef = doc(TradersCol, ref);
            const docSnap = await getDoc(docRef);
            trader_docs.push(docSnap.data());
        }
    }   
    return trader_docs;
}
async function subscribeToBroker(broker_uid){
    const docRef = doc(TradersCol, auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let broker_list = []
    if(docSnap.data().Brokers){
        broker_list = docSnap.data().Brokers;
    }
    broker_list.push(broker_uid);
    updateDoc(docRef, {Brokers: broker_list});
    
    const docRef2 = doc(BrokersCol, broker_uid);
    const docSnap2 = await getDoc(docRef2);
    let traders_list = []
    if(docSnap2.data().Brokers){
        traders_list = docSnap2.data().Brokers;
    }
    traders_list.push(auth.currentUser.uid);
    updateDoc(docRef2, {Traders: traders_list});
    await set_currenuser_cache('User');
}

async function unsubscribeFromBroker(broker_uid){
    const docRef = doc(TradersCol, auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let broker_list = []
    if(docSnap.data().Brokers){
        broker_list = docSnap.data().Brokers;
    }
    const index = broker_list.indexOf(broker_uid);
    if (index > -1) { 
        broker_list.splice(index, 1); 
    }
    
    updateDoc(docRef, {Brokers: broker_list});
    
    const docRef2 = doc(BrokersCol, broker_uid);
    const docSnap2 = await getDoc(docRef2);
    let traders_list = []
    if(docSnap2.data().Brokers){
        traders_list = docSnap2.data().Brokers;
    }
    const index2 = traders_list.indexOf(auth.currentUser.uid);
    if (index2 > -1) { 
        traders_list.splice(index, 1); 
    }
    
    updateDoc(docRef2, {Traders: traders_list});
    await set_currenuser_cache('User');
}

function checkSubscribtion(broker_uid){
    let check;
    let arr = currentuser_cache.Brokers;
    check = arr.includes(broker_uid);  
    return check;
}

async function set_currenuser_cache(type){
    let docRef;
    if(type == 'User'){
        console.log("creating a User cache");
        docRef = doc(TradersCol, auth.currentUser.uid);
    }else if(type == 'Broker'){
        console.log("creating a Broker cache");
        docRef = doc(BrokersCol, auth.currentUser.uid);
    }
    await getDoc(docRef).then((res)=>{
        currentuser_cache = res.data();
        console.log(currentuser_cache)
    });
}

function get_accountType(){
    return currentuser_cache.account
}

function empty_currentuser_cache(){
currentuser_cache = null;
}

export {addTrader, addBroker, buyStock, sellStock, getInvestment, getAllBrokers, getUsersBrokers, getBrokersUsers,
        subscribeToBroker, unsubscribeFromBroker, checkSubscribtion, set_currenuser_cache, empty_currentuser_cache,
        get_accountType};