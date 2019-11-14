import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllOrdemProducao = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_ORDEM_PRODUCAO });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/ordens-producao?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_ORDEM_PRODUCAO, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_ORDEM_PRODUCAO, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterOrdemProducao = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_ORDEM_PRODUCAO });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/ordens-producao' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_ORDEM_PRODUCAO, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_ORDEM_PRODUCAO, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addOrdemProducao = (ordemProducao) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_ORDEM_PRODUCAO });

        let url = "";
        
        url = '/ordens-producao';

        api.post(url, ordemProducao)
            .then(response => {
                dispatch({ type : actions.SUCESSO_ORDEM_PRODUCAO, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_ORDEM_PRODUCAO, payload : error_handling(reason)});
            });
    }
}

export const editOrdemProducao = (ordemProducao, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_ORDEM_PRODUCAO });

        let url = "";
        
        url = '/ordens-producao/'+id;

        api.put(url, ordemProducao)
            .then(response => {
                dispatch({ type : actions.SUCESSO_ORDEM_PRODUCAO, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_ORDEM_PRODUCAO, payload : error_handling(reason)});
            });
    };
};