
//Load express module with `require` directive
const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");
// const mongoose = require("mongoose");
const cors = require('cors');

const Screenshot = require('url-to-screenshot')
const shortid = require('shortid');

const fs = require('./helpers/fs-async')
const formats = ['jpg', 'jpeg', 'png', 'gif'];

// routers
// const imagesRouter = require("./routers/images")
//var bodyParser = require('body-parser');


const app = express();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(helmet()); // better status code
app.use(morgan('tiny')); // logs reqs meta data in console

app.use(express.static('images'));

// create application/json parser
//app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
//app.use(bodyParser.urlencoded({extended: false}));

//Define request response in root URL (/)
app.get('/', async (req, res) => {
  console.log('Validating parameters');
  let url = req.query["url"] || null
  if(!url || url.indexOf('.') === -1) {
    return res.status(400).send({message: 'Invalid URL'});
  } else if(url.indexOf('http') === -1) {
    url = 'http://' + url;
  }
  
  const format = formats.indexOf(req.query["url"]) === -1 ? 'png' : req.query["url"]

  const width = req.query["width"] || 1200

  console.log('Parameters Validated, width: '+width+', format: '+format+', url: '+url,'taking screenshot');
  const imgName = shortid.generate();
  try{
    const img = await new Screenshot(url)
      .width(width)
      .format(format)
      //.height(600)
      .capture();
    
    console.log('screenshot captured, saving photo');
    await fs.writeFile(`${__dirname}/images/` + imgName + '.' + format, img)
  } catch(ex){
    console.log('Exception:- ', ex);
  }
  res.send({message: 'created', 'imgName': imgName, 'format': format, 'fileName': imgName + '.' + format})
});

// app.use('/api/images', imagesRouter);

//Launch listening server on port 8080
app.listen(8080, () => {
  console.log('App listening on port 8080!')
});
