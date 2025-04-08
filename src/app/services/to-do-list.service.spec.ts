import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Todo, ToDoListService } from './to-do-list.service';

describe('ToDoListService', () => {
  let service: ToDoListService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
  ];

  const mockTodo: Todo = { id: 1, title: 'Task 1', completed: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDoListService],
    });

    service = TestBed.inject(ToDoListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTodosForUser', () => {
    it('should retrieve all todos for a specific user', () => {
      const userId = 1;

      service.getTodosForUser(userId).subscribe((todos) => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);
    });
  });

  describe('getTodoById', () => {
    it('should retrieve a specific todo by ID', () => {
      const taskId = 1;

      service.getTodoById(taskId).subscribe((todo) => {
        expect(todo).toEqual(mockTodo);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTodo);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo for the user', () => {
      const newTodo: Todo = { id: 3, title: 'New Task', completed: false };
      const userEmail = 'user@example.com';

      service.createTodo(newTodo, userEmail).subscribe((todo) => {
        expect(todo).toEqual(newTodo);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/user/${userEmail}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTodo);
      req.flush(newTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', () => {
      const updatedTodo: Todo = {
        id: 1,
        title: 'Updated Task',
        completed: true,
      };
      const taskId = 1;

      service.updateTodo(taskId, updatedTodo).subscribe((todo) => {
        expect(todo).toEqual(updatedTodo);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${taskId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTodo);
      req.flush(updatedTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a specific todo', () => {
      const taskId = 1;

      service.deleteTodo(taskId).subscribe({
        next: () => {
          // Aucun résultat attendu ici, donc on ne fait pas de vérification de la réponse
        },
        error: (err) => {
          // Vérifiez si une erreur se produit
          fail('Expected no error, but got: ' + err);
        },
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); // Pas de corps de réponse, juste une confirmation de la requête
    });
  });
});
