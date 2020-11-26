import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Box, Button, CircularProgress, IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert, Refresh } from '@material-ui/icons';
import { connect, disconnect, getCountries, getStatus } from '../api';
import { Alert } from '@material-ui/lab';


export default class RemoteControl extends Component {

  static propTypes = {
    address: PropTypes.string,
    resetAddress: PropTypes.func
  };

  state = {
    headerMenuAnchor: null,
    status: {
      connected: false
    },
    countries: [],
    connectingTo: null,
    loading: false
  };

  componentDidMount () {
    this.fetchStatus();
    this.fetchCountries();
  }

  fetchStatus = async () => {
    try {
      const status = await getStatus(this.props.address);

      this.setState({ status });
    } catch (e) {}
  };

  fetchCountries = async () => {
    try {
      const countries = await getCountries(this.props.address);

      this.setState({ countries });
    } catch (e) {}
  };

  openHeaderMenu = (e) => {
    this.setState({
      headerMenuAnchor: e.currentTarget
    });
  };

  closeHeaderMenu = () => {
    this.setState({
      headerMenuAnchor: null
    })
  };

  connectToCountry = async (country) => {
    this.setState({
      connectingTo: country.replace(/\_/g, ' '),
      loading: true
    });

    window.scrollTo(0, 0);

    try {
      const status = await connect(this.props.address, country);

      this.setState({
        status,
        connectingTo: null,
        loading: false
      });
    } catch (e) {
      this.setState({
        connectingTo: null,
        loading: false
      });
    }
  };

  disconnect = async () => {
    this.setState({
      loading: true
    });

    try {
      const status = await disconnect(this.props.address);

      this.setState({
        status,
        loading: false
      });
    } catch (e) {
      this.setState({
        loading: false
      });
    }
  };

  render () {
    return (
      <>
        <AppBar position='sticky'>
          <Toolbar>
            <Typography variant='h6'>
              NordVPN Remote
            </Typography>
            <Box flexGrow={1}/>
            <IconButton edge='end' color='inherit' onClick={this.openHeaderMenu}>
              <MoreVert/>
            </IconButton>

            <Menu
              anchorEl={this.state.headerMenuAnchor}
              keepMounted
              open={Boolean(this.state.headerMenuAnchor)}
              onClose={this.closeHeaderMenu}>
              <MenuItem onClick={this.props.resetAddress}>Log out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box p={3}>
          {!!this.state.connectingTo && (
            <Box pb={2}>
              <Alert color='warning' severity='warning'>Connecting to {this.state.connectingTo}...</Alert>
            </Box>
          )}

          <Box display='flex' alignItems='flex-end'>
            <Typography variant='subtitle1' component='span'>Status:</Typography>&nbsp;
            <Typography variant='h6' component='span' color={this.state.status.connected ? 'primary' : 'inherit'}>
              {this.state.status.connected ? 'Connected' : 'Disconnected'}
            </Typography>
            <Box flexGrow={1}/>
            <IconButton onClick={this.fetchStatus}>
              <Refresh/>
            </IconButton>
          </Box>


          {this.state.status.connected && (
            <>
              <Box display='flex' alignItems='flex-end'>
                <Typography variant='subtitle1' component='span'>Country:</Typography>&nbsp;
                <Typography variant='h6' component='span'>{this.state.status.country}</Typography>
              </Box>
              <Box display='flex' alignItems='flex-end'>
                <Typography variant='subtitle1' component='span'>IP Address:</Typography>&nbsp;
                <Typography variant='h6' component='span'>{this.state.status.ip}</Typography>
              </Box>
              <Box display='flex' alignItems='flex-end'>
                <Typography variant='subtitle1' component='span'>VPN Server:</Typography>&nbsp;
                <Typography variant='h6' component='span'>{this.state.status.server}</Typography>
              </Box>

              <Box pt={2}>
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  onClick={this.disconnect}
                  disabled={this.state.loading}
                  fullWidth>
                  {this.state.loading ? <CircularProgress size={26}/> : 'Disconnect'}
                </Button>
              </Box>
            </>
          )}

          <br/><br/>
          <hr/>
          <br/>

          <Typography variant='h6'>Countries</Typography>

          {this.state.countries.map((country, index) => (
            <Box mt={1} key={index}>
              <Button fullWidth disabled={this.state.loading} onClick={() => this.connectToCountry(country)}>
                <Box width='100%' textAlign='left'>{country.replace(/\_/g, ' ')}</Box>
              </Button>
            </Box>
          ))}
        </Box>
      </>
    );
  }

}
