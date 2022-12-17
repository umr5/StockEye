import express from 'express';
import path from 'path';
import * as stockController from '../model/stocks.js';
import { auth } from "../Controller/firebase.js";
import { buyStock, sellStock, getInvestment, getAllBrokers, getUsersBrokers, subscribeToBroker, checkSubscribtion, unsubscribeFromBroker, get_accountType, getBrokersUsers} from '../model/User.js';
import { registerTrader, registerBroker, loginTrader, loginBroker, SignOut} from '../Controller/authentication.js';
import { getProfit, detectPriceMovement } from '../model/stocks.js';


const app = express();
const router = express.Router();
const __dirname = process.cwd();
app.set('views', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'));

router.use((req,res,next)=>{console.log("router>>>",req.method,req.url,req.body); return next();});

//getting login.html at '/' , later this will have to be replaced with the main page
router.get('/', async (req, res)=>{ 
let userType = "";
    if(auth.currentUser){
        userType = get_accountType()
    }
    let stocks = [];
    stockController.getAllStocks()
        .then((result)=>{
            stocks = result;
            let changed = detectPriceMovement(stocks)
            console.log(changed)
            res.render('./page/index.ejs', { root: __dirname, Stocks: stocks, currentuser: auth.currentUser, userType});
        })
});

router.get('/signOut', (req, res)=>{
    SignOut();
    res.redirect('/')
})

//router to users account page
router.get('/account/:id', async (req, res)=>{
    let userType = get_accountType()
    let users = [];
    let investments = [];
    let stock_arr = [];
    if(userType == "User"){
        await getUsersBrokers()
            .then((result)=>{
                users = result;
            })
        await getInvestment()
            .then((result) => {
                investments = result.investments;
                stock_arr = result.users_stocks;
            })    
    }else if (userType == 'Broker'){
        await getBrokersUsers()
            .then((result)=>{
                users = result;
            })
    }
    res.render('./page/account', {currentuser: auth.currentUser, investments, stock_arr, profit_function: getProfit, users, userType});
})

router.get('/brokers', async (req, res)=>{
    let userType = get_accountType()
    let brokers = [];
    await getAllBrokers().then((result)=>{
        brokers = result;
    })
    res.render('./page/brokers', {brokers, checkSubscribtion, currentuser: auth.currentUser, userType})
})

router.get('/subscribe/:id', (req, res)=>{
    subscribeToBroker(req.params.id);
    res.redirect('/');
})

router.get('/unsubscribe/:id', (req, res)=>{
    unsubscribeFromBroker(req.params.id);
    res.redirect('/');
})

router.get('/report', (req, res)=>{
    unsubscribeFromBroker(req.params.id);
    res.redirect('/');
})

//trader and broker logins
router.get("/login", (req, res)=>{
    res.render('./page/login',);
})
router.get("/temp_broker_login", (req, res)=>{
    res.render('./page/temp_broker_login')
})

//posting form to /registration
router.post('/registration/trader', (req, res, next)=>{
    var username = req.body.regName;
    var password = req.body.regPass;
    var email = req.body.regMail;
    registerTrader(email, password, username)
    setTimeout(async ()=>{res.redirect('/');}, 4000);
});

//posting form to /login
router.post('/login/trader', (req, res, next)=>{
    var password = req.body.logPass;
    var email = req.body.logMail;
    loginTrader(email, password);
    setTimeout(()=>{res.redirect('/')},4000);
});

//posting form to /registration
router.post('/registration/broker', (req, res, next)=>{
    var username = req.body.regName;
    var password = req.body.regPass;
    var email = req.body.regMail;
    var institution = req.body.reginst;
    registerBroker(email, password, username, institution)
    setTimeout(()=>{res.redirect('/');}, 4000);
});

//posting form to /login
router.post('/login/broker', (req, res, next)=>{
    var password = req.body.logPass;
    var email = req.body.logMail;
    loginBroker(email, password);
    setTimeout(()=>{res.redirect('/')},4000);
});

router.post('/buy/:id', (req, res, next)=>{
    if(auth.currentUser){
        console.log("User " + auth.currentUser.displayName + " buying " + req.params.id + " with " + req.body.amount);
        buyStock(req.params.id, req.body.amount);
        res.redirect('/');
    }
});

router.post('/sell/:id', (req, res,)=>{
    if(auth.currentUser){
        console.log("User " + auth.currentUser.displayName + " selling " + req.params.id);
        sellStock(req.params.id);
        res.redirect('/');
    }
})

export {router}