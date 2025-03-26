import { Component, OnInit } from '@angular/core';
import { Todo, ToDoListService } from '../services/to-do-list.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  userId: number = 0; // ID de l'utilisateur connecté
  todos: Todo[] = []; // Liste des tâches
  newTodoTitle: string = ''; // Titre de la nouvelle tâche
  userEmail: string = ''; // Email de l'utilisateur
  userName: string = '';
  showPopup = false;

  constructor(
    private todoService: ToDoListService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID et l'email de l'utilisateur depuis le service d'authentification
    this.showPopup = this.authService.getStoredBoolean();
    this.userId = this.authService.getStoredUserId();
    this.userName = this.authService.getStoredUserName();
    this.userEmail = this.authService.getStoredUserEmail() || '';
    this.getTodos();
  }

  closePopup() {
    this.showPopup = false; // Ferme la popup
  }

  // Récupérer toutes les tâches pour l'utilisateur
  getTodos(): void {
    this.todoService.getTodosForUser(this.userId).subscribe(
      (data) => {
        this.todos = data;
      },
      () =>
        this.showNotification('Erreur lors du chargement des tâches', 'error')
    );
  }

  // Ajouter une nouvelle tâche
  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: 0,
        title: this.newTodoTitle,
        completed: false,
      };
      this.todoService.createTodo(newTodo, this.userEmail).subscribe(
        (createdTodo) => {
          this.todos.push(createdTodo);
          this.newTodoTitle = '';
          this.showNotification('Tâche ajoutée avec succès', 'success');
        },
        () =>
          this.showNotification("Erreur lors de l'ajout de la tâche", 'error')
      );
    }
  }

  // Supprimer une tâche
  deleteTodo(taskId: number): void {
    this.todoService.deleteTodo(taskId).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== taskId);
      this.showNotification('Tâche supprimée', 'success');
    });
  }

  // Afficher une notification
  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }
  handleSignUpAction() {}
  handleSignInAction() {}
  logout() {
    this.authService.logOut();
  }
  goToDashboard() {
    this.showPopup = false; // Ferme la popup
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
    this.router.navigate(['/dashboard']);
  }
  goToUsersManagement() {
    this.router.navigate(['/usermanagement']);
  }
  goToToDoList() {
    this.router.navigate(['/todolist']);
  }
  goToCookiesGame() {
    this.router.navigate(['/cookiesgame']);
  }
}
