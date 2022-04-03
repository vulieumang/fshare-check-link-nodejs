import http  from 'http';
import path from 'path';
import axios from 'axios'; //15k (gzipped: 5.1k)
import cheerio  from 'cheerio';
import express  from 'express';
import bodyParser from 'body-parser'
const __dirname = path.resolve();
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// const port = 3001;
const port = process.env.PORT || 3001;
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// routes will go here
app.get('/', (req, res) => {
  res.render('index', {})
});
    
app.post('/', async (req, res) => {
  const link = req.body.link
  // getInfoFromHTML(link,res)
  getInfoFromAPI(link, res)
});

async function getInfoFromHTML(link,res){
  try {
    var data = await getData(link)
    const $ = cheerio.load(data);
    var size = $('#form-download #download-free').text().split('|')[1].trim()
    var name = $('.name.text_auto_down').text().trim()
    console.log(name)
    console.log(size)
    var item = {name:name, size:size, link:link}
    res.render('index', {item:item})

  } catch (error) {
    console.log(error);
  }
}

async function getInfoFromAPI(link, res){
  const code_url = link.split('/')[4].split('?')[0]
  var API_URL = API_URL_Fshare({code:code_url})
  try {
    var item = await getData(API_URL)
    var size = formatBytes(item.current.size)
    var name = item.current.name
    var item_obj= {name:name, size:size, link:link}
    res.render('index', {item:item_obj})

  } catch (error) {
    console.log(error);
  }
}

// sv start
app.listen(port);
console.log('port')
console.log('Server started at http://localhost:' + port);

async function getData(url){
  const res = await axios(url)
  const data = await res.data;
  return data
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function API_URL_Fshare({code, page}) {
  if(!page){
    page=1
  }
  return `https://www.fshare.vn/api/v3/files/folder?linkcode=${code}&sort=type%2Cname&page=${page}&per-page=500`
}