import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllContrato = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_CONTRATOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/contratos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_CONTRATOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_CONTRATOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterContrato = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_CONTRATOS});

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }
            url = '/contratos' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_CONTRATOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_CONTRATOS, payload: error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addContrato = (contrato) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_CONTRATOS });
        let url = "/contratos";

        api.post(url, contrato)
            .then(response => {
                dispatch({ type : actions.SUCESSO_CONTRATOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_CONTRATOS, payload : error_handling(reason)});
            });

    }
}

export const editContrato = (contrato) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_CONTRATOS });
        let url = "/contratos/" + contrato.id;

        api.put(url, contrato)
            .then(response => {
                dispatch({ type : actions.SUCESSO_CONTRATOS, payload : 'Registro atualizado com sucesso.'});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_CONTRATOS, payload : error_handling(reason)});
            });

    }
}