import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { text } from '../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Link } from 'react-router-dom';

function MainActionsForm({
                    cancelTo,
                    cancelOnClick,
                    insertOnClick,
                    isInserindo,
                    objectToCheck,
                    disableInsertNew
    }) {
   
    return (
        <>
            {cancelTo &&
                <Button
                    floated='left'
                    icon
                    labelPosition='left'
                    size='large'
                    as={Link}
                    to={cancelTo}
                    disabled={isInserindo}
                >
                    <Icon name='cancel' /> {text("formularios.cancelar")}
                </Button>
            }

            {cancelOnClick && 
                <Button
                    floated='left'
                    icon
                    labelPosition='left'
                    size='large'
                    onClick={cancelOnClick}
                    disabled={isInserindo}
                >
                    <Icon name='cancel' /> {text("formularios.cancelar")}
                </Button>
            }

            {!insertOnClick &&
                <Button
                    primary
                    loading={isInserindo}
                    type='submit'
                    floated='right'
                    icon labelPosition='right'
                    size="huge"                    
                    disabled={isInserindo || disableInsertNew}
                >
                    <Icon name='save' /> {objectToCheck ? text("formularios.atualizar") : text("formularios.salvar")}
                </Button>
            }

            {insertOnClick &&
                <Button
                    primary
                    type='button'
                    floated='right'
                    icon labelPosition='right'
                    size="huge"
                    onClick={insertOnClick}                    
                    disabled={isInserindo || disableInsertNew}
                >
                    <Icon name='save' /> {text("formularios.salvar")}
                </Button>
            }

        </>
    )
}

export default MainActionsForm;