import React from "react";

export class AddTable extends React.Component {
    /* Recibe las siguientes props
    products: list */
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.props.onTableHandleChange(event);
    }

    render() {
        return(
            <div>
                <table>
                    <tr>
                        <th>Codigo</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Editar</th>
                    </tr>
                    {this.props.products.map((item)=>(
                        <tr key={item.codigo}>
                            <td>{item.codigo}</td>
                            <td>{item.producto}</td>
                            <td>{item.precio}</td>
                            <td>{item.cantidad}</td>
                            <td>
                                <input type="radio" 
                                name="selecList"
                                value={item.producto}
                                onChange = {this.handleChange} />
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        )
    }
    
}