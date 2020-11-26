import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Box, TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { getStatus } from '../api';
import { has } from 'lodash';

export default class AddressSelector extends Component {

  static propTypes = {
    history: PropTypes.array,
    selectAddress: PropTypes.func
  };

  state = {
    address: '',
    loading: false,
    error: null
  };

  handleAddressChange = (e) => {
    this.setState({
      address: e.target.value.replace()
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true,
      error: null
    });

    try {
      const status = await getStatus(this.state.address);

      if (!has(status, 'connected')) {
        throw 1;
      }

      this.setState({
        loading: false
      });

      this.props.selectAddress(this.state.address);
    } catch (e) {
      this.setState({
        loading: false,
        error: 'Invalid IP Address'
      });
    }
  };

  handleHistoryClick = (address) => {
    this.props.selectAddress(address);
  };

  render () {
    return (
      <>
        <AppBar position='sticky'>
          <Toolbar>
            <Typography variant='h6'>
              NordVPN Remote
            </Typography>
          </Toolbar>
        </AppBar>

        <Box p={3}>
          {!!this.state.error && (
            <Box pb={2}>
              <Alert color='error' severity='error'>{this.state.error}</Alert>
            </Box>
          )}
          <form onSubmit={this.handleSubmit}>
            <TextField
              label='NordVPN Controller IP Address'
              variant='outlined'
              value={this.state.address}
              onChange={this.handleAddressChange}
              disabled={this.state.loading}
              fullWidth/>
            <Box pt={2}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                type='submit'
                disabled={this.state.loading}
                fullWidth>
                {this.state.loading ? <CircularProgress size={26}/> : 'Log in'}
              </Button>
            </Box>
          </form>

          {this.props.history.length > 0 && (
            <Box>
              <br/><br/>
              <hr/>
              <br/>
              <Typography variant='h6'>Address history</Typography>

              {this.props.history.map((address, index) => (
                <Box mt={1} key={index}>
                  <Button fullWidth disabled={this.state.loading} onClick={() => this.handleHistoryClick(address)}>
                    <Box width='100%' textAlign='left'>{address}</Box>
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </>
    );
  }

}
