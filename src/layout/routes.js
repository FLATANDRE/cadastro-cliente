import React from "react";

import { Route, Switch } from 'react-router-dom';

import Main from '../pages/main';
import Profile from '../pages/profile';
import Error from '../pages/error';
import Sobre from '../pages/sobre';
import PessoasJuridicasTable from '../pages/gerencia/pessoal/pessoas-juridicas/table';
import PessoasJuridicasForm from '../pages/gerencia/pessoal/pessoas-juridicas/form';
import PessoasFisicasTable from '../pages/gerencia/pessoal/pessoas-fisicas/table';
import PessoasFisicasForm from '../pages/gerencia/pessoal/pessoas-fisicas/form';
import VinculadoTable from '../pages/gerencia/pessoal/vinculado/table';
import VinculadoForm from '../pages/gerencia/pessoal/vinculado/form';
import DispositivosTable from '../pages/gerencia/dispositivo/table';
import DispositivosForm from '../pages/gerencia/dispositivo/form';
import RelatorioDispositivosTable from '../pages/relatorio/dispositivos/table';
import RelatorioDispositivosItem from '../pages/relatorio/dispositivos/item';
import RelatorioEquipamentosTable from '../pages/relatorio/equipamentos/table';
import RelatorioEquipamentosItem from '../pages/relatorio/equipamentos/item';
import RelatorioEventos from '../pages/relatorio/eventos';
import RelatorioInteracoes from '../pages/relatorio/interacoes';
import RelatorioContratosMapa from '../pages/relatorio/contratos/mapa';
import RelatorioContratosItem from '../pages/relatorio/contratos/item';
import RelatorioContratosBomba from '../pages/relatorio/contratos/bombas';
import RelatorioContratosEquipos from '../pages/relatorio/contratos/equipos';
import RelatorioContratosPreco from '../pages/relatorio/contratos/precos';
import UsuariosTable from '../pages/gerencia/usuario/table';
import UsuarioForm from '../pages/gerencia/usuario/form';
import TiposDispositivosTable from '../pages/gerencia/dispositivo/tipos/table';
import TipoDispositivoForm from '../pages/gerencia/dispositivo/tipos/form';
import BombasTable from '../pages/gerencia/bomba/table';
import BombaForm from '../pages/gerencia/bomba/form';
import TiposBombasTable from '../pages/gerencia/bomba/tipos/table';
import TipoBombaForm from '../pages/gerencia/bomba/tipos/form';
import ContratoTable from '../pages/gerencia/contrato/table';
import ContratoForm from '../pages/gerencia/contrato/form';
import FaturaTable from '../pages/gerencia/fatura/table';
import FaturaForm from '../pages/gerencia/fatura/form';
import AssociacaoDispositivoEquipamentoLocalizacao from '../pages/associacao/dispositivo-equipamento-localizacao';
import AssociacaoDispositivoContrato from '../pages/associacao/dispositivo-contrato';
import AssociacaoEquipamentoContrato from '../pages/associacao/equipamento-contrato';
import FabricantesDispositivosTable from '../pages/gerencia/dispositivo/fabricantes/table';
import FabricanteDispositivoForm from '../pages/gerencia/dispositivo/fabricantes/form';
import ModelosDispositivosTable from '../pages/gerencia/dispositivo/modelos/table';
import ModeloDispositivoForm from '../pages/gerencia/dispositivo/modelos/form';
import FabricantesEquipamentosTable from '../pages/gerencia/equipamentos/fabricantes/table';
import FabricanteEquipamentosForm from '../pages/gerencia/equipamentos/fabricantes/form';
import ModelosEquipamentosTable from '../pages/gerencia/equipamentos/modelos/table';
import ModeloEquipamentosForm from '../pages/gerencia/equipamentos/modelos/form';
import ManutencaoTable from '../pages/gerencia/equipamentos/manutencao/table';
import ManutencaoForm from '../pages/gerencia/equipamentos/manutencao/form';
import TiposContainersTable from '../pages/predial/containers/tipos/table';
import TipoContainerForm from '../pages/predial/containers/tipos/form';
import TiposCompartimentosTable from '../pages/predial/compartimentos/tipos/table';
import TipoCompartimentoForm from '../pages/predial/compartimentos/tipos/form';
import LocalizacaoFisicaTable from '../pages/gerencia/predial/localizacao-fisica/table';
import LocalizacaoFisicaForm from '../pages/gerencia/predial/localizacao-fisica/form';
import CompartimentosTable from '../pages/gerencia/predial/compartimentos/table';
import CompartimentoForm from '../pages/gerencia/predial/compartimentos/form';
import ContainersTable from '../pages/gerencia/predial/containers/table';
import ContainerForm from '../pages/gerencia/predial/containers/form';
import GruposPessoasJuridicasTable from '../pages/gerencia/pessoal/grupos-pessoas-juridicas/table';
import GruposPessoasJuridicasForm from '../pages/gerencia/pessoal/grupos-pessoas-juridicas/form';
import NotasFiscaisCompraTable from '../pages/notas-fiscais-compra/table';
import NotasFiscaisCompraForm from '../pages/notas-fiscais-compra/form';
import TiposInsumosTable from '../pages/gerencia/insumo/tipos/table';
import TipoInsumoForm from '../pages/gerencia/insumo/tipos/form';
import OrdemProducaoTable from '../pages/ordem-producao/table';
import OrdemProducaoForm from '../pages/ordem-producao/form';
import HistoricoLogin from '../pages/monitoracao/historico-login/table'

class Routes extends React.Component {
    render() {
        return (
            <>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/perfil" component={Profile} /> 
                    <Route path="/sobre" component={Sobre} /> 
                    <Route path="/gerencia/contratos" component={ContratoTable} />
                    <Route path="/gerencia/contrato/:id?" component={ContratoForm} /> 
                    <Route path="/gerencia/pessoal/pessoas-juridicas" component={PessoasJuridicasTable} /> 
                    <Route path="/gerencia/pessoal/pessoa-juridica/:id?" component={PessoasJuridicasForm} />
                    <Route path="/gerencia/pessoal/grupo-pessoa-juridica/:id?" component={GruposPessoasJuridicasForm} /> 
                    <Route path="/gerencia/pessoal/grupos-pessoas-juridicas" component={GruposPessoasJuridicasTable} /> 
                    <Route path="/gerencia/pessoal/pessoas-fisicas" component={PessoasFisicasTable} /> 
                    <Route path="/gerencia/pessoal/pessoa-fisica/:id?" component={PessoasFisicasForm} /> 
                    <Route path="/gerencia/pessoal/vinculados" component={VinculadoTable} /> 
                    <Route path="/gerencia/pessoal/vinculado/:id?" component={VinculadoForm} /> 
                    <Route path="/gerencia/dispositivos" component={DispositivosTable} /> 
                    <Route path="/gerencia/dispositivo/:id?" component={DispositivosForm} /> 
                    <Route path="/gerencia/dispositivos-tipos" component={TiposDispositivosTable} /> 
                    <Route path="/gerencia/dispositivo-tipo/:id?" component={TipoDispositivoForm} /> 
                    <Route path="/gerencia/insumos-tipos" component={TiposInsumosTable} /> 
                    <Route path="/gerencia/insumo-tipo/:id?" component={TipoInsumoForm} /> 
                    <Route path="/gerencia/dispositivos-fabricantes" component={FabricantesDispositivosTable} /> 
                    <Route path="/gerencia/dispositivo-fabricante/:id?" component={FabricanteDispositivoForm} /> 
                    <Route path="/gerencia/dispositivos-modelos" component={ModelosDispositivosTable} /> 
                    <Route path="/gerencia/dispositivo-modelo/:id?" component={ModeloDispositivoForm} /> 
                    <Route path="/gerencia/equipamentos-fabricantes" component={FabricantesEquipamentosTable} /> 
                    <Route path="/gerencia/equipamento-fabricante/:id?" component={FabricanteEquipamentosForm} /> 
                    <Route path="/gerencia/equipamentos-modelos" component={ModelosEquipamentosTable} /> 
                    <Route path="/gerencia/equipamento-modelo/:id?" component={ModeloEquipamentosForm} /> 
                    <Route path="/gerencia/equipamentos-manutencoes" component={ManutencaoTable} /> 
                    <Route path="/gerencia/equipamento-manutencao/:id?" component={ManutencaoForm} /> 
                    <Route path="/gerencia/faturas" component={FaturaTable} />
                    <Route path="/gerencia/fatura/:id?" component={FaturaForm} /> 
                    <Route path="/gerencia/bombas-tipos" component={TiposBombasTable} /> 
                    <Route path="/gerencia/bomba-tipo/:id?" component={TipoBombaForm} /> 
                    <Route path="/gerencia/containers-tipos" component={TiposContainersTable} /> 
                    <Route path="/gerencia/container-tipo/:id?" component={TipoContainerForm} /> 
                    <Route path="/gerencia/compartimentos-tipos" component={TiposCompartimentosTable} /> 
                    <Route path="/gerencia/compartimento-tipo/:id?" component={TipoCompartimentoForm} /> 
                    <Route path="/gerencia/usuarios" component={UsuariosTable} /> 
                    <Route path="/gerencia/usuario/:id?" component={UsuarioForm} /> 
                    <Route path="/gerencia/bombas" component={BombasTable} /> 
                    <Route path="/gerencia/bomba/:id?" component={BombaForm} /> 
                    <Route path="/relatorio/dispositivos" component={RelatorioDispositivosTable} /> 
                    <Route path="/relatorio/dispositivo/:id" component={RelatorioDispositivosItem} /> 
                    <Route path="/relatorio/equipamentos" component={RelatorioEquipamentosTable} /> 
                    <Route path="/relatorio/equipamento/:id" component={RelatorioEquipamentosItem} /> 
                    <Route path="/relatorio/eventos" component={RelatorioEventos} /> 
                    <Route path="/relatorio/interacoes" component={RelatorioInteracoes} />
                    <Route path="/relatorio/contratos/mapa" component={RelatorioContratosMapa} />
                    <Route exact path="/relatorio/contrato/:id" component={RelatorioContratosItem} />
                    <Route exact path="/relatorio/contrato/bomba/:id" component={RelatorioContratosBomba} />
                    <Route exact path="/relatorio/contrato/preco/:id" component={RelatorioContratosPreco} />
                    <Route exact path="/relatorio/contrato/equipo/:id" component={RelatorioContratosEquipos} />
                    <Route path="/gerencia/predial/localizacao-fisicas" component={LocalizacaoFisicaTable} />
                    <Route path="/gerencia/predial/localizacao-fisica/:id?" component={LocalizacaoFisicaForm} />
                    <Route path="/gerencia/predial/compartimentos" component={CompartimentosTable} />
                    <Route path="/gerencia/predial/compartimento/:id?" component={CompartimentoForm} />
                    <Route path="/gerencia/predial/containers" component={ContainersTable} />
                    <Route path="/gerencia/predial/container/:id?" component={ContainerForm} />
                    <Route path="/notas-fiscais-compra" component={NotasFiscaisCompraTable} />
                    <Route path="/nota-fiscal-compra/:id?" component={NotasFiscaisCompraForm} />
                    <Route path="/ordens-producao" component={OrdemProducaoTable} />
                    <Route path="/ordem-producao/:id?" component={OrdemProducaoForm} />
                    <Route path="/associacao/dispositivo-equipamento-localizacao/:mac?" component={AssociacaoDispositivoEquipamentoLocalizacao} /> 
                    <Route path="/associacao/dispositivo-contrato" component={AssociacaoDispositivoContrato} /> 
                    <Route path="/associacao/equipamento-contrato" component={AssociacaoEquipamentoContrato} /> 
                    <Route path="/monitoracao/historico-login" component={HistoricoLogin} />
                    <Route path="/associcao/dispositivo-equipamento-localizacao/:mac?" component={AssociacaoDispositivoEquipamentoLocalizacao} /> 
                    <Route path="*" component={Error} />
                </Switch>
            </>
        );
    }
}

export default Routes;