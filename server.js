const express = require('express');
const request = require('request');

const app = express();

app.use(express.static('public'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req,res) => {
    // res.send("Hello BIG World!");
    res.sendFile('index.html', { root: "./public/"});
})


// var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";

app.get('/api/:state/:date', (req, res) => {
    console.log("hit the STATES route!")
    let state = req.params.state;
    let date = req.params.date;
  request(
    { url: 'https://covidtracking.com/api/v1/states/' + state.toLocaleLowerCase() + '/' + date + '.json' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
          console.log(error);
        return res.status(500).json({ type: 'error', error });
      }
      console.log(body);
      res.json(JSON.parse(body));
    }
  )
});

// var query = "https://covidtracking.com/api/v1/us/" + date + ".json";

app.get('/usa/:date', (req, res) => {
    console.log("hit the USA route!")
    let date = req.params.date;
  request(
    { url: "https://covidtracking.com/api/v1/us/" + date + ".json" },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', error });
      }
      res.json(JSON.parse(body));
    }
  )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));