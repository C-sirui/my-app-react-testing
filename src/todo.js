import React from 'react';

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.aSingleTodo = this.aSingleTodo.bind(this);
        this.container = this.aSingleTodo();
        this.reference = React.createRef();
    }

    componentDidMount()
    {
        this.reference.current.appendChild(this.container);
    }

    aSingleTodo() {
        let self = this
        // outter div
        let todo_div = document.createElement("div");
        todo_div.setAttribute("id", this.props.todo["id"]);
        todo_div.setAttribute("class", `todo ${this.props.completedOrNot}`);
        
        // metadata div
        let metadata_div = document.createElement("div");
        metadata_div.setAttribute("class", "metadata_div");
        // inner text div
        let todo_text_div = document.createElement("div");
        todo_text_div.setAttribute("class", "todo_text");
        todo_text_div.textContent = this.props.todo["text"];
        metadata_div.appendChild(todo_text_div);
        // inner create_time div
        let todo_createTime_div = document.createElement("div");
        todo_createTime_div.setAttribute("class", "todo_createTime_div");
        todo_createTime_div.textContent = this.props.todo["created_at"];
        metadata_div.appendChild(todo_createTime_div);
        // inner update_time div
        let todo_updateTime_div = document.createElement("div");
        todo_updateTime_div.setAttribute("class", "todo_updateTime_div");
        todo_updateTime_div.textContent = this.props.todo["updated_at"];
        metadata_div.appendChild(todo_updateTime_div);

        // button div
        let button_div = document.createElement("div");
        button_div.setAttribute("class", "button_div");
        // delete button
        let delete_button = document.createElement("button");
        delete_button.setAttribute("class", "user_action_button delete")
        delete_button.textContent = "delete";
        // delete lisener
        delete_button.addEventListener("click", function() {
            // Initalize AJAX Request
            var xhttp2 = new XMLHttpRequest();
            let todoid = self.props.todo["id"];

            // Response handler
            xhttp2.onreadystatechange = function() {
        
                // Wait for readyState = 4 & 200 response
                if (this.readyState == 4 && this.status == 200) {
                    
                    self.props.deleteTodo(todoid)
                } else if (this.readyState == 4) {
        
                    // this.status !== 200, error from server
                    console.log(this.responseText);
                    alert('delete failed');
                }
            };
        
            xhttp2.open("DELETE", "https://cse204.work/todos/" + todoid, true);
        
            xhttp2.setRequestHeader("Content-type", "application/json");
            xhttp2.setRequestHeader("x-api-key", "25dec5-21ed1d-cffca7-caef44-d6c013");
            xhttp2.send();
        })
        button_div.appendChild(delete_button);

        // check button only if incomplete
        if (!this.props.completedOrNot){
            let check_button = document.createElement("button");
            check_button.setAttribute("class", "user_action_button check")
            check_button.textContent = "check";
            // check lisener
            check_button.addEventListener("click", function() {
                // Initalize AJAX Request
                var xhttp2 = new XMLHttpRequest();
                let todoid = self.props.todo["id"];
                let data = {
                    completed: true,
                }
            
                // Response handler
                xhttp2.onreadystatechange = function() {
            
                    // Wait for readyState = 4 & 200 response
                    if (this.readyState == 4 && this.status == 200) {
            
                        self.props.checkTodo(todoid)
                    } else if (this.readyState == 4) {
            
                        // this.status !== 200, error from server
                        console.log(this.responseText);
                        alert('check failed');
                    }
                };
            
                xhttp2.open("PUT", "https://cse204.work/todos/" + todoid, true);
            
                xhttp2.setRequestHeader("Content-type", "application/json");
                xhttp2.setRequestHeader("x-api-key", "25dec5-21ed1d-cffca7-caef44-d6c013");
                xhttp2.send(JSON.stringify(data));
            })
            button_div.appendChild(check_button);
        }
        // For complete items, give uncheck button
        else{
            let check_button = document.createElement("button");
            check_button.setAttribute("class", "user_action_button check")
            check_button.textContent = "uncheck";
            // check lisener
            check_button.addEventListener("click", function() {
                // Initalize AJAX Request
                var xhttp2 = new XMLHttpRequest();
                let todoid = self.props.todo["id"];
                let data = {
                    completed: false,
                }
            
                // Response handler
                xhttp2.onreadystatechange = function() {
            
                    // Wait for readyState = 4 & 200 response
                    if (this.readyState == 4 && this.status == 200) {
                        
                        self.props.uncheckTodo(todoid)
                    } else if (this.readyState == 4) {
            
                        // this.status !== 200, error from server
                        console.log(this.responseText);
                        alert('check failed');
                    }
                };
            
                xhttp2.open("PUT", "https://cse204.work/todos/" + todoid, true);
            
                xhttp2.setRequestHeader("Content-type", "application/json");
                xhttp2.setRequestHeader("x-api-key", "25dec5-21ed1d-cffca7-caef44-d6c013");
                xhttp2.send(JSON.stringify(data));
            })
            button_div.appendChild(check_button);
        }

        // add those two to todo_list
        todo_div.appendChild(metadata_div);
        todo_div.appendChild(button_div);

        return todo_div
    }

    render() {
        return (
            <div ref={this.reference}>
            </div>
        )
    }
   
}


export default Todo