import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { InputGroup, FormControl, Button, Jumbotron } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import axios from 'axios';

const client = new W3CWebSocket('wss://socket.polygon.io/stocks');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWebSocketConnected: false,
      data: [],
      stockName: ''
    };
  }

  openWebSocket = () => {
    client.onopen = () => {
      this.authentication();
    };
    client.onmessage = message => {
      console.log('message - ', message);
    };
  };

  fetchStocks = names => {
    this.openWebSocket();
    const params = `${names.join()},*`;
    console.log('params - ', params);
    client.send(JSON.stringify({ action: 'subscribe', params }));
    setTimeout(() => {
      client.close();
      console.log('socket closed');
    }, 20000);
  };

  authentication = () => {
    client.send(
      JSON.stringify({
        action: 'auth',
        params: '0dAXzx7kBiiBMeRIW2MvLkTvK8OW32R2'
      })
    );
  };

  clickHandler = async () => {
    if (this.state.stockName.length > 0) {
      console.log('click');
      const companyname = {
        company: this.state.stockName
      };
      await axios
        .post('http://192.168.31.118:7000/webhook', companyname)
        .then(obj => {
          const companies = obj.data.message.company;
          this.fetchStocks([this.state.stockName]);
          this.fetchStocks(companies);
        })
        .catch(err => console.log('Error - ', err.message));
    } else {
      console.log('Stock cannot be empty.');
    }
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    console.log(this.state.data);
    return (
      <Container className='mt-4'>
        <Jumbotron style={{ background: '#eaece5' }}>
          <InputGroup className='mb-3'>
            <FormControl
              placeholder='Enter the stock name'
              name='stockName'
              value={this.state.stockName}
              onChange={this.changeHandler}
            />
            <InputGroup.Append>
              <Button variant='primary' onClick={this.clickHandler}>
                Scan
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Jumbotron>
      </Container>
    );
  }
}
