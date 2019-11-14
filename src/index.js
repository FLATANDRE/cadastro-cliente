import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import ReactDOM from 'react-dom';
import App from './App';
import pessoaReducer from './store/reducers/pessoaReducer';
import enderecoReducer from './store/reducers/enderecoReducer';
import usuarioReducer from './store/reducers/usuarioReducer';
import bombaReducer from './store/reducers/bombaReducer';
import perfilReducer from './store/reducers/perfilReducer';
import contratoReducer from './store/reducers/contratoReducer';
import tiposDispositivosReducer from './store/reducers/tiposDispositivosReducer';
import tiposBombasReducer from './store/reducers/tiposBombasReducer';
import fabricantesDispositivosReducer from './store/reducers/fabricantesDispositivosReducer';
import modelosDispositivosReducer from './store/reducers/modelosDispositivosReducer';
import fabricantesEquipamentosReducer from './store/reducers/fabricantesEquipamentosReducer';
import modelosEquipamentosReducer from './store/reducers/modelosEquipamentosReducer';
import tiposContainersReducer from './store/reducers/tiposContainersReducer';
import tiposCompartimentosReducer from './store/reducers/tiposCompartimentosReducer';
import vinculadoReducer from './store/reducers/vinculadoReducer';
import localizacaoFisicaReducer from './store/reducers/localizacaoFisicaReducer';
import gruposPessoasJuridicasReducer from './store/reducers/gruposPessoasJuridicasReducer';
import notasFiscaisCompraReducer from './store/reducers/notasFiscaisCompraReducer';
import tiposInsumosReducer from './store/reducers/tiposInsumosReducer';
import ordemProducaoReducer from './store/reducers/ordemProducaoReducer';
import compartimentosReducer from './store/reducers/compartimentosReducer';
import containersReducer from './store/reducers/containersReducer';
import faturaReducer from './store/reducers/faturaReducer';
import manutencaoReducer from './store/reducers/manutencaoReducer';

require('dotenv').config();

const store = createStore(
    combineReducers({
       pessoaReducer,
       enderecoReducer,
       usuarioReducer,
       perfilReducer,
       tiposDispositivosReducer,
       bombaReducer,
       tiposBombasReducer,
       contratoReducer,
       fabricantesDispositivosReducer,
       modelosDispositivosReducer,
       fabricantesEquipamentosReducer,
       modelosEquipamentosReducer,
       tiposContainersReducer,
       tiposCompartimentosReducer,
       vinculadoReducer,
       localizacaoFisicaReducer,
       gruposPessoasJuridicasReducer,
       notasFiscaisCompraReducer,
       tiposInsumosReducer,
       ordemProducaoReducer,
       compartimentosReducer,
       containersReducer,
       faturaReducer,
       manutencaoReducer,
    }),
    composeWithDevTools(
        applyMiddleware(
            thunk,
        )
    ));


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root'));
