
import * as actions from '../actions';

const initialState = {
  listaUsuarios : null,
  listaUsuariosFiltrada : null,
  sucesso : null,
  executando : null,
  erro : null,
  firstPage : true,
  lastPage : true,
  numberOfElements : 0,
  totalElements : 0,
  pageNumber : 0, 
  totalPages : null,
  sort: null,
  sortDirection: 'ascending'
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.EXECUTANDO_TAREFA_USUARIOS:
            return {...state, executando : true, erro : null, sucesso : null };
        case actions.ERRO_USUARIOS:
            return {...state, erro : action.payload , executando : false};
        case actions.SUCESSO_USUARIOS:
            return {...state, sucesso : action.payload , executando : false, erro : false};
        case actions.FETCH_ALL_USUARIOS:
            return {...state, 
                executando : null,
                erro : null,
                listaUsuarios : action.payload.content, 
                listaUsuariosFiltrada : action.payload.content, 
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.FILTRAR_USUARIOS:
            return {...state , 
                listaUsuariosFiltrada : action.payload.content,
                executando : null,
                erro : null,
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.RESET_STATES_USUARIO:
            return {...state, executando : null, erro : null, sucesso : null  };
        default:
            return state;
    }
}