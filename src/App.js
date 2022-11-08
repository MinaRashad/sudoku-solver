import React from 'react';
import { ReactDOM } from 'react';
import './App.css';

class Sudoku extends React.Component{
  render(){
    return (
    <div className='center'>
        <div className='board'>
        <Board />
        </div>
        <div>
          <button> Solve </button>
        </div>

    </div>
  );
  }
}

class Board extends React.Component{
  // it will have 9 3x3 section
  render(){
    //ReactDOM.render('div',)
    return (<div>
        <div className="section-row">
          <Section value="1" />
          <Section value="2" />
          <Section value="3" />
        </div>
        <div className="section-row">
          <Section value="4" />
          <Section value="5" />
          <Section value="6" />
        </div>
        <div className="section-row">
          <Section value="7" />
          <Section value="8" />
          <Section value="9"/>
        </div>
    </div>);
  }
}

class Section extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      values:Array(9).fill('')
    }
  }

  editBox(i,value){
      let values = this.state.values.slice()
      values[i] = value
      this.setState({values:values})
  }
  renderBox(i){
    
    return (<input type="text" className='box' maxLength="1" value={this.state.values[i]}
              onBeforeInput={()=>{this.editBox(i,'')}} onInput={(e)=>{this.editBox(i,e.target.value)}}></input>)
  }
  render() {
    
    return (
      <div className='section'>
        <div className="box-row">
          {this.renderBox(1)}
          {this.renderBox(2)}
          {this.renderBox(3)}
        </div>
        <div className="box-row">
          {this.renderBox(4)}
          {this.renderBox(5)}
          {this.renderBox(6)}
        </div>
        <div className="box-row">
          {this.renderBox(7)}
          {this.renderBox(8)}
          {this.renderBox(9)}
        </div>
      </div>
    );
  }
}




export default Sudoku;
