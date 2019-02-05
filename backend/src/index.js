require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const { get, } = require('axios');
const cors = require('kcors');
const moment = require('moment');
const { first, } = require('lodash');
require('dotenv').config();

const appId = process.env.APPID || '';
const mapURI =
  process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.BACKEND_PORT || 9000;

const app = new Koa();

app.use(cors());

const fetch = endpoint => async query => {
  const location =
    'lat' in query ? `lat=${query.lat}&lon=${query.lon}` : `q=${targetCity}`;
  const url = `${endpoint}?appid=${appId}&${location}`;
  const response = await get(url);
  return response ? response.data : {};
};

const weatherEndpoint = `${mapURI}/weather`;
const forecastEndpoint = `${mapURI}/forecast`;

router.get('/api/weather', async ctx => {
  const weatherData = await fetch(weatherEndpoint)(ctx.query);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

router.get('/api/forecast', async ctx => {
  const forecastData = await fetch(forecastEndpoint)(ctx.query);

  const forecast = ctx.query.after
    ? forecastData.list.find(
        forecast => moment.unix(forecast.dt) > moment.unix(ctx.query.after)
      )
    : first(forecastData.list);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = forecast ? forecast.weather[0] : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
