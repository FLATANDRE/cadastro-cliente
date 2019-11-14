import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllNotasFiscaisCompra = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_NOTAS_FISCAIS_COMPRA });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/notas-fiscais-compra?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_NOTAS_FISCAIS_COMPRA, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_NOTAS_FISCAIS_COMPRA, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterNotaFiscalCompra = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_NOTAS_FISCAIS_COMPRA });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/notas-fiscais-compra' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_NOTAS_FISCAIS_COMPRA, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_NOTAS_FISCAIS_COMPRA, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addNotaFiscalCompra = (notaFiscalCompra) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_NOTAS_FISCAIS_COMPRA });

        let url = "";
        
        url = '/notas-fiscais-compra';

        api.post(url, notaFiscalCompra)
            .then(response => {
                dispatch({ type : actions.SUCESSO_NOTAS_FISCAIS_COMPRA, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_NOTAS_FISCAIS_COMPRA, payload : error_handling(reason)});
            });
    }
}

export const editNotaFiscalCompra = (notaFiscalCompra, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_NOTAS_FISCAIS_COMPRA });

        let url = "";
        
        url = '/notas-fiscais-compra/'+id;

        api.put(url, notaFiscalCompra)
            .then(response => {
                dispatch({ type : actions.SUCESSO_NOTAS_FISCAIS_COMPRA, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_NOTAS_FISCAIS_COMPRA, payload : error_handling(reason)});
            });
    };
};