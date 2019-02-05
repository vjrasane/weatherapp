import React from 'react';
import ReactDOM from 'react-dom';
import { get } from 'axios';
import moment from 'moment';

import './index.css';

const port = process.env.BACKEND_PORT;
const baseURL = `${window.location.protocol}//${window.location.hostname}:${port}/api`;

const getLocation = () =>
  new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        location => resolve(location),
        () => resolve() // some error occured, resolve undefined
      );
    } else {
      resolve(); // no geo available, resolve undefined
    }
  });

const buildQuery = paramObj =>
  Object.entries(paramObj)
    .map(pair => pair.map(encodeURIComponent).join('='))
    .join('&');

const getWeatherFromApi = async () => {
  try {
    const location = await getLocation();
    const afterMoment = moment().add(3, 'h');
    let params = { after: afterMoment.unix() };
    if (location) {
      const { latitude, longitude } = location.coords;
      params = { ...params, lat: latitude, lon: longitude };
    }
    return await get(`${baseURL}/forecast?${buildQuery(params)}`);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: '',
    };
  }

  async componentWillMount() {
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.data.icon.slice(0, -1) });
  }

  render() {
    const { icon } = this.state;
    return <div className="icon">{icon && <img src={`/img/${icon}.svg`} alt="" />}</div>;
  }
}

ReactDOM.render(<Weather />, document.getElementById('app'));
