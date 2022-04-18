import React from 'react';
import './App.css';
// jquery
import $ from 'jquery';
import Todo from './todo'


const api_key = "25dec5-21ed1d-cffca7-caef44-d6c013"

const TodoInput = React.forwardRef((prop,input)=>{
  return  <div id="add">
            <form id="add_form" onSubmit={prop.add}>
                <div>
                    <input ref={input} type="text" id="text_area" required />
                </div>
                <div> 
                    <button class="user_action_button" id="add_button" type="submit">Add Todo</button>
                </div>
            </form>
          </div>
})

class TodoList extends React.Component {

  render() {
    return (
      <>
      <div id="top_bar">
        <div id="this_is_text" onClick={this.what}>Text</div>
        <div id="this_is_createdTime">| Created Time</div>
        <div id="this_is_updatedTime">| Updated Time</div>
        <div id="delete_check">| Actions</div>
      </div>
      <hr />
      <div id="todo_list">
        {this.props.incomplete.map((todo) =>
            <Todo key={todo["id"]} 
                  todo={todo} 
                  completedOrNot={false} 
                  deleteTodo={this.props.deleteTodo}
                  checkTodo = {this.props.checkTodo}
                  uncheckTodo = {this.props.uncheckTodo}          
            />
        )} 
        {this.props.complete.map((todo) =>
            <Todo key={todo["id"]} 
                  todo={todo} 
                  completedOrNot={true} 
                  deleteTodo={this.props.deleteTodo}
                  checkTodo = {this.props.checkTodo}
                  uncheckTodo = {this.props.uncheckTodo}          
            />
        )} 
      </div>
      </>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      complete:[],
      incomplete:[]
    }
    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.checkTodo = this.checkTodo.bind(this)
    this.uncheckTodo = this.uncheckTodo.bind(this)
    this.input = React.createRef()
  }

  deleteTodo(todo_id){
    let tempComplete = this.state.complete
    let tempIncomplete = this.state.incomplete

    tempComplete = tempComplete.filter(item => item["id"] !== todo_id)
    tempIncomplete = tempIncomplete.filter(item => item["id"] !== todo_id)

    this.setState(
      {complete:tempComplete, incomplete:tempIncomplete}
    )
  }

  checkTodo(todo_id){
    let tempComplete = this.state.complete
    let tempIncomplete = this.state.incomplete

    let i = 0;
    while (i < tempIncomplete.length) {
      if (tempIncomplete[i]["id"] === todo_id) {
        tempComplete.push(tempIncomplete[i])
        tempIncomplete.splice(i, 1);
      } else {
        ++i;
      }
    }

    this.setState(
      {complete:tempComplete, incomplete:tempIncomplete}
    )
  }

  uncheckTodo(todo_id){
    let tempComplete = this.state.complete
    let tempIncomplete = this.state.incomplete

    let i = 0;
    while (i < tempComplete.length) {
      if (tempComplete[i]["id"] === todo_id) {
        tempIncomplete.push(tempComplete[i])
        tempComplete.splice(i, 1);
      } else {
        ++i;
      }
    }

    this.setState(
      {complete:tempComplete, incomplete:tempIncomplete}
    )
  }
  
  addTodo(event){
    event.preventDefault();
  
    // the "this" in setState seems to be undefined, but "this" outside setState is clear
    let self = this;

    // get user input by reference
    let text = this.input.current.value
    // Setting variable for form input (get from HTML form)
    let data = {
        text: text
    }

    // Initalize AJAX Request
    let xhttp2 = new XMLHttpRequest();

    // Response handler
    xhttp2.onreadystatechange = function() {

        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            // clear text input placeholder
            $('#text_area').val("");
            self.setState({incomplete:[...self.state.incomplete, JSON.parse(this.responseText)]})

        } else if (this.readyState == 4) {

            // this.status !== 200, error from server
            console.log(this.responseText);
            alert('submit failed, submitting 0 is failure for some reasons from serverside');
        }
    };

    xhttp2.open("POST", "https://cse204.work/todos", true);

    xhttp2.setRequestHeader("Content-type", "application/json");
    xhttp2.setRequestHeader("x-api-key", api_key);
    xhttp2.send(JSON.stringify(data));
  }

  componentDidMount(){
    // the "this" in setState seems to be undefined, but "this" outside setState is clear
    let self = this;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let todos = JSON.parse(this.responseText);

            // split todo into different
            self.state.complete = [];
            self.state.incomplete = [];
            todos.forEach(function(todo){
                if(todo["completed"]){
                  self.setState({complete:[...self.state.complete, todo]})
                }
                else{
                  self.setState({incomplete:[...self.state.incomplete, todo]})
                }
            })

            // sort by created_at time
            let temp = self.state.complete
            temp = temp.sort((a, b) => {
                return !(a["created_at"] - b["created_at"]);
            });
            self.setState({complete:temp})

            temp = self.state.incomplete
            temp = temp.sort((a, b) => {
                return !(a["updated_at"] - b["updated_at"]);
            });
            self.setState({incomplete:temp})
        }
    };
    xhttp.open("GET", "https://cse204.work/todos", true);
    xhttp.setRequestHeader("x-api-key", api_key);
    xhttp.send();
  }

  render() {
    return <div id="main">
            <TodoInput add={this.addTodo} ref={this.input} />
            <TodoList 
              complete={this.state.complete} 
              incomplete={this.state.incomplete}
              deleteTodo={this.deleteTodo}
              checkTodo = {this.checkTodo}
              uncheckTodo = {this.uncheckTodo}            
            />
          </div>
  }
}




export default App;
