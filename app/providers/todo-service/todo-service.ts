import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Todo} from '../../todo.ts';



/*
  Generated class for the TodoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TodoService {
  data: any = null;
  todosUrl = "/api/todos"

  constructor(public http: Http) {}

  getAll(): Promise<Todo[]> {

    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(this.todosUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  add(todo:string): Promise<Todo> {
    let body = JSON.stringify({description: todo});
    let headers = new Headers({'Content-Type': 'application/json'});
    console.log("About to send request to add todo: " + todo + " or in JSON format: " + JSON.stringify({description: todo}) +" with the headers: " + headers);

    return new Promise(resolve => {
      console.log("sending http post now...");
      this.http.post(this.todosUrl, body, {headers: headers})
           .map(res => res.json())
           .subscribe(data => {
             this.data = data;
             resolve(this.data);
           });
    });
  }

  getById(id) {
      return new Promise(resolve => {
        this.http.get(this.todosUrl + id)
            .map(res => res.json())
            .subscribe(data => {
              this.data = data;
              resolve(this.data);
            })
      })
  }

  update(todo) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("About to update:" + JSON.stringify(todo))
    let url = `${this.todosUrl}/${todo._id}`;

    return this.http.put(url, JSON.stringify(todo), {headers: headers})
                    .toPromise()
                    .then(() => todo) //See mdn.io/arrowfunctions
                    .catch(this.handleError);
  }

  delete(todo) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.todosUrl}/${todo._id}`;
    console.log("Sending HTTP request to delete todo at: " + url);

    return this.http.delete(url, headers)
               .toPromise()
               .catch(this.handleError);

  }

  handleError(error) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
  }

}
