import express from 'express';
import path from 'path';
import * as stockController from '../model/stocks.js';
import { auth } from "../Controller/firebase.js";
import { addTrader , buyStock, sellStock } from '../model/User.js';
import { registerUser, loginUser, signOut} from '../Controller/authentication.js';


const app = express();
const router = express.Router();
const __dirname = process.cwd();
app.set('views', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'));

router.use((req,res,next)=>{console.log("router>>>",req.method,req.url,req.body); return next();});

//getting login.html at '/' , later this will have to be replaced with the main page
router.get('/', (req, res)=>{ 
    let stocks = [];
    stockController.getAllStocks()
        .then((result)=>{
            stocks = result;
            res.render('./page/index.ejs', { root: __dirname, Stocks: stocks});
        })
});

router.get('/signOut', (req, res)=>{
    signOut();
})

router.get('/')

router.get("/login", (req, res)=>{
    res.render('./page/login');
})

//posting form to /registration
router.post('/registration', (req, res, next)=>{
    console.log("registering")
    var username = req.body.regName;
    var password = req.body.regPass;
    var email = req.body.regMail;
    registerUser(email, password, username);

    res.redirect('/');
});

//posting form to /login
router.post('/login', (req, res, next)=>{
    console.log("logging in");
    var password = req.body.logPass;
    var email = req.body.logMail;
    loginUser(email, password);
    res.redirect('/');
});

router.post('/buy/:id', (req, res, next)=>{
    console.log("User " + auth.currentUser.displayName + " buying " + req.params.id + " with " + req.body.amount);
    buyStock(req.params.id, req.body.amount);
    res.redirect('/');
});

router.post('/sell/:id', (req, res,)=>{
    console.log("User " + auth.currentUser.displayName + " selling " + req.params.id);
    sellStock(req.params.id);
    res.redirect('/');
})
export {router}