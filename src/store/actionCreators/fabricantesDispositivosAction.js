
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllFabricantesDispositivos = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_DISPOSITIVOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/dispositivos/fabricantes?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_FABRICANTES_DISPOSITIVOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FABRICANTES_DISPOSITIVOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterFabricanteDispositivo = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_DISPOSITIVOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/dispositivos/fabricantes' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_FABRICANTES_DISPOSITIVOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FABRICANTES_DISPOSITIVOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addFabricanteDispositivo = (fabricante) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_DISPOSITIVOS });

        let url = "";
        
        url = '/dispositivos/fabricantes';

        api.post(url, fabricante)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FABRICANTES_DISPOSITIVOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FABRICANTES_DISPOSITIVOS, payload : error_handling(reason)});
            });
    }
}

export const editFabricanteDispositivo = (fabricante, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_DISPOSITIVOS });

        let url = "";
        
        url = '/dispositivos/fabricantes/'+id;

        api.put(url, fabricante)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FABRICANTES_DISPOSITIVOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FABRICANTES_DISPOSITIVOS, payload : error_handling(reason)});
            });
    };
};