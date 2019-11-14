
import * as actions from '../actions';

const initialState = {
    
    listaVinculados: null,
    listaVinculadosFiltrada: null,

    pessoasFisicas: null,
    pessoaFisica: null,

    sucesso: null,
    executando: null,
    erro: null,
    firstPage: true,
    lastPage: true,
    numberOfElements: 0,
    totalElements: 0,
    pageNumber: 0,
    totalPages: null,
    sort: null,
    sortDirection: 'ascending'
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.EXECUTANDO_TAREFA_VINCULADOS:
            return { ...state, executando: true, erro: null, sucesso: null };
        case actions.ERRO_VINCULADOS:
            return { ...state, erro: action.payload, executando: false };
        case actions.SUCESSO_VINCULADOS:
            return { ...state, sucesso: action.payload, executando: false, erro: false };
        case actions.FETCH_ALL_VINCULADOS:
            return {
                ...state,
                executando: null,
                erro: null,
                listaVinculados: action.payload.content,
                listaVinculadosFiltrada: action.payload.content,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.FILTRAR_VINCULADOS:
            return {
                ...state,
                listaVinculadosFiltrada: action.payload.content,
                executando: null,
                erro: null,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.RESET_STATES_VINCULADO:
            return { ...state, executando: null, erro: null, sucesso: null };
        case actions.FETCH_ALL_VINCULADOS_PESSOA_FISICA:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                pessoasFisicas: action.payload.content
            };
        default:
            return state;
    }
}