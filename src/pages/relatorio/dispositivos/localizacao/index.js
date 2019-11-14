import React, { Component } from 'react';

import { Divider, Grid, Header, Icon } from 'semantic-ui-react'

import api from '../../../../services/api';
import { text } from '../../../../services/locales';

import GoogleMapReact from 'google-map-react';
import "./styles.css";

export default class Localizacao extends Component {


    state = {
        item: null,
        loading: false,
        error: null,
        mac: null,
        timestamp: -1
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mac !== null && nextProps.timestamp !== this.state.timestamp) {
            this.setState(
                {
                    mac: nextProps.mac,
                    timestamp: nextProps.timestamp
                },
                () => {
                    this.loadItens();
                }
            );
        }
    }

    loadItens = async () => {

        const { mac } = this.state;

        if (mac === null) {
            return;
        }

        this.setState({ loading: true, error: null });

        let url = '/dispositivos/localizacao/' + mac;

        api.get(url)
            .then((response) => {
                if (response.data != null) {
                    this.setState({
                        loading: false,
                        item: response.data
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    item: null,
                    error: text("formularios.erro_request")
                });
            });
    };

    render() {

        const { item } = this.state;

        return (
            <>
                {item && item.geoOk === true &&
                    <>
                        <Grid stackable columns={2} >
                            <Grid.Column textAlign="left">
                                <Header as="h2" > {text("geral.localizacao")}</Header>
                            </Grid.Column>
                            <Grid.Column textAlign="right">
                                <small>{item.endereco}</small>
                            </Grid.Column>
                        </Grid>

                        <div style={{ height: '40vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyDObKHcANrj5ZBHz0oqYvAuNlCHBerPJr8' }}
                                defaultCenter={{ lat: item.latitude, lng: item.longitude }}
                                defaultZoom={16}
                                options={createMapOptions}
                            >
                                <div
                                    lat={item.latitude}
                                    lng={item.longitude}
                                    className="marker"
                                >
                                    <Icon
                                        name="map marker alternate"
                                        size='huge'
                                        color="orange"
                                    />
                                </div>
                            </GoogleMapReact>
                        </div>

                        <br /> <br />
                        <Divider />
                        <br />
                    </>
                }

            </>
        );
    }

}

function createMapOptions(maps) {
    return {
        fullscreenControl: false
    };
}
