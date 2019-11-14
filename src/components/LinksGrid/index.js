import React, { Component } from 'react';

import { Header, Grid, List } from 'semantic-ui-react'

import { Link } from 'react-router-dom';

import { getDataMenu } from '../../services/profile'
import api from '../../services/api';

export default class LinksGrid extends Component {

    state = {
        perfis: []
    }

    async  componentDidMount() {

        const response = await api.get("/autenticacao/usuario/meus-perfis");

        var perfis = response.data.map((item) => {
            return item.codigo;
        });

        this.setState({ perfis: perfis })
    }

    render() {

        const { perfis } = this.state;

        return (

            <Grid stackable>
                {
                    getDataMenu(perfis).map((item) =>
                        <>
                            {item.itens.length > 0 &&
                                <Grid.Column width={3}>

                                    <Header as='h2'>
                                        {item.content}
                                    </Header>

                                    <List bulleted>
                                        {
                                            item.itens.map((item) =>
                                                perfis.some(r => item.roles.includes(r)) &&
                                                <List.Item key={item.link} content={item.content} as={Link} to={item.link} />
                                            )
                                        }
                                    </List>

                                </Grid.Column>
                            }
                        </>
                    )
                }
            </Grid>

        );
    }

}