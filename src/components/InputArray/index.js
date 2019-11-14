
import React, { Component } from 'react';
import {Button} from 'primereact/button';
import MaskedInput from 'react-text-mask';

export default class InputArray extends Component {
     

    createField = () => {
        this.props.onAdd();
    }

    removeField = index => () => {
        this.props.onRemove(index);
    }
    
    handleValueChange = idx => evt => { 
        this.props.onChange(idx,evt.target.value);
    }
    
    render() {
        const {             
            mask, 
            type,
            tooltipBtAdd, 
            placeholder, 
            tooltipBtDelete, 
            label,
            values} = this.props;

        return (
            <>          
                <div className="field">
                    <label>{label}</label>

                    { values.map((val, index) => (
                            <> 

                            {mask  &&
                                <MaskedInput
                                    mask={mask}
                                    value={val.name}
                                    guide={true}
                                    showMask={true}
                                    onChange={this.handleValueChange(index)}
                                    style={{ width : "94%"}}
                                />  
                            }   

                            {!mask &&                      
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={val.name}
                                    onChange={this.handleValueChange(index)}
                                    style={{ width : "94%"}}
                                />
                            }
                            &nbsp;&nbsp;

                            { index === 0 &&
                                <Button
                                    label="+"
                                    tooltip={tooltipBtAdd}
                                    onClick={this.createField}
                                    type="button"
                                />
                            }

                            { index > 0 &&
                                <Button
                                    label="-"
                                    style={{backgroundColor : "#777777" }}
                                    tooltip={tooltipBtDelete}
                                    onClick={this.removeField(index)}
                                    type="button"
                                />
                            }
                            <br />
                            <br />
                            </>
                        ))
                    }
                </div>
                
            </>
        )
    }
}