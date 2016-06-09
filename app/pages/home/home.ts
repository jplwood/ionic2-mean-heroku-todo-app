import {Component} from "@angular/core";
import {NavController, NavParams, ItemSliding, Item} from 'ionic-angular';
import {TodoEditPage} from '../todo-edit/todo-edit';
import {TodoService} from '../../providers/todo-service/todo-service';
import {Todo} from '../../todo.ts';

@Component({
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
    this.todoService.load()
      .subscribe(data => {
        this.todos = data;
      })
  }

  addTodo(todo:string) {
    this.todoService.add(todo)
        .subscribe(data  => {
          this.todos.push(data)
        });
  }

  toggleComplete(todo: Todo) {
    todo.isComplete = !todo.isComplete;
    this.todoService.update(todo)
        .subscribe();
  }

  navToEdit(todo: Todo, index: number, slidingItem: ItemSliding) {
    slidingItem.close()
    this.nav.push(TodoEditPage, {
      todo: todo,
      todos: this.todos,
      index: index
    });
  }

  deleteTodo(todo: Todo, index:number) {
    this.todoService.delete(todo)
        .subscribe(response => {
          this.todos.splice(index, 1);
        });
  }
}
