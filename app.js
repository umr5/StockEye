//imports
import path from 'path';
import express from 'express';
import {router} from './routes/router.js'

//constants
const __dirname = process.cwd();
const port = 8000;
const app = express();

//setting up the server
app.listen(port, () => console.log('live on http://localhost:' + port));
app.use(express.urlencoded({ extended: false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'));


//calling router 
app.use('/', router);
  