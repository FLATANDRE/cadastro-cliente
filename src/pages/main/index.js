import React, { Component } from 'react';

import { Segment, Header, Image } from 'semantic-ui-react'

import LinksGrid from '../../components/LinksGrid'

export default class Main extends Component {

  render() {

    return (

      <div>
        <Segment placeholder>
          <Header icon>
            <Image size='massive' src='/images/logo.svg' />
            <Header.Content>
              <br />{process.env.REACT_APP_NAME}
            </Header.Content>
            <Header.Subheader>
              Artificial Intelligence Care - {process.env.REACT_APP_DESCRIPTION}
            </Header.Subheader>
          </Header>

        </Segment>

        <br /><br />
        <div style={{ padding: '0 20px 0 20px' }}>

          <LinksGrid />

        </div>
      </div>

    );
  }

}