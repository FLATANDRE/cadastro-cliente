import React from 'react';

import { connect } from 'react-redux';

import { Sidebar, Container, Menu, Icon, Image, Popup, Grid } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';

import Routes from './routes';
import SideMenu from '../components/SideMenu';
import Ping from '../components/Ping';
import Clock from '../components/Clock';
import api from '../services/api';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { isAuthenticated, jwtSubject } from '../services/auth';
import { text } from '../services/locales';
import { fetchAllEstado, fetchAllPaises } from '../store/actionCreators/enderecoAction';

export const SIDEBAR = "aicare-sidebar";

class DafaultLayout extends React.Component {

    state = {
        sidebarVisible: false,
        isMobileDevice: false,
        perfis: [],
        config: null
    }

    constructor(props) {
        super(props);

        this.props.fetchEstados();
        this.props.fetchPaises();
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    async componentDidMount() {
        this.handleWindowSizeChange();
        var sidebarVisible = localStorage.getItem(SIDEBAR) === "true";

        this.setState({ sidebarVisible: sidebarVisible })

        const responseConfig = await api.get("/config");

        const responsePerfis = await api.get("/autenticacao/usuario/meus-perfis");

        var perfis = responsePerfis.data.map((item) => {
            return item.codigo;
        });

        this.setState({ perfis: perfis, config: responseConfig.data })
    }


    handleWindowSizeChange = () => {
        const isMobileDevice = window.innerWidth < 500;
        this.setState({
            sidebarVisible: !isMobileDevice,
            isMobileDevice: isMobileDevice
        })
    };

    handleSidebar = () => {
        const { sidebarVisible } = this.state;
        this.setState({ sidebarVisible: !sidebarVisible })
        localStorage.setItem(SIDEBAR, !sidebarVisible);
    };

    renderRedirect = () => {
        if (!isAuthenticated()) {
            return <Redirect to='/login' />
        }
    };


    render() {

        const { sidebarVisible, isMobileDevice, perfis, config } = this.state;

        return (
            <>

                {this.renderRedirect()}

                <Menu fixed='top' >

                    <Popup
                        content={sidebarVisible ? text("menu.popup-close") : text("menu.popup-open")} trigger={
                            <Menu.Item onClick={this.handleSidebar} >
                                <Icon name={sidebarVisible ? 'close' : 'sidebar'} />
                            </Menu.Item>
                        } />

                    <Menu.Item header as={Link} to='/'>
                        <Image size='mini' src='/images/logo.svg' style={{ width: '25px', marginRight: '1.5em' }} />
                        {process.env.REACT_APP_NAME}
                    </Menu.Item>
                    <Menu.Menu position='right'>

                        <Menu.Item   >
                            <Ping />
                        </Menu.Item>
                        <Menu.Item   >
                            <LocaleSwitcher />
                        </Menu.Item>

                        {!isMobileDevice &&
                            <>
                                <Popup content={text("menu.perfil")} trigger={
                                    <Menu.Item as={Link} to="/perfil" >
                                        <Icon name="user" /> {jwtSubject()}
                                    </Menu.Item>
                                } />
                                <Menu.Item>
                                    <Icon name="server" /> {config ? config.registro : ""}
                                </Menu.Item>
                                {perfis && perfis.includes("ADA") &&
                                    <Menu.Item>
                                        <Clock />
                                    </Menu.Item>
                                }
                            </>
                        }

                        {isMobileDevice &&
                            <Popup content={jwtSubject()} trigger={
                                <Menu.Item as={Link} to="/perfil" >
                                    <Icon name="user" />
                                </Menu.Item>
                            } />
                        }
                    </Menu.Menu>
                </Menu>

                <Sidebar.Pushable style={{ marginTop: '52px', backgroundColor: '#f3f3f3' }} >

                    <Sidebar
                        as={Menu}
                        visible={sidebarVisible}
                        animation={isMobileDevice ? 'overlay' : 'slide along'}
                        inverted
                    >
                        <SideMenu
                            isMobileDevice={isMobileDevice}
                            perfis={perfis}
                        />
                    </Sidebar>

                    <Sidebar.Pusher
                        dimmed={sidebarVisible && isMobileDevice}
                    >
                        <Container style={{ padding: '2em', width: '100%', minHeight: isMobileDevice ? '10vh' : '100vh', backgroundColor: '#ffffff', paddingRight: (sidebarVisible && !isMobileDevice) ? '280px' : '3em' }} >
                            <Routes />
                        </Container>

                        {!sidebarVisible &&
                            <Grid
                                columns='equal'
                                divided
                                inverted
                                padded
                            >
                                <Grid.Row
                                    color='black'
                                    textAlign='center'>

                                    <Grid.Column
                                        textAlign="left"
                                        verticalAlign="middle"
                                    >
                                        <Link to="/">{text("menu.home")}</Link> |  <Link to="/perfil">{text("menu.perfil")}</Link> |  <Link to="/sobre">{text("menu.sobre")}</Link>
                                    </Grid.Column>

                                    <Grid.Column
                                        textAlign="right"
                                    >
                                        <b> &copy; {process.env.REACT_APP_NAME}
                                            <br />
                                            {text('login.direitos')}</b>
                                        <br />

                                        <small>
                                            Artificial Intelligence Care - {process.env.REACT_APP_DESCRIPTION}
                                        </small>
                                    </Grid.Column>

                                </Grid.Row>
                            </Grid>
                        }

                    </Sidebar.Pusher>

                </Sidebar.Pushable>

            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPaises: () => dispatch(fetchAllPaises()),
        fetchEstados: () => dispatch(fetchAllEstado()),
    };
};

export default connect(null, mapDispatchToProps)(DafaultLayout);