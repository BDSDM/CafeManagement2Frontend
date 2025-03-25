import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modèle pour une tâche
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private apiUrl = 'http://localhost:8080/api/todolist'; // URL de l'API ou de la base de données

  constructor(private http: HttpClient) {}

  // Récupérer toutes les tâches pour un utilisateur spécifique
  getTodosForUser(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Récupérer une tâche spécifique par ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle tâche pour un utilisateur (en utilisant l'email de l'utilisateur)
  createTodo(newTodo: Todo, userEmail: string): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/user/${userEmail}`, newTodo);
  }

  // Mettre à jour une tâche spécifique
  updateTodo(taskId: number, updatedTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${taskId}`, updatedTodo);
  }

  // Supprimer une tâche spécifique
  deleteTodo(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
