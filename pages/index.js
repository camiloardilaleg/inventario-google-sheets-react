import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';

import {inventario} from '../data/inventario'

import { AddTable } from '../components/AddTable';

export default class Home extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      searchItems: [],
      selectedItems: [],
      inputSearch: '',
      producto: '',
      precio: 0,
      cantidad: 0,
      codigo: 0
    }
    this.inventario = inventario;
    // vinculacion funciones con la clase
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.filterItem = this.filterItem.bind(this);
  }

  // filtrado de productos dependiendo del texto que recibe
  filterItem(texto, attr = "name"){
    if (attr == "name"){
      let splitWord = texto.split(' ');
      let words = '.*'
      for (let i = 0; i < splitWord.length; i++) {
        words += String(splitWord[i].toLowerCase()+'.*');
      }
      let reg = new RegExp(String(`${texto.toLowerCase()}|${words}`), "g");
      let f = this.inventario.filter((item)=>(
        // aplica el regex a los nombres de productos
        item[attr].toLowerCase().match(reg)
        ))
      // devuelve los primeros cuatro elementos del array
      return f.slice(0, 6)
    } else {
      let f = this.inventario.filter((item)=>(
        item[attr] == texto
      ))
      return f
    }
  }

  // cambiar estado cuando se modifica las etiquetas `input`
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    /*si es la etiqueta de `inputSearch` la que se modifica. se realiza el filtrado de los productos
    si los productos resultantes mayor que cero, entonces actualiza todo, y las variables de producto, precio y cantidad
    se llenara con los valor del primer producto devuelto del array. 
    Si no hay resultados, solo se actualiza inputSeach y los productos filtrados (vacio)*/
    if (name == 'inputSearch') {
      const fil_items = this.filterItem(event.target.value);
      
      if (fil_items.length > 0) {
        this.setState({
          inputSearch: event.target.value,
          searchItems: fil_items,
          producto: fil_items[0].name,
          precio: fil_items[0].precio,
          cantidad: fil_items[0].cantidad,
          codigo: fil_items[0].codigo
        })
      } else {
        this.setState({
          inputSearch: event.target.value,
          searchItems: fil_items
        })
      }
    } else if (name == 'lista') {
      // cuando se seleccione un elemento de la lista desplegada de los elemtnos filtrados, se hace una busqueda con el
      // valor EXACTO del producto (por tanto, se devolvera un solo producto)
      const fil_items = this.filterItem(event.target.value);
      this.setState({
        inputSearch: event.target.value,
        searchItems: fil_items,
        producto: fil_items[0].name,
        precio: fil_items[0].precio,
        cantidad: fil_items[0].cantidad,
        codigo: fil_items[0].codigo
      })
    } else if (name == 'selecList') {
      let nameEditProd = event.target.value;
      let objEditProd = this.state.selectedItems.filter((item)=> item.producto == nameEditProd)[0];
      console.log(objEditProd);
      this.setState({
        codigo: objEditProd.codigo,
        producto: objEditProd.producto,
        cantidad: objEditProd.cantidad,
        precio: objEditProd.precio,
        selectedItems: this.state.selectedItems.filter((item)=>item.producto != nameEditProd)
      })
    } else {
      this.setState({
        [name]: event.target.value
      })
    }
  }

  handleAdd(event){
    // console.log(`asi inicia los productos seleccionados ${this.state.selectedItems}`)
    if (this.state.producto != '' && this.state.precio != 0 && this.state.cantidad != 0){
      // comprobamos codigo
      let v_codigo;
      if (this.filterItem(this.state.codigo, 'codigo')[0]['name']!==this.state.producto){
        v_codigo = 0;
      } else {
        v_codigo = this.state.codigo;
      }

      // formamos el objeto que vamos a agregar
      const data = {
        codigo: v_codigo,
        producto: this.state.producto,
        precio: this.state.precio,
        cantidad: this.state.cantidad,
        "created at": new Date()
      }

      //miramos si ya existe en el array de seleccionados
      let checkIfRepeated = this.state.selectedItems.filter((item) => (
        item.producto == this.state.producto
      ))
      
      if (checkIfRepeated.length == 0) {
        this.setState({
          searchItems: [],
          selectedItems: this.state.selectedItems ? [...this.state.selectedItems, data] : [data],
          inputSearch: '',
          producto: '',
          precio: 0,
          cantidad: 0,
          codigo: 0
        })
      } else {
        alert('Producto ya ha sido seleccionado')
      }
      
    } else {
      alert('Valores en blanco detectados');
    }   
    event.preventDefault();
  }

  handleSubmit(event) {
    
    if (this.state.selectedItems.length > 0){
      
      fetch("https://sheet.best/api/sheets/24c38baf-e24d-42e6-acf4-97d73a5944ae",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(this.state.selectedItems),
      })
        .then((r) => r.json())
        .then((data)=>{
          console.log(data);
        })
        .catch((error)=>{
          console.log(error);
        });
  
      this.setState({
        searchItems: [],
        selectedItems: [],
        inputSearch: '',
        producto: '',
        precio: 0,
        cantidad: 0,
        codigo: 0
      })
    } else {
      alert('Valores en blanco detectados');
    }

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Head>
          <title>Creditodo inventario</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1>
            Inventario Creditodo 2021
          </h1>
          <form onSubmit={this.handleSubmit}>
            <label>
            Buscar: 
              <input type="text" 
                value={this.state.inputSearch} 
                onChange={this.handleChange} 
                name="inputSearch"
                placeholder="Busca tu producto aquí"/>
            </label>
            <div> 
              {/* Aqui se desplegan los item devueltos de la busqueda */}
              {this.state.searchItems.map( (item) => (
                <div key={item.codigo}>
                  <input type="radio"  name="lista" value={item.name} onChange={this.handleChange} /> {item.name}
                </div>
                )
              )}
            </div>

            <label>Producto:</label>
            <input type="text" value={this.state.producto} onChange={this.handleChange} name="producto" /><br />
            <label>Precio:</label>
            <input type="text" value={this.state.precio} onChange={this.handleChange} name="precio"/><br />
            <label>Cantidad:</label>
            <input type="text" value={this.state.cantidad} onChange={this.handleChange} name="cantidad" /><br />
            <button onClick={this.handleAdd}>Añadir</button>
            
            {/* renderiza objetos seleccionados */}
            {this.state.selectedItems &&  <AddTable products={this.state.selectedItems} 
              onTableHandleChange={this.handleChange}/>}
            
            <input type="submit" value="Enviar" />
          </form>
        </main>  
      </div>
    )  
  }
}
