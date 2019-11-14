
import * as actions from '../actions';

const initialState = {
    listaLocalizacaoFisica: null,
    listaLocalizacaoFisicaFiltrada: null,

    pessoasJuridicas: null,
    pessoasJuridica: null,

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
        case actions.EXECUTANDO_TAREFA_LOCALIZACAO_FISICA:
            return { ...state, executando: true, erro: null, sucesso: null };
        case actions.ERRO_LOCALIZACAO_FISICA:
            return { ...state, erro: action.payload, executando: false };
        case actions.SUCESSO_LOCALIZACAO_FISICA:
            return {
                ...state,
                sucesso: action.payload,
                executando: false,
                erro: false
            };
        case actions.FETCH_ALL_LOCALIZACAO_FISICA:
            return {
                ...state,
                executando: null,
                erro: null,
                listaLocalizacaoFisica: action.payload.content,
                listaLocalizacaoFisicaFiltrada: action.payload.content,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.FILTRAR_LOCALIZACAO_FISICA:
            return {
                ...state,
                listaLocalizacaoFisica: action.payload.content,
                executando: null,
                erro: null,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.RESET_LOCALIZACAO_FISICA:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                listaLocalizacaoFisica: null,
                listaLocalizacaoFisicaFiltrada: null
            };
        case actions.FETCH_ALL_LOCALIZACAO_PESSOA_JURIDICA:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                pessoasJuridicas: action.payload.content,
            };
        default:
            return state;
    }
}