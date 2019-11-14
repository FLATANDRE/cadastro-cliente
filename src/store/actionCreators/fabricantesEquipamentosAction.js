
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
import { text } from '../../services/locales';

export const fetchAllFabricantesEquipamentos = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_EQUIPAMENTOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/equipamentos/fabricantes?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_FABRICANTES_EQUIPAMENTOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FABRICANTES_EQUIPAMENTOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterFabricanteEquipamento = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_EQUIPAMENTOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/equipamentos/fabricantes' + busca;
      
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_FABRICANTES_EQUIPAMENTOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_FABRICANTES_EQUIPAMENTOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addFabricanteEquipamento = (fabricante) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_EQUIPAMENTOS });

        let url = "";
        
        url = '/equipamentos/fabricantes';

        api.post(url, fabricante)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FABRICANTES_EQUIPAMENTOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FABRICANTES_EQUIPAMENTOS, payload : error_handling(reason)});
            });
    }
}

export const editFabricanteEquipamento = (fabricante, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_FABRICANTES_EQUIPAMENTOS });

        let url = "";
        
        url = '/equipamentos/fabricantes/'+id;

        api.put(url, fabricante)
            .then(response => {
                dispatch({ type : actions.SUCESSO_FABRICANTES_EQUIPAMENTOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_FABRICANTES_EQUIPAMENTOS, payload : error_handling(reason)});
            });
    };
};