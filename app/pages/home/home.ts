import {Page, NavController, NavParams, ItemSliding, Item} from 'ionic-angular';
import {TodoEditPage} from '../todo-edit/todo-edit';
import {TodoService} from '../../providers/todo-service/todo-service';
import {Todo} from '../../todo.ts';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [TodoService]
})
export class HomePage {
  public todos: Todo[];
  selectedTodo: Todo;

  constructor(public todoService: TodoService,
              public nav: NavController,
              public navParams: NavParams ) {
    this.loadTodos();
    this.selectedTodo = navParams.get('todo');
  }

  loadTodos() {
    this.todoService.getAll()
      .then(data => {
        this.todos = data;
      })
  }

  addTodo(todo:string) {
    this.todoService.add(todo)
        .then(data  => {
          this.todos.push(data)
        });
  }

  toggleComplete(todo: Todo, index:number) {
    todo.isComplete = !todo.isComplete;
    this.todoService.update(todo);
  }

  navToEdit(event, todo: Todo, index: number, slidingItem: ItemSliding) {
    slidingItem.close()
    this.nav.push(TodoEditPage, {
      todo: todo,
      todos: this.todos
    });
  }

  deleteTodo(todo: Todo, index:number) {
    this.todoService.delete(todo)
        .then(response => {
          this.todos.splice(index, 1);
        });
  }
}
