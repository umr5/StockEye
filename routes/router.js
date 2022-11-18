import express from 'express';
import path from 'path';
import * as stockController from '../model/stocks.js';
import { auth } from "../Controller/firebase.js";
import { buyStock, sellStock, getInvestment, getAllBrokers, getUsersBrokers, subscribeToBroker, checkSubscribtion, unsubscribeFromBroker} from '../model/User.js';
import { registerTrader, registerBroker, loginTrader, loginBroker, SignOut} from '../Controller/authentication.js';
import { getProfit } from '../model/stocks.js';


const app = express();
const router = express.Router();
const __dirname = process.cwd();
app.set('views', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'));

//router.use((req,res,next)=>{console.log("router>>>",req.method,req.url,req.body); return next();});

//getting login.html at '/' , later this will have to be replaced with the main page
router.get('/', (req, res)=>{ 
    let stocks = [];
    stockController.getAllStocks()
        .then((result)=>{
            stocks = result;
            res.render('./page/index.ejs', { root: __dirname, Stocks: stocks, currentuser: auth.currentUser});
        })
});

router.get('/signOut', (req, res)=>{
    SignOut();
    res.redirect('/')
})

//router to users account page
router.get('/account/:id', async (req, res)=>{
    let investments = [];
    let stock_arr = [];
    let brokers = [];
    await getUsersBrokers()
        .then((result)=>{
            brokers = result;
        })
    getInvestment()
        .then((result) => {
            investments = result.investments;
            stock_arr = result.users_stocks;
            res.render('./page/account', {currentuser: auth.currentUser, investments, stock_arr, profit_function: getProfit, brokers});
        })
})

router.get('/brokers', async (req, res)=>{
    let brokers = [];
    await getAllBrokers().then((result)=>{
        brokers = result;
    })
    console.log(await checkSubscribtion('NUCKtht5KjMB9pWChPPnPGFoe563'))
    console.log(await checkSubscribtion('t7UKuDd20ZaPEJLgFJhJYDbkQgV2'))
    res.render('./page/brokers', {brokers, checkSubscribtion, currentuser: auth.currentUser})
})

router.get('/subscribe/:id', (req, res)=>{
    subscribeToBroker(req.params.id);
    res.redirect('/');
})

router.get('/unsubscribe/:id', (req, res)=>{
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
    setTimeout(()=>{registerTrader(email, password, username)}, 2000);

    res.redirect('/');
});

//posting form to /login
router.post('/login/trader', (req, res, next)=>{
    var password = req.body.logPass;
    var email = req.body.logMail;
    loginTrader(email, password);
    setTimeout(()=>{res.redirect('/')},2000);
});

//posting form to /registration
router.post('/registration/broker', (req, res, next)=>{
    var username = req.body.regName;
    var password = req.body.regPass;
    var email = req.body.regMail;
    var institution = req.body.reginst;
    setTimeout(()=>{registerBroker(email, password, username, institution)}, 2000);

    res.redirect('/');
});

//posting form to /login
router.post('/login/broker', (req, res, next)=>{
    var password = req.body.logPass;
    var email = req.body.logMail;
    loginBroker(email, password);
    setTimeout(()=>{res.redirect('/')},2000);
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