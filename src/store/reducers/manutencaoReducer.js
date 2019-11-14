
import * as actions from '../actions';

const initialState = {
  listaManutencao : null,
  listaManutencaoFiltrada : null,
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
        case actions.EXECUTANDO_TAREFA_MANUTENCAO:
            return {...state, executando : true, erro : null, sucesso : null };
        case actions.ERRO_MANUTENCAO:
            return {...state, erro : action.payload , executando : false};
        case actions.SUCESSO_MANUTENCAO:
            return {...state, sucesso : action.payload , executando : false, erro : false};
        case actions.FETCH_ALL_MANUTENCAO:
            return {...state, 
                executando : null,
                erro : null,
                listaManutencao : action.payload.content, 
                listaManutencaoFiltrada : action.payload.content, 
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.FILTRAR_MANUTENCAO:
            return {...state , 
                listaManutencaoFiltrada : action.payload.content,
                executando : null,
                erro : null,
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.RESET_STATES_MANUTENCAO:
            return {...state, executando : null, erro : null, sucesso : null  };
        default:
            return state;
    }
}