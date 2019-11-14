import React, { Component } from 'react'
import { Menu, Segment, Divider, Input } from 'semantic-ui-react'

import { Link } from 'react-router-dom';

import { text, html } from '../../services/locales'
import { getDataMenu } from '../../services/profile'
import { jwtSubject } from '../../services/auth';

export const MENU_INDEX = "aicare-menu-index";

export default class MainMenu extends Component {

  state = {
    isMobileDevice: false,
    perfis: [],
    search: null
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isMobileDevice: nextProps.isMobileDevice, perfis: nextProps.perfis })
  }

  render() {

    const { perfis, search } = this.state;

    const menu = getDataMenu(perfis).map((item) =>
      <>
        {!search && item.itens.length > 0 &&
          <Menu.Item>
            <Menu.Header>
              {item.content}
            </Menu.Header>
            <Menu.Menu>
              {
                item.itens.map((item) =>
                  perfis.some(r => item.roles.includes(r)) &&
                  <Menu.Item key={item.link} content={item.content} as={Link} to={item.link} />
                )
              }
            </Menu.Menu>
          </Menu.Item>
        }
        {search &&
          <Menu.Menu>
            {
              item.itens.map((subitem) =>
                perfis.some(r => subitem.roles.includes(r)) && (item.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || subitem.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) &&
                <Menu.Item key={subitem.link} content={item.content + " > " + subitem.content} as={Link} to={subitem.link} />
              )
            }
          </Menu.Menu>
        }
      </>
    );

    return (

      <div style={{ width: '100%' }}>

        <Menu inverted vertical fluid >
          <Menu.Item>
            <Menu.Header>
              {process.env.REACT_APP_NAME}
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item content={text("menu.home")} as={Link} to="/" />
              <Menu.Item content={text("menu.perfil")} as={Link} to="/perfil" />
              <Menu.Item content={text("menu.sobre")} as={Link} to="/sobre" />
            </Menu.Menu>
          </Menu.Item>
        </Menu>

        <div style={{ padding: '0 10px 0 10px' }}>
          <Input
            fluid
            size='mini'
            icon='filter'
            iconPosition='left'
            placeholder={text("menu.filtro-placeholder")}
            onChange={e => this.setState({ search: e.target.value })}
          />
        </div>

        {perfis &&
          <Menu inverted vertical fluid >
            {search &&
              <Menu.Item>
                <Menu.Header>
                  {html("menu.filtro-para", { s: search })}
                </Menu.Header>
                {menu}
              </Menu.Item>
            }

            {!search &&
              menu
            }
          </Menu>
        }

        <Segment inverted textAlign='center' >

          <Divider />

          {html("menu.logado_como", { user: jwtSubject() })}

          <br />

          <Link to="/perfil">{text("menu.perfil")}</Link> | <Link to="/login">{text("menu.sair")}</Link>

          <Divider />

          <b> &copy; {process.env.REACT_APP_NAME}
            <br />
            {text('login.direitos')}</b>
          <br />

          <small>
            Artificial Intelligence Care - {process.env.REACT_APP_DESCRIPTION}
          </small>

        </Segment>

      </div >
    )
  }
}
