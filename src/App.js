import React from 'react';
import { ReactDOM } from 'react';
import './App.css';
import games from "./games.json"

class Sudoku extends React.Component{
  constructor(props){
    super(props)
    this.state={
      // 9x9 grid
      sections: games['saved_games'][0],//Array(9).fill(0).map(()=> (Array(9).fill(''))),
      focusNum:0
    }
  }
  editBox = (Sectionidx,Boxidx,value)=>{
    
    if(/[1-9]/g.test(value) || value === ''){
        let sections = this.state.sections.slice()
        sections[Sectionidx][Boxidx] = value
        this.setState({sections:sections})
        if(value !== "")  this.setState({focusNum:value})
        else this.setState({focusNum:0})
    }
}

focusBox = (value)=>{
  if(value !== "")  this.setState({focusNum:value})
  else this.setState({focusNum:0})
}


  render(){
    return (
    <div className='center'>
        <div className='board'>
        <Board sections={this.state.sections} 
                editBox={this.editBox} focusBox={this.focusBox}
                focusNum={this.state.focusNum}
                />
        </div>
        <div className='buttons'>
          <button> Solve </button>
          <button 
          onClick={()=>{
                  this.setState(
                    { 
                      sections: Array(9).fill(0).map(()=> (Array(9).fill('')))
                    })
                  }
              }>
           Reset </button>
        </div>

    </div>
  );
  }
}

class Board extends React.Component{
  
  renderSection(i){
    // finding duplicates within section
    let duplicates = [...duplicates_in(this.props.sections[i-1]),
                      ...duplicates_in_row(i,this.props.sections),
                      ...duplicates_in_col(i,this.props.sections)]

    // finding in rows



    return <Section duplicates={duplicates} sectionNum={i} 
                    values={this.props.sections[i-1]}
                    editBox={this.props.editBox}
                    focusBox={this.props.focusBox}
                    focusNum={this.props.focusNum}
                    />
  }
  // it will have 9 3x3 section
  render(){
    //ReactDOM.render('div',)
    return (<div>
        <div className="section-row">
          {this.renderSection(1)}
          {this.renderSection(2)}
          {this.renderSection(3)}
        </div>
        <div className="section-row">
          {this.renderSection(4)}
          {this.renderSection(5)}
          {this.renderSection(6)}
        </div>
        <div className="section-row">
          {this.renderSection(7)}
          {this.renderSection(8)}
          {this.renderSection(9)}
        </div>
    </div>);
  }
}

// a section is the 9x9 block
class Section extends React.Component{

  renderBox(BoxNum){
    let sec_idx = this.props.sectionNum -1
    
    let box_idx = BoxNum-1

    let classes = ""
    // making duplicates red
    if(this.props.duplicates.indexOf(box_idx) !== -1) {classes += "incorrect "}
    if(this.props.values[box_idx] === this.props.focusNum){classes+= "highlight "}

    return (<input type="text" className={'box ' + classes} maxLength="1" 
              value={this.props.values[box_idx]}
              onBeforeInput={()=>{this.props.editBox(sec_idx,box_idx,'')}}
              onInput={(e)=>{this.props.editBox(sec_idx,box_idx,e.target.value)}}
              onFocus={()=>{this.props.focusBox(this.props.values[box_idx])}}
              ></input>)
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

/**
 * @param {int[]} section - Array of numbers of length 9
 * 
 * @return {int[]} duplicates - array of duplicate indexes
*/

function duplicates_in(section){
  let tracker = {}
  let duplicateIndex = []
  for(let i=0; i<9 ; i++){
    if(section[i] !== ''){
      tracker[section[i]] = tracker[section[i]]? tracker[section[i]]+1 : 1

      if(tracker[section[i]] >= 2){
        duplicateIndex.push(i)
        duplicateIndex.push(section.indexOf(section[i]))
      }
      
    }
  }
  return duplicateIndex 
}

/**
 * @param {[int[]]} sections - Array of numbers of length 9
 * @param {int} sectionidx - the nth section (index +1)
 * 
 * @return {int[]} duplicates - array of duplicate indexes
*/
function duplicates_in_row(sectionidx, sections){

  let duplicates = []
  for(let j=0;j<3;j++){
    // j is row
    // We need to have a function that f(x)= 0 for x = 1,2,3, =3 for 4,5,6 and =6 for 7,8,9
    let row_idx = sectionidx<4?0:(sectionidx<7?3:6)
    let row = [...sections[row_idx].slice(j*3, j*3 + 3),
      ...sections[row_idx+1].slice(j*3, j*3 + 3),
      ...sections[row_idx+2].slice(j*3, j*3 + 3)]
    
    let duplicates_in_row = duplicates_in(row);
    // now we have duplicates in row
    let sect_row = sections[sectionidx-1].slice(j*3, j*3 + 3)
    for(let i=0; i<duplicates_in_row.length;i++){
      // j=1, idx = 1

      let idx = sect_row.indexOf(row[duplicates_in_row[i]])
      if(idx !== -1)duplicates.push(idx + j*3)
    }
  }

  return duplicates
}

/**
 * @param {[int[]]} sections - Array of numbers of length 9
 * @param {int} sectionidx - the nth section (index +1)
 * 
 * @return {int[]} duplicates - array of duplicate indexes
 */

function duplicates_in_col(sectionidx, sections){

  let duplicates = []
  for(let j=0;j<3;j++){
    // j is column number
    // We need to have a function that f(x)= 0 for x = 1,4,7; =1 for 2,5,8 and =2 for 3,6,9
    let col_idx = (sectionidx-1)%3
    let col = [...sections[col_idx].reduce((a,b,i)=> {if(i%3 === j){a.push(b)} return a},[]),
      ...sections[col_idx+3].reduce((a,b,i)=> {if(i%3 === j){a.push(b)} return a},[]),
      ...sections[col_idx+6].reduce((a,b,i)=> {if(i%3 === j){a.push(b)} return a},[])]
    
    let duplicates_in_col = duplicates_in(col);
    // now we have duplicates in row
    let sect_col = sections[sectionidx-1].reduce((a,b,i)=> {if(i%3 === j){a.push(b)} return a},[])
    for(let i=0; i<duplicates_in_col.length;i++){
      let idx = sect_col.indexOf(col[duplicates_in_col[i]])
      if(idx !== -1)duplicates.push(idx*3 + j)
    }
  }

  return duplicates
}


export default Sudoku;
