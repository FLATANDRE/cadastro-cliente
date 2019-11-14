import React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import {ListBox} from 'primereact/listbox';

//Primereact css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function AssociacaoContratoSelectPanel(
    {        
        itemNaoAssociadoAux,
        itensNaoAssociadosOptions,
        itemAssociadoAux,
        itensAssociadosOptions,
        setItemAssociado,
        setItemNaoAssociado,
        addSelectedItemNaoAssociado,
        addAllItemNaoAssociado,
        removeSelectedItemAssociado,
        removeAllItemAssociado,
        quantidadePlanejada,
        fieldToShow,
        disableInsertNew,
        labelNaoAssociado,
        labelAssociado
    }
) 
{

    return (
        <>
            <Form.Group widths='equal'>
                <div className="field">
                    <label>{labelNaoAssociado}</label>  
                    <ListBox 
                        filter={true} 
                        multiple={false} 
                        optionLabel={fieldToShow} 
                        value={itemNaoAssociadoAux}
                        options={itensNaoAssociadosOptions} 
                        onChange={(e) => setItemNaoAssociado(e.value)} 
                        style={{width: '100%'}} 
                        listStyle={{minHeight : '450px' ,  maxHeight: '450px'}}/>
                </div>

                <div className="field controls-list">                                                    
                    <Button
                        primary                             
                        size='medium'
                        onClick={addSelectedItemNaoAssociado}
                        className='button-add'
                    >
                        <Icon name='angle right' />                
                    </Button>

                    <br/>
                    <br/>
                    <Button
                        primary                              
                        size='medium'
                        onClick={addAllItemNaoAssociado}                                
                        className='button-add'
                    >                                
                        <Icon name='angle double right' /> 
                    </Button>

                    <br/>
                    <br/>
                    <Button
                        primary                            
                        size='medium'
                        onClick={removeSelectedItemAssociado}                                
                        className='button-add'
                    >
                        <Icon name='angle left' />                
                    </Button>

                    <br/>
                    <br/>
                    <Button
                        primary
                        animated='fade'                                
                        size='medium'
                        onClick={removeAllItemAssociado}                                
                        className='button-add'
                    >                                                                
                        <Icon name='angle double left' />    
                    </Button>
                </div>

                <div className="field">
                    <label>{labelAssociado}</label> 
                    <ListBox 
                        filter={true} 
                        multiple={false} 
                        optionLabel={fieldToShow} 
                        value={itemAssociadoAux}
                        options={itensAssociadosOptions} 
                        onChange={(e) => setItemAssociado(e.value)} 
                        style={{width: '100%'}} 
                        listStyle={{minHeight : '450px' , maxHeight: '450px'}}/>
                    <label 
                        style={disableInsertNew ? {color : '#FF0000'} : {color : '#000000'}}
                    >
                        { itensAssociadosOptions.length + " de " + quantidadePlanejada + " " + labelAssociado.toLowerCase() }
                    </label> 
                </div>
            </Form.Group>               
        </>
    );


}
export default AssociacaoContratoSelectPanel;
