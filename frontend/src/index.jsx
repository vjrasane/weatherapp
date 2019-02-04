import React from 'react';
import ReactDOM from 'react-dom';
import { get } from 'axios';
import moment from 'moment';

import './index.css';

const port = process.env.ENDPOINT_PORT;
const baseURL = `${window.location.protocol}//${window.location.hostname}:${port}/api`;

const getWeatherFromApi = async (location) => {
  try {
    const afterMoment = moment().add(3, 'h');
    let url = `${baseURL}/forecast?after=${afterMoment}`;
    url = location
      ? `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
      : url;

    return await get(url);
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
    let weather;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (location) => {
        weather = await getWeatherFromApi(location);
        this.setState({ icon: weather.data.icon.slice(0, -1) });
      });
    } else {
      weather = await getWeatherFromApi();
      this.setState({ icon: weather.data.icon.slice(0, -1) });
    }
  }

  render() {
    const { icon } = this.state;

    return <div className="icon">{icon && <img src={`/img/${icon}.svg`} alt="" />}</div>;
  }
}

ReactDOM.render(<Weather />, document.getElementById('app'));
