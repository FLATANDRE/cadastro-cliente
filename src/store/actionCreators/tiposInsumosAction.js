
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllTiposInsumos = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_INSUMOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/insumos/tipos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_TIPOS_INSUMOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_INSUMOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterTipoInsumo = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_INSUMOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/insumos/tipos' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_TIPOS_INSUMOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_INSUMOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addTipoInsumo = (insumo) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_INSUMOS });

        let url = "";
        
        url = '/insumos/tipos';

        api.post(url, insumo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_INSUMOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_INSUMOS, payload : error_handling(reason)});
            });
    }
}

export const editTipoInsumo = (insumo, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_INSUMOS });

        let url = "";
        
        url = '/insumos/tipos/'+id;

        api.put(url, insumo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_INSUMOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_INSUMOS, payload : error_handling(reason)});
            });
    };
};