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
import { InputTextarea } from 'primereact/inputtextarea';
//Reactprime css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';

import { RESET_COMPARTIMENTOS } from '../../../../../store/actions';

import { addCompartimento, editCompartimento } from '../../../../../store/actionCreators/compartimentosAction';

class CompartimentoForm extends Component {

	state = {
		compartimento: null,
		carregandoForm: false,
		localizacao: null,
		pessoaJuridica: null,
		listaTipos: null,
		disabled: true,
		id: this.props.match.params.id
	};

	async componentDidMount() {
		this.props.resetStates();
		this.setState({ loading: true });

		if (this.props.location && this.props.location.localizacao && this.props.location.pessoaJuridica) {
			this.setState({ localizacao: this.props.location.localizacao, pessoaJuridica: this.props.location.pessoaJuridica });
		}

		if (this.props.match.params.id) {
			const { id } = this.props.match.params;
			const response = await api.get("/predial/compartimento/" + id);
			this.setState({ compartimento: response.data })
		}

		const responseTipos = await api.get("/predial/compartimentos/tipos?size=999");
		const tiposOptions = responseTipos.data.content.map((item) => ({
			text: item.nome,
			value: item.id,
			key: item.id
		}))

		this.setState({ loading: false, listaTipos: tiposOptions });
	}

	render() {

		const { id, compartimento, loading, listaTipos, localizacao, pessoaJuridica } = this.state;
		const { sucesso } = this.props;

		if (sucesso) {
			return <Redirect to={{
				pathname: '/gerencia/predial/compartimentos',
				state: {
					sucesses: this.props.sucessoInsert,
					pessoaJuridica: pessoaJuridica,
					localizacao: localizacao
				}
			}}
			/>
		}

		return (
			<div>

				<Header as="h1">
					<Header.Content>
						{text('compartimentos.titulo-form')}
					</Header.Content>
					<Header.Subheader>
						<Breadcrumb>
							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/compartimentos/',
								}}
							>
								{text("localizacao-fisica.pessoa-juridica")}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/compartimentos/',
									pessoaJuridica: pessoaJuridica,
									localizacao: null
								}}
							>
								{pessoaJuridica ? (html("localizacao-fisica.exibindo-de", { pj: pessoaJuridica.nome })) : (text('localizacao-fisica.titulo'))}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/compartimentos/',
									pessoaJuridica: pessoaJuridica,
									localizacao: localizacao
								}}
							>
								{localizacao ? (html("compartimentos.exibindo-de", { l: localizacao.nome })) : (text('compartimentos.titulo'))}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								active
							>
								{loading ? "..." : compartimento ? compartimento.nome : text('geral.novo')}
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
						compartimentoNome: compartimento ? compartimento.nome : '',
						tipo: compartimento ? compartimento.tipoCompartimento.id : null,
						descricao: compartimento ? compartimento.descricao : null
					}}
					enableReinitialize={true}
					onSubmit={async (values) => {
						this.setState({ error: null, submitting: true, sucesses: null });

						if (id) {
							this.props.editCompartimento({
								nome: values.compartimentoNome,
								tipo: values.tipo,
								descricao: values.descricao,
								localizacaoFisica: compartimento.localizacaoFisica.id
							}, id)
						} else {
							this.props.addCompartimento({
								nome: values.compartimentoNome,
								tipo: values.tipo,
								descricao: values.descricao,
								localizacaoFisica: localizacao ? localizacao.id : null
							})
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
										<label>{text("compartimentos.nome")}</label>
										<InputText
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.compartimentoNome}
											name="compartimentoNome"
											maxLength="255"
										/>
									</div>
								</Form.Group>

								<Form.Group widths='equal'>
									<div className="field required">
										<label>{text("compartimentos.tipo")}</label>
										<Dropdown
											value={values.tipo}
											name="tipo"
											search
											selection
											options={listaTipos}
											onChange={(e, { value }) => {
												setFieldValue("tipo", value)
											}}
											placeholder={text("compartimentos.tipo-placeholder")}
											noResultsMessage={text("geral.nenhum-resultado-encontrado")}
										/>
									</div>
								</Form.Group>

								<Form.Group widths='equal'>
									<div className="field">
										<label>{text("compartimentos.descricao")}</label>
										<InputTextarea
											rows={4}
											onChange={e => {
												handleChange(e)
											}}
											value={values.descricao}
											onBlur={handleBlur}
											name="descricao"
											autoResize={true}
											style={{ width: '100%' }}
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
										pathname: '/gerencia/predial/compartimentos/',
										pessoaJuridica: pessoaJuridica,
										localizacao: localizacao
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
									<Icon name='save' /> {compartimento ? text("formularios.atualizar") : text("formularios.salvar")}
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
		erroInsert: state.compartimentosReducer.erro,
		sucessoInsert: state.compartimentosReducer.sucesso,
		inserindo: state.compartimentosReducer.executando,

		sucesso: state.compartimentosReducer.sucesso,
		erro: state.compartimentosReducer.erro,
		executando: state.compartimentosReducer.executando,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addCompartimento: (compartimento) => dispatch(addCompartimento(compartimento)),
		editCompartimento: (compartimento, id) => dispatch(editCompartimento(compartimento, id)),
		resetStates: () => dispatch({ type: RESET_COMPARTIMENTOS }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CompartimentoForm);