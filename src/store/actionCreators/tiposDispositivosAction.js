
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllTiposDispositivos = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_DISPOSITIVOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/dispositivos/tipos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_TIPOS_DISPOSITIVOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_DISPOSITIVOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterTipoDispositivo = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_DISPOSITIVOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/dispositivos/tipos' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_TIPOS_DISPOSITIVOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_DISPOSITIVOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addTipoDispositivo = (dispositivo) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_DISPOSITIVOS });

        let url = "";
        
        url = '/dispositivos/tipos';

        api.post(url, dispositivo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_DISPOSITIVOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_DISPOSITIVOS, payload : error_handling(reason)});
            });
    }
}

export const editTipoDispositivo = (dispositivo, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_DISPOSITIVOS });

        let url = "";
        
        url = '/dispositivos/tipos/'+id;

        api.put(url, dispositivo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_DISPOSITIVOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_DISPOSITIVOS, payload : error_handling(reason)});
            });
    };
};