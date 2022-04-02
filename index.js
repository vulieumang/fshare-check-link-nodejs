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

const port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// routes will go here
app.get('/', (req, res) => {
  res.render('index', {})
});
    
app.post('/', async (req, res) => {
  const link = req.body.link
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
});

// sv start
app.listen(port);
console.log('Server started at http://localhost:' + port);

async function getData(url){
  const res = await axios(url)
  const data = await res.data;
  return data
}