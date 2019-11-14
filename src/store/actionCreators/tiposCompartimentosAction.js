import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllTiposCompartimentos = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_COMPARTIMENTOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/predial/compartimentos/tipos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_TIPOS_COMPARTIMENTOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_COMPARTIMENTOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterTipoCompartimento = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_COMPARTIMENTOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/predial/compartimentos/tipos' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_TIPOS_COMPARTIMENTOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_COMPARTIMENTOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addTipoCompartimento = (compartimento) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_COMPARTIMENTOS });

        let url = "";
        
        url = '/predial/compartimentos/tipos';

        api.post(url, compartimento)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_COMPARTIMENTOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_COMPARTIMENTOS, payload : error_handling(reason)});
            });
    }
}

export const editTipoCompartimento = (compartimento, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_COMPARTIMENTOS });

        let url = "";
        
        url = '/predial/compartimentos/tipos/'+id;

        api.put(url, compartimento)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_COMPARTIMENTOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_COMPARTIMENTOS, payload : error_handling(reason)});
            });
    };
};