import {Page, NavController, NavParams} from 'ionic-angular';
import {TodoService} from '../../providers/todo-service/todo-service';
import {Todo} from '../../todo.ts';

/*
  Generated class for the TodoEditPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/todo-edit/todo-edit.html',
  providers: [TodoService]
})
export class TodoEditPage {
  public todo: Todo;
  public todos: Todo[];
  public index: number;



  constructor(public todoService: TodoService, public nav: NavController, public navParams: NavParams ) {
    this.todo = navParams.get('todo');
    this.todos = navParams.get('todos');
    this.index = navParams.get('index');
  }

  saveTodo(updatedDescription: string) {
    this.todo.description = updatedDescription;
    this.todoService.update(this.todo)
        .then(response => {
          this.nav.pop(); //go back to todo list
        });
  }

  deleteTodo() {
    this.todoService.delete(this.todo)
      .then(response => {
        this.todos.splice(this.index, 1); // remove the todo
        this.nav.pop(); //go back to todo list
      });

  }
}
