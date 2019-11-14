import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown, Breadcrumb } from 'semantic-ui-react';
import { Formik } from "formik";
import { Link, Redirect } from 'react-router-dom';
import { text } from '../../../../../services/locales';
import { html } from '../../../../../services/locales';
import api from '../../../../../services/api';

//Reactprime
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';

//Reactprime css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';

import { RESET_LOCALIZACAO_FISICA } from '../../../../../store/actions';

import { addLocalizacaoFisica, editLocalizacaoFisica, filterPessoaJuridica } from '../../../../../store/actionCreators/localizacaoFisicaAction';


class LocalizacaoFisicaForm extends Component {

	state = {
		localizacaoFisica: null,
		pessoaJuridica: null,
		autoCompletePessoaJuridicas: [],
		paisesOptions: [],
		estadosOptions: [],
		cidadesOptions: [],
		carregandoForm: false,
		disabled: true,
		id: this.props.match.params.id
	};

	async componentDidMount() {

		this.props.resetStates();
		this.setState({ loading: true });
		if (this.props.location && this.props.location.pessoaJuridica) {
			this.setState({ pessoaJuridica: this.props.location.pessoaJuridica });
			this.setState({ autoCompletePessoaJuridicas: [this.props.location.pessoaJuridica] });
		}
		if (this.props.match.params.id) {
			const { id } = this.props.match.params;
			const response = await api.get("/predial/localizacao-fisica/" + id);
			this.setState({ localizacaoFisica: response.data });
			this.setState({ disabled: false });

			let responseCidade = await api.get('/localizacao/cidade/' + response.data.endereco.cidade.id);
			if (responseCidade.data) {
				let options = [];
				options.push({ text: responseCidade.data.nome, key: responseCidade.data.id, value: responseCidade.data.id })
				this.setState({ cidadesOptions: options });
				this.setState({ disabled: false });
			}

		}

		let options = [];
		if (this.props.paises) {
			this.props.paises.forEach(pais => {
				options.push({ text: pais.nome, key: pais.id, value: pais.id })
			})
			this.setState({ paisesOptions: options });
		}

		if (this.props.estados) {
			options = [];
			this.props.estados.forEach(estado => {
				options.push({ text: estado.nome + " (" + estado.uf + ")", key: estado.uf, value: estado.uf });
			})
			this.setState({ estadosOptions: options });
		}

		if (this.props.estados) {
			options = [];
			this.props.estados.forEach(estado => {
				options.push({ text: estado.nome + " (" + estado.uf + ")", key: estado.id, value: estado.id });
			})
			this.setState({ estadosOptions: options });
		}
		if (this.props.estados) {
			options = [];
			this.props.estados.forEach(estado => {
				options.push({ text: estado.nome + " (" + estado.uf + ")", key: estado.id, value: estado.id });
			})
			this.setState({ estadosOptions: options });

		}

		this.setState({ loading: false });
	}

	async autoCompletePessoaJuridica(event) {
		let result = this.props.pessoasJuridicas.filter(item => {
			return item.nome.toLowerCase().match(event.query.toLowerCase());
		})
		this.setState({ autoCompletePessoaJuridicas: result });
	}

	async handleSelect(value, context) {
		let responseEstado = await api.get('/localizacao/estado/' + value);
		let response = await api.get('/localizacao/cidade/estado/' + responseEstado.data.uf + '?size=1000');
		if (response.data.content) {
			let options = [];
			response.data.content.forEach(cidade => {
				options.push({ text: cidade.nome, key: cidade.id, value: cidade.id })
			})
			context.setState({ cidadesOptions: options });
			context.setState({ disabled: false });
		}
	}


	render() {

		const { id, localizacaoFisica, loading } = this.state;
		const { sucesso } = this.props;

		if (sucesso) {
			return <Redirect to={{
				pathname: '/gerencia/predial/localizacao-fisicas',
				state: {
					sucesses: this.props.sucessoInsert,
					pessoaJuridica: this.state.pessoaJuridica ? this.state.pessoaJuridica : ''
				}
			}}
			/>
		}

		return (
			<div>
				<Header as="h1">
					<Header.Content>
						{text('localizacao-fisica.titulo-form')}
					</Header.Content>
					<Header.Subheader>
						<Breadcrumb>
							<Breadcrumb.Section
								link
								as={Link}
								to={{
									pathname: '/gerencia/predial/localizacao-fisicas/',
								}}>
								{text("localizacao-fisica.pessoa-juridica")}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								link
								as={Link}
								to={{
									pathname: '/gerencia/predial/localizacao-fisicas/',
									pessoaJuridica: this.state.pessoaJuridica
								}}>
								{localizacaoFisica ? (html("localizacao-fisica.exibindo-de", { pj: localizacaoFisica.pessoaJuridica.nome })) : (text('localizacao-fisica.titulo'))}
							</Breadcrumb.Section>
							<Breadcrumb.Divider icon='right chevron' />
							<Breadcrumb.Section
								active
							>
								{loading ? "..." : localizacaoFisica ? localizacaoFisica.nome : text('geral.novo')}
							</Breadcrumb.Section>
						</Breadcrumb>
					</Header.Subheader>
				</Header>

				{this.props.erroInsert &&
					<Message negative>
						{this.props.erroInsert }
					</Message>
				}

				{this.props.sucessoInsert &&
					<Message positive>
						<p>{this.props.sucessoInsert}</p>
					</Message>
				}

				<Formik

					initialValues={{
						id: localizacaoFisica && localizacaoFisica.id ? localizacaoFisica.id : undefined,
						nome: localizacaoFisica ? localizacaoFisica.nome : '',

						pessoaJuridica: this.state.pessoaJuridica,

						pais: localizacaoFisica && localizacaoFisica.endereco &&
							localizacaoFisica.endereco.cidade && localizacaoFisica.endereco.cidade.estado &&
							localizacaoFisica.endereco.cidade.estado.pais ? localizacaoFisica.endereco.cidade.estado.pais.id : '',
						idPais: localizacaoFisica && localizacaoFisica.endereco &&
							localizacaoFisica.endereco.cidade && localizacaoFisica.endereco.cidade.estado &&
							localizacaoFisica.endereco.cidade.estado.pais ? localizacaoFisica.endereco.cidade.estado.pais.id : '',

						estado: localizacaoFisica && localizacaoFisica.endereco && localizacaoFisica.endereco.cidade &&
							localizacaoFisica.endereco.cidade.estado ? localizacaoFisica.endereco.cidade.estado.id : '',
						idEstado: localizacaoFisica && localizacaoFisica.endereco && localizacaoFisica.endereco.cidade &&
							localizacaoFisica.endereco.cidade.estado ? localizacaoFisica.endereco.cidade.estado.id : '',

						cidade: localizacaoFisica && localizacaoFisica.endereco && localizacaoFisica.endereco.cidade ?
							localizacaoFisica.endereco.cidade.id : '',
						idCidade: localizacaoFisica && localizacaoFisica.endereco && localizacaoFisica.endereco.cidade ?
							localizacaoFisica.endereco.cidade.id : '',

						endereco: localizacaoFisica && localizacaoFisica.endereco ? localizacaoFisica.endereco.id : '',
						idEndereco: localizacaoFisica && localizacaoFisica.endereco ? localizacaoFisica.endereco.id : '',


						cep: localizacaoFisica && localizacaoFisica.endereco ? localizacaoFisica.endereco.cep : '',
						logradouro: localizacaoFisica && localizacaoFisica.endereco ? localizacaoFisica.endereco.logradouro : '',
						bairro: localizacaoFisica && localizacaoFisica.endereco ? localizacaoFisica.endereco.bairro : '',

					}}
					enableReinitialize={true}
					onSubmit={async (values) => {
						this.setState({ error: null, submitting: true, sucesses: null });

						let localizacaoFisica = Object.assign({}, values);

						try {

							if (localizacaoFisica.pessoaJuridica) {
								localizacaoFisica.idPessoaJuridica = localizacaoFisica.pessoaJuridica.id;
							}
							if (localizacaoFisica.pais) {
								localizacaoFisica.idPais = localizacaoFisica.pais;
							}
							if (localizacaoFisica.estado) {
								localizacaoFisica.idEstado = localizacaoFisica.estado;
							}
							if (localizacaoFisica.cidade) {
								localizacaoFisica.idCidade = localizacaoFisica.cidade;
							}

							if (id) {
								this.props.editLocalizacaoFisica(localizacaoFisica);
							} else {
								this.props.addLocalizacaoFisica(localizacaoFisica);
							}
						} catch (reason) {

						}

					}}
					render={({
						errors,
						values,
						handleChange,
						handleBlur,
						handleSubmit,
						setFieldValue,
					}) => (
							<Form
								onSubmit={handleSubmit}
								loading={loading}
							>

								<Form.Group widths='equal'>

									<div className="field required">
										<label>{text("localizacao-fisica.nome")}</label>
										<InputText
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.nome}
											name="nome"
											maxLength="255"
										/>
									</div>
								</Form.Group>

								<h4>{text("pessoa.endereco-info")}</h4>

								<Form.Group widths='equal'>
									<div className="field required">
										<label>{text("pessoa.pais")}</label>
										<Dropdown
											options={this.state.paisesOptions}
											selection
											search
											onChange={(e, { value }) => setFieldValue("pais", value)}
											value={values.pais}
											name="pais"
										/>

									</div>

									<div className="field required">
										<label>{text("pessoa.estado")}</label>
										<Dropdown
											clearable
											search
											options={this.state.estadosOptions}
											value={values.estado}
											selection
											onChange={(e, { value }) => { setFieldValue("estado", value); this.handleSelect(value, this) }}
											name="estado"
										/>
									</div>

									<div className="field required">
										<label>{text("pessoa.cidade")}</label>
										<Dropdown
											clearable
											search
											options={this.state.cidadesOptions}
											value={values.cidade}
											selection
											name="cidade"
											disabled={this.state.disabled}
											onChange={(e, { value }) => setFieldValue("cidade", value)}
										/>
									</div>

								</Form.Group>
								<Form.Group widths='equal'>
									<div className="field required">
										<label>{text("pessoa.cep")}</label>
										<InputMask
											mask="99.999-999"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.cep}
											name="cep"
										/>
									</div>

									<div className="field required">
										<label>{text("pessoa.logradouro")}</label>
										<InputText
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.logradouro}
											name="logradouro"
										/>
										<small>{text("pessoa.logradouro-descricao")}</small>
									</div>

									<div className="field required">
										<label>{text("pessoa.bairro")}</label>
										<InputText
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.bairro}
											name="bairro"
										/>
									</div>
								</Form.Group>

								<br />
								<Divider />

								<Button
									floated='left'
									icon labelPosition='left'
									size='large'
									as={Link}
									to={{
										pathname: '/gerencia/predial/localizacao-fisicas/',
										pessoaJuridica: values.pessoaJuridica
									}}
									disabled={this.props.inserindo}
									onClick={this.clickCancel}
								>
									<Icon name='cancel' /> {text("formularios.cancelar")}
								</Button>

								<Button
									primary
									loading={this.props.inserindo}
									type='submit'
									floated='right'
									icon labelPosition='right'
									size="huge"
									disabled={this.props.inserindo}
								>
									<Icon name='save' /> {localizacaoFisica ? text("formularios.atualizar") : text("formularios.salvar")}
								</Button>

							</Form>
						)}
				/>
			</div>
		);
	}

}

const mapStateToProps = state => {
	return {
		listaLocalizacaoFisicaFiltrada: state.localizacaoFisicaReducer.listaLocalizacaoFisicaFiltrada,
		erroInsert: state.localizacaoFisicaReducer.erro,
		sucessoInsert: state.localizacaoFisicaReducer.sucesso,
		inserindo: state.localizacaoFisicaReducer.executando,

		pessoasJuridicas: state.localizacaoFisicaReducer.pessoasJuridicas,
		pessoaJuridica: state.localizacaoFisicaReducer.pessoaJuridica,

		paises: state.enderecoReducer.listaPaises,
		estados: state.enderecoReducer.listaEstados,
		estado: state.enderecoReducer.estado,

		sucesso: state.localizacaoFisicaReducer.sucesso,
		erro: state.localizacaoFisicaReducer.erro,
		executando: state.localizacaoFisicaReducer.executando,

	}
}

const mapDispatchToProps = dispatch => {
	return {
		addLocalizacaoFisica: (localizacaoFisica) => dispatch(addLocalizacaoFisica(localizacaoFisica)),
		editLocalizacaoFisica: (localizacaoFisica) => dispatch(editLocalizacaoFisica(localizacaoFisica)),
		filterPessoaJuridica: (busca) => dispatch(filterPessoaJuridica(busca)),
		resetStates: () => dispatch({ type: RESET_LOCALIZACAO_FISICA }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalizacaoFisicaForm);