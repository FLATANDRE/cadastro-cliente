import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllTiposContainers = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_CONTAINERS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/predial/containers/tipos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_TIPOS_CONTAINERS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_CONTAINERS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterTipoContainer = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_CONTAINERS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/predial/containers/tipos' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_TIPOS_CONTAINERS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_CONTAINERS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addTipoContainer = (container) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_CONTAINERS });

        let url = "";
        
        url = '/predial/containers/tipos';

        api.post(url, container)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_CONTAINERS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_CONTAINERS, payload : error_handling(reason)});
            });
    }
}

export const editTipoContainer = (container, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_CONTAINERS });

        let url = "";
        
        url = '/predial/containers/tipos/'+id;

        api.put(url, container)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_CONTAINERS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_CONTAINERS, payload : error_handling(reason)});
            });
    };
};