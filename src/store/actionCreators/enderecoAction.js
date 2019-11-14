import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
export const fetchAllPaises = () => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_ENDERECO });   
            api.get('/localizacao/pais?size=1000')
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_PAISES, payload : response.data});
                })
                .catch(reason => {

                    let msg = '';
                    if(reason.response) msg = error_handling(reason);                        
                    else msg = reason ;

                    dispatch({ type : actions.ERRO_ENDERECO, payload : msg});
                });
            
        } catch (error) {
            throw error;
        }
    }
}


export const fetchAllEstado = () => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_ENDERECO });   
            api.get('/localizacao/estado/pais/br?size=30')
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_CIDADE_ESTADO, payload : response.data});
                })
                .catch(reason => {

                    let msg = '';
                    if(reason.response) msg = error_handling(reason);                        
                    else msg = reason ;

                    dispatch({ type : actions.ERRO_ENDERECO, payload : msg});
                });
            
        } catch (error) {
            throw error;
        }
    }
}

