import React, { Component } from 'react';

import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Link } from 'react-router-dom';

import { Header, Grid, Button, Icon, Popup, Divider, Label, Dropdown } from 'semantic-ui-react'

import GoogleMapReact from 'google-map-react';

import { formataDinheiro } from '../../../../utils/functions'

import "./styles.css";

const optionsplanoFiltro = [
    { key: 0, text: 'Nenhum', value: 0 },
    { key: 1, text: 'Equipo', value: 1 },
    { key: 2, text: 'Preço', value: 2 },
    { key: 3, text: 'Bomba', value: 3 },
]

export default class ContratoMapa extends Component {

    static defaultProps = {
        center: {
            lat: -23.0796208,
            lng: -44.8459787
        },
        zoom: 8
    };


    state = {
        itens: null,
        error: null,
        sucesses: null,
        loading: false,
        planoFiltro: 0
    };

    componentDidMount() {
        this.loadItens();
    }

    loadItens = async () => {
        const response = await api.get("/relatorios/contratos/mapas");
        this.setState({ itens: response.data });
    }

    handleRefresh = () => {
        this.loadItens();
    }

    handleChangeplanoFiltro = (e, { value }) => this.setState({ planoFiltro: value })

    render() {
        const { itens, loading, planoFiltro } = this.state;

        return (
            <>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text("relatorio-contratos.titulo")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Dropdown
                            text='Plano de ação'
                            icon='filter'
                            onChange={this.handleChangeplanoFiltro}
                            floating
                            labeled
                            button
                            options={optionsplanoFiltro}
                            value={planoFiltro}
                            className='icon'
                        />
                        <Button icon size='medium' onClick={this.handleRefresh} loading={loading}>
                            <Icon name='refresh' />
                        </Button>
                    </Grid.Column>
                </Grid>

                <br />

                <div style={{ height: '80vh', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyDObKHcANrj5ZBHz0oqYvAuNlCHBerPJr8' }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        options={createMapOptions}
                    >
                        {itens &&
                            itens.map((item) =>
                                <div
                                    lat={item.pessoaJuridica.endereco.latitude}
                                    lng={item.pessoaJuridica.endereco.longitude}
                                    className="marker"
                                >
                                    <Popup
                                        key={item.numeroContrato}
                                        position='top center'
                                        flowing
                                        hoverable
                                        trigger={
                                            <Icon
                                                name="map marker alternate"
                                                size='big'
                                                color={item.statusColor}
                                            >
                                                <Label basic color={item.statusColor}>
                                                    <div className="label-marker">
                                                        <div className="label">{item.pessoaJuridica.nome}</div>

                                                        {planoFiltro === 1 &&
                                                            <div className="plano" >
                                                                <Link to={"/relatorio/contrato/equipo/" + item.numeroContrato}>
                                                                    <span className="label">Equipo:&nbsp;</span>
                                                                    <span className="value" style={{color:item.statusColor}} >{item.equipos > 0 ? "+" : ""}{item.equipos}</span>
                                                                </Link>
                                                            </div>
                                                        }

                                                        {planoFiltro === 2 &&
                                                            <div className="plano">
                                                                <Link to={"/relatorio/contrato/preco/" + item.numeroContrato}>
                                                                    <span className="label">Preço:&nbsp;</span>
                                                                    <span className="value" style={{color:item.statusColor}}><span className="sub">R$</span>{formataDinheiro(item.preco)}</span>
                                                                </Link>
                                                            </div>
                                                        }

                                                        {planoFiltro === 3 &&
                                                            <div className="plano">
                                                                <Link to={"/relatorio/contrato/bomba/" + item.numeroContrato}>
                                                                    <span className="label">Bomba:&nbsp;</span>
                                                                    <span className="value" style={{color:item.statusColor}}>{item.bombas > 0 ? "+" : ""}{item.bombas}</span>
                                                                </Link>
                                                            </div>
                                                        }


                                                    </div>
                                                </Label>
                                            </Icon>
                                        }
                                    >
                                        <div className="popup">
                                            <Grid columns={1} >
                                                <Grid.Column color={item.statusColor}>
                                                    <Header as="h3">
                                                        <Header.Content style={{ color: "white" }}>
                                                            {item.pessoaJuridica.nome}
                                                        </Header.Content>
                                                        <Header.Subheader >
                                                            <small style={{ color: "#f3f3f3", fontSize: "10px" }}>{item.pessoaJuridica.endereco.enderecoFormatado}</small>
                                                            <div className="div-contrato">{item.numeroContrato}</div>
                                                        </Header.Subheader>
                                                    </Header>
                                                </Grid.Column>
                                            </Grid>
                                            <br />
                                            <center>
                                                <div className="estatisticas">
                                                    <div className="label">Modelo</div>
                                                    <div className="value">{item.modeloEquipamento.nome}</div>
                                                </div>

                                                <Divider />

                                                <Grid columns={2} width="equal" >

                                                    <Grid.Column>
                                                        <div className="estatisticas">
                                                            <div className="label">Quantidade</div>
                                                            <div className="value">{item.quantidadeEquipamentosContratados}</div>
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <div className="estatisticas">
                                                            <div className="label">Equipos/mês</div>
                                                            <div className="value">{item.quantidadeEquiposContratados}</div>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid>
                                                <Divider />
                                                <div className="sub-titulo">Plano de ação</div>
                                                <Grid columns={3} width="equal" >
                                                    <Grid.Column textAlign="center" as={Link} to={"/relatorio/contrato/equipo/" + item.numeroContrato}>
                                                        <div className={"estatisticas estatisticas-" + item.statusColor}>
                                                            <span className="label">Equipo</span><br />
                                                            <span className="value">{item.equipos > 0 ? "+" : ""}{item.equipos}</span>
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column textAlign="center" as={Link} to={"/relatorio/contrato/preco/" + item.numeroContrato}>
                                                        <div className={"estatisticas estatisticas-" + item.statusColor}>
                                                            <span className="label">Preço</span><br />
                                                            <span className="value"><span className="sub">R$</span>{formataDinheiro(item.preco)}</span>
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column textAlign="center" as={Link} to={"/relatorio/contrato/bomba/" + item.numeroContrato}>
                                                        <div className={"estatisticas estatisticas-" + item.statusColor}>
                                                            <span className="label">Bomba</span><br />
                                                            <span className="value">{item.bombas > 0 ? "+" : ""}{item.bombas}</span>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid>

                                                <Divider />
                                                <Button
                                                    content='Mais detalhes'
                                                    icon='plus'
                                                    labelPosition='left'
                                                    as={Link}
                                                    to={'/relatorio/contrato/' + item.numeroContrato}
                                                />

                                            </center>
                                        </div>
                                    </Popup>
                                </div>
                            )
                        }
                    </GoogleMapReact>
                </div>
            </>
        );
    }
}

function createMapOptions(maps) {
    return {
        mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: true,
        fullscreenControl: false
    };
}

