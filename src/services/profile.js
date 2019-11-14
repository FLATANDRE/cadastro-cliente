import { text } from './locales'

export const getDataMenu = perfis => {

  const filtered = dataMenu.map((item) => ({
    content: item.content,
    itens: item.itens.filter(
      i => perfis.some(r => i.roles.includes(r))
    )
  }))

  return filtered;
};

const dataMenu =
  [
    {
      "content": text("menu.monitoracao"),
      "itens": [
        {
          "content": text("menu.dispositivos"),
          "link": "/relatorio/dispositivos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.equipamentos"),
          "link": "/relatorio/equipamentos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.interacoes"),
          "link": "/relatorio/interacoes",
          "roles": ['ADA']
        },
        {
          "content": text("menu.eventos"),
          "link": "/relatorio/eventos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.historico-login"),
          "link": "/monitoracao/historico-login",
          "roles": ['ADA']
        }
      ]
    }, {
      "content": text("menu.relatorio"),
      "itens": [
        {
          "content": text("menu.contratos"),
          "link": "/relatorio/contratos/mapa",
          "roles": ['ADA', 'ADM', 'GMN', 'GCM']
        },
        {
          "content": text("menu.manutencoes"),
          "link": '/404',
          "roles": ['ADA', 'ADM', 'GMN', 'GCM']
        }
      ]
    },
    {
      "content": text("menu.cadastro"),
      "itens": [
        {
          "content": text("menu.pessoas_fisicas"),
          "link": "/gerencia/pessoal/pessoas-fisicas",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.pessoas_juridicas"),
          "link": "/gerencia/pessoal/pessoas-juridicas",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.grupo_pj"),
          "link": "/gerencia/pessoal/grupos-pessoas-juridicas",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.colaborador_vinculado"),
          "link": "/gerencia/pessoal/vinculados",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.instalacao_localizacao_fisica"),
          "link": "/gerencia/predial/localizacao-fisicas",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.instalacao_compartimento"),
          "link": "/gerencia/predial/compartimentos",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.instalacao_container"),
          "link": "/gerencia/predial/containers",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.usuarios"),
          "link": "/gerencia/usuarios",
          "roles": ['ADA', 'ADM', 'ADH']
        },
        {
          "content": text("menu.equipamento_bomba_infusao"),
          "link": "/gerencia/bombas",
          "roles": ['ADA', 'ADM']
        },
        {
          "content": text("menu.dispositivos"),
          "link": "/gerencia/dispositivos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.ordem-producao"),
          "link": "/ordens-producao",
          "roles": ['ADA']
        },
        {
          "content": text("menu.notas-fiscais-compra"),
          "link": "/notas-fiscais-compra",
          "roles": ['ADA']
        },
        {
          "content": text("menu.contratos"),
          "link": "/gerencia/contratos",
          "roles": ['ADA', 'ADM']
        },
        {
          "content": text("menu.faturas"),
          "link": "/gerencia/faturas",
          "roles": ['ADA']
        },
        {
          "content": text("menu.manutencao-equipamentos"),
          "link": "/gerencia/equipamentos-manutencoes",
          "roles": ['ADA', 'ADM', 'GMN', 'GCM']
        },
      ]
    },
    {
      "content": text("menu.associacao"),
      "itens": [
        {
          "content": text("menu.associacao-dispositivo-equipamento-localizacao"),
          "link": "/associacao/dispositivo-equipamento-localizacao",
          "roles": ['ADA']
        },
        {
          "content": text("menu.associacao-dispositivo-contrato"),
          "link": "/associacao/dispositivo-contrato",
          "roles": ['ADA']
        },
        {
          "content": text("menu.associacao-equipamento-contrato"),
          "link": "/associacao/equipamento-contrato",
          "roles": ['ADA']
        }
      ]
    },
    {
      "content": text("menu.configuracao"),
      "itens": [
        {
          "content": text("menu.modelo-dispositivos"),
          "link": "/gerencia/dispositivos-modelos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.faricante-dispositivos"),
          "link": "/gerencia/dispositivos-fabricantes",
          "roles": ['ADA']
        },
        {
          "content": text("menu.modelo-equipamentos"),
          "link": "/gerencia/equipamentos-modelos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.faricante-equipamentos"),
          "link": "/gerencia/equipamentos-fabricantes",
          "roles": ['ADA']
        },
        {
          "content": text("menu.tipo-dispositivos"),
          "link": "/gerencia/dispositivos-tipos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.tipo-compartimento"),
          "link": "/gerencia/compartimentos-tipos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.tipo-container"),
          "link": "/gerencia/containers-tipos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.tipo-bomba"),
          "link": "/gerencia/bombas-tipos",
          "roles": ['ADA']
        },
        {
          "content": text("menu.tipo-insumo"),
          "link": "/gerencia/insumos-tipos",
          "roles": ['ADA']
        }
      ]
    }
  ]