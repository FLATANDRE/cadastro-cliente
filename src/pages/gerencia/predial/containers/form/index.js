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

import { RESET_CONTAINERS } from '../../../../../store/actions';

import { addContainer, editContainer } from '../../../../../store/actionCreators/containersAction';

class ContainersForm extends Component {

	state = {
		container: null,
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

		if (this.props.location && this.props.location.localizacao && this.props.location.pessoaJuridica && this.props.location.compartimento) {
			this.setState({ localizacao: this.props.location.localizacao, pessoaJuridica: this.props.location.pessoaJuridica, compartimento: this.props.location.compartimento });
		}

		if (this.props.match.params.id) {
			const { id } = this.props.match.params;
			const response = await api.get("/predial/container/" + id);
			this.setState({ container: response.data })
		}

		const responseTipos = await api.get("/predial/containers/tipos?size=999");
		const tiposOptions = responseTipos.data.content.map((item) => ({
			text: item.nome,
			value: item.id,
			key: item.id
		}))

		this.setState({ loading: false, listaTipos: tiposOptions });
	}

	render() {

		const { id, compartimento, loading, listaTipos, localizacao, pessoaJuridica, container } = this.state;
		const { sucesso } = this.props;

		if (sucesso) {
			return <Redirect to={{
				pathname: '/gerencia/predial/containers',
				state: {
					sucesses: this.props.sucessoInsert,
					pessoaJuridica: pessoaJuridica,
					localizacao: localizacao,
					compartimento: compartimento
				}
			}}
			/>
		}

		return (
			<div>
				<Header as="h1">
					<Header.Content>
						{text('containers.titulo-form')}
					</Header.Content>
					<Header.Subheader>
						<Breadcrumb>
							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/containers/',
								}}
							>
								{text("localizacao-fisica.pessoa-juridica")}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/containers/',
									pessoaJuridica: pessoaJuridica,
									localizacao: null,
									compartimento: null
								}}
							>
								{pessoaJuridica ? (html("localizacao-fisica.exibindo-de", { pj: pessoaJuridica.nome })) : (text('localizacao-fisica.titulo'))}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/containers/',
									pessoaJuridica: pessoaJuridica,
									localizacao: localizacao,
									compartimento: null
								}}
							>
								{localizacao ? (html("compartimentos.exibindo-de", { l: localizacao.nome })) : (text('compartimentos.titulo'))}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								as={Link}
								to={{
									pathname: '/gerencia/predial/containers/',
									pessoaJuridica: pessoaJuridica,
									localizacao: localizacao,
									compartimento: compartimento
								}}
							>
								{compartimento ? (html("containers.exibindo-de", { c: compartimento.nome })) : (text('containers.titulo'))}
							</Breadcrumb.Section>

							<Breadcrumb.Divider icon='right chevron' />

							<Breadcrumb.Section
								active
							>
								{loading ? "..." : container ? container.nome : text('geral.novo')}
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
						containerNome: container ? container.nome : '',
						tipo: container ? container.tipoContainer.id : null,
						descricao: container ? container.descricao : null
					}}
					enableReinitialize={true}
					onSubmit={async (values) => {
						this.setState({ error: null, submitting: true, sucesses: null });

						if (id) {
							this.props.editContainer({
								nome: values.containerNome,
								tipo: values.tipo,
								descricao: values.descricao,
								compartimento: container.compartimento.id
							}, id)
						} else {
							this.props.addContainer({
								nome: values.containerNome,
								tipo: values.tipo,
								descricao: values.descricao,
								compartimento: compartimento ? compartimento.id : null
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
										<label>{text("containers.nome")}</label>
										<InputText
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.containerNome}
											name="containerNome"
											maxLength="255"
										/>
									</div>
								</Form.Group>

								<Form.Group widths='equal'>
									<div className="field required">
										<label>{text("containers.tipo")}</label>
										<Dropdown
											value={values.tipo}
											name="tipo"
											search
											selection
											options={listaTipos}
											onChange={(e, { value }) => {
												setFieldValue("tipo", value)
											}}
											placeholder={text("containers.tipo-placeholder")}
											noResultsMessage={text("geral.nenhum-resultado-encontrado")}
										/>
									</div>
								</Form.Group>

								<Form.Group widths='equal'>
									<div className="field">
										<label>{text("containers.descricao")}</label>
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
										pathname: '/gerencia/predial/containers/',
										pessoaJuridica: pessoaJuridica,
										localizacao: localizacao,
										compartimento: compartimento
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
									<Icon name='save' /> {container ? text("formularios.atualizar") : text("formularios.salvar")}
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
		erroInsert: state.containersReducer.erro,
		sucessoInsert: state.containersReducer.sucesso,
		inserindo: state.containersReducer.executando,

		sucesso: state.containersReducer.sucesso,
		erro: state.containersReducer.erro,
		executando: state.containersReducer.executando,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addContainer: (container) => dispatch(addContainer(container)),
		editContainer: (container, id) => dispatch(editContainer(container, id)),
		resetStates: () => dispatch({ type: RESET_CONTAINERS }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ContainersForm);