import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllFaturas = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_FATURAS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/faturas?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_FATURAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FATURAS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterFatura = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_FATURAS});

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }
            url = '/faturas' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_FATURAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FATURAS, payload: error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addFatura = (fatura) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FATURAS });
        let url = "/faturas";

        api.post(url, fatura)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FATURAS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FATURAS, payload : error_handling(reason)});
            });

    }
}

export const editFatura = (fatura) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FATURAS });
        let url = "/faturas/" + fatura.id;

        api.put(url, fatura)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FATURAS, payload : 'Registro atualizado com sucesso.'});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FATURAS, payload : error_handling(reason)});
            });

    }
}