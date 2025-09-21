const express = require('express');
const morgan = require('morgan');
const app = express();

//Logging middleware so requests are visible
app.use(morgan('combined'));

//GET endpoint: /convert?lbs=...
app.get('/convert', (req, res) => 
{
  const lbs = Number(req.query.lbs);

  //If the parameter is missing or not a number
  if(req.query.lbs === undefined || Number.isNaN(lbs)) 
  {
    return res.status(400).json({ error: 'Query param lbs is required and must be a number' });
  }

  //If the number is invalid (negative or not finite)
  if(!Number.isFinite(lbs) || lbs < 0) 
  {
    return res.status(422).json({ error: 'lbs must be a non-negative, finite number' });
  }

  //Convert to kilograms (rounded to 3 decimals)
  const kg = Math.round(lbs * 0.45359237 * 1000) / 1000;

  return res.json
  ({
    lbs,
    kg,
    formula: 'kg = lbs * 0.45359237'});
});

//Use port 8080 by default
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on ${port}\n`));

