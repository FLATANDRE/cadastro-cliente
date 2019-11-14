
import * as actions from '../actions';

const initialState = {
    listaCompartimentos: null,
    listaCompartimentosFiltrada: null,

    compartimentos: null,
    compartimento: null,

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
        case actions.EXECUTANDO_TAREFA_COMPARTIMENTOS:
            return { ...state, executando: true, erro: null, sucesso: null };
        case actions.ERRO_COMPARTIMENTOS:
            return { ...state, erro: action.payload, executando: false };
        case actions.SUCESSO_COMPARTIMENTOS:
            return {
                ...state,
                sucesso: action.payload,
                executando: false,
                erro: false
            };
        case actions.FETCH_ALL_COMPARTIMENTOS:
            return {
                ...state,
                executando: null,
                erro: null,
                listaCompartimentos: action.payload.content,
                listaCompartimentosFiltrada: action.payload.content,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.FILTRAR_COMPARTIMENTOS:
            return {
                ...state,
                listaCompartimentos: action.payload.content,
                executando: null,
                erro: null,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.RESET_COMPARTIMENTOS:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                listaCompartimentos: null,
                listaCompartimentosFiltrada: null
            };
        case actions.FETCH_ALL_COMPARTIMENTOS_LOCALIZACAO:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                compartimentos: action.payload.content,
            };
        default:
            return state;
    }
}