import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { uniq } from 'lodash';
import AddressSelector from './AddressSelector';
import RemoteControl from './RemoteControl';

const CURRENT_ADDRESS_KEY = 'nordvpn-remote-address';
const ADDRESS_HISTORY_KEY = 'nordvpn-remote-address-history';

export default class App extends Component {

  constructor (props) {
    super(props);

    const remoteAddress = localStorage.getItem(CURRENT_ADDRESS_KEY) || null;
    let addressHistory = [];

    const addressHistoryString = localStorage.getItem(ADDRESS_HISTORY_KEY);
    if (addressHistoryString) {
      try {
        addressHistory = JSON.parse(addressHistoryString);
      } catch (e) {}
    }

    this.state = {
      remoteAddress,
      addressHistory
    };
  }

  selectAddress = (address) => {
    const history = uniq([ ...this.state.addressHistory, address ]);
    localStorage.setItem(CURRENT_ADDRESS_KEY, address);
    localStorage.setItem(ADDRESS_HISTORY_KEY, JSON.stringify(history));

    this.setState({
      remoteAddress: address,
      addressHistory: history
    });
  };

  resetAddress = () => {
    localStorage.removeItem(CURRENT_ADDRESS_KEY);

    this.setState({
      remoteAddress: null
    });
  };

  render () {
    return (
      <>
        <CssBaseline/>
        {this.state.remoteAddress ? (
          <RemoteControl address={this.state.remoteAddress} resetAddress={this.resetAddress}/>
        ) : (
          <AddressSelector history={this.state.addressHistory} selectAddress={this.selectAddress}/>
        )}
      </>
    );
  }

}
