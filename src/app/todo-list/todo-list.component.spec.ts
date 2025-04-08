import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { ToDoListService } from '../services/to-do-list.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<ToDoListService>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('ToDoListService', [
      'getTodosForUser',
      'createTodo',
      'deleteTodo',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getStoredUserId',
      'getStoredUserEmail',
      'logOut',
      'getStoredBoolean',
      'getStoredUserName',
    ]);

    authServiceSpy.getStoredUserName.and.returnValue('TestUser');

    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [
        HttpClientTestingModule,
        MatToolbarModule,
        MatSidenavModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        MatListModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
      ],
      providers: [
        { provide: ToDoListService, useValue: todoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy() } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(
      ToDoListService
    ) as jasmine.SpyObj<ToDoListService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router);

    todoService.getTodosForUser.and.returnValue(
      of([{ id: 1, title: 'Test Todo', completed: false }])
    );

    todoService.deleteTodo.and.returnValue(
      throwError(() => new Error('Error'))
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get stored user name from AuthService', () => {
    const userName = authService.getStoredUserName();
    expect(userName).toBe('TestUser');
  });

  it('should load todos on ngOnInit', () => {
    const mockTodos = [{ id: 1, title: 'Test Todo', completed: false }];
    todoService.getTodosForUser.and.returnValue(of(mockTodos));
    authService.getStoredUserId.and.returnValue(1);

    component.ngOnInit();

    expect(component.todos).toEqual(mockTodos);
    expect(todoService.getTodosForUser).toHaveBeenCalledWith(1);
  });

  it('should handle error when getting todos', () => {
    todoService.getTodosForUser.and.returnValue(throwError('Error'));
    authService.getStoredUserId.and.returnValue(1);

    component.ngOnInit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erreur lors du chargement des tâches',
      'Fermer',
      { duration: 3000, panelClass: 'snackbar-error' }
    );
  });

  it('should add a new todo', () => {
    const newTodo = { id: 0, title: 'New Todo', completed: false };
    const createdTodo = { id: 1, title: 'New Todo', completed: false };
    todoService.createTodo.and.returnValue(of(createdTodo));

    component.newTodoTitle = 'New Todo';
    component.addTodo();

    expect(component.todos.length).toBe(1);
    expect(component.todos[0].title).toBe('New Todo');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Tâche ajoutée avec succès',
      'Fermer',
      { duration: 3000, panelClass: 'snackbar-success' }
    );
  });

  it('should not add a new todo if title is empty', () => {
    component.newTodoTitle = '';
    component.addTodo();

    expect(todoService.createTodo).not.toHaveBeenCalled();
  });

  it('should handle error when adding a new todo', () => {
    todoService.createTodo.and.returnValue(throwError('Error'));

    component.newTodoTitle = 'New Todo';
    component.addTodo();

    expect(snackBar.open).toHaveBeenCalledWith(
      "Erreur lors de l'ajout de la tâche",
      'Fermer',
      { duration: 3000, panelClass: 'snackbar-error' }
    );
  });

  it('should delete a todo', () => {
    const todoToDelete = { id: 1, title: 'Test Todo', completed: false };
    component.todos = [todoToDelete];
    todoService.deleteTodo.and.returnValue(of(undefined));

    component.deleteTodo(1);

    expect(component.todos.length).toBe(0);
    expect(snackBar.open).toHaveBeenCalledWith('Tâche supprimée', 'Fermer', {
      duration: 3000,
      panelClass: 'snackbar-success',
    });
  });

  it('should handle error when deleting a todo', fakeAsync(() => {
    const todoToDelete = { id: 1, title: 'Test Todo', completed: false };
    component.todos = [todoToDelete];

    // Simuler une erreur lors de la suppression du todo
    todoService.deleteTodo.and.returnValue(
      throwError(() => new Error('Error'))
    );

    // Appeler la méthode de suppression
    component.deleteTodo(1);

    // Détecter les changements manuellement
    fixture.detectChanges();
    tick(); // Avance le temps pour que l'observable se résolve

    // Vérifier que la snackbar a été ouverte avec le bon message d'erreur
    expect(snackBar.open).toHaveBeenCalledWith(
      'Impossible de supprimer la tâche',
      'Fermer',
      { duration: 3000, panelClass: 'snackbar-error' }
    );

    // Vérifier que la tâche n'a pas été supprimée
    expect(component.todos.length).toBe(1);
    expect(component.todos[0]).toEqual(todoToDelete);
  }));

  it('should navigate to dashboard on goToDashboard', () => {
    component.goToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to user management on goToUsersManagement', () => {
    component.goToUsersManagement();
    expect(router.navigate).toHaveBeenCalledWith(['/usermanagement']);
  });

  it('should navigate to todo list on goToToDoList', () => {
    component.goToToDoList();
    expect(router.navigate).toHaveBeenCalledWith(['/todolist']);
  });

  it('should navigate to cookies game on goToCookiesGame', () => {
    component.goToCookiesGame();
    expect(router.navigate).toHaveBeenCalledWith(['/cookiesgame']);
  });

  it('should logout user on logout', () => {
    component.logout();
    expect(authService.logOut).toHaveBeenCalled();
  });

  it('should close popup on closePopup', () => {
    component.closePopup();
    expect(component.showPopup).toBeFalse();
  });
});
