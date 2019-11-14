import React, { Component } from 'react';

import { Header } from 'semantic-ui-react'

import LinksGrid from '../../components/LinksGrid'

import { text } from '../../services/locales'
import "./styles.css";

export default class Error extends Component {
  render() {
    return (

      <div>

        <Header as="h1"  color='red'>
          {text('erro_page.404')}
        </Header>

        <br /><br />

        {text('erro_page.404-descricao')}

        <br /><br /><br /><br />

        <div style={{ padding: '0 20px 0 20px' }}>
          <LinksGrid />
        </div>
      </div>

    );
  }

}