import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  name: string;
  contactNumber: string;
  email: string;
  password?: string;
  status?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users'; // Remplace avec ton URL backend
  private apiUrlCookie = 'http://localhost:8080/users/api';
  private deleteColorUrl = 'http://localhost:8080/users/api/delete-color'; // Utilise le bon port pour le backend
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  refreshAccessToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Aucun refresh token trouvé');
    }

    return this.http
      .post<{ accessToken: string }>(this.baseUrl + '/refresh-token', {
        token: refreshToken,
      })
      .pipe(map((response) => response.accessToken));
  }

  updateUserStatus(email: string, status: string): Observable<string> {
    return this.http.put<string>(
      `http://localhost:8080/users/update-status/${status}?email=${email}`,
      {}
    );
  }

  // Enregistrer un utilisateur
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  // Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  setColorPreference(color: string): Observable<any> {
    // Vérification de la valeur de couleur
    if (!color || color.trim() === '') {
      throw new Error('La couleur ne peut pas être vide');
    }

    // Récupérer le token JWT depuis le localStorage
    const token = localStorage.getItem('token'); // Ou utilisez une autre méthode pour obtenir le token

    // Créer un paramètre de requête pour la couleur
    const params = new HttpParams().set('color', color);

    // Ajouter le token JWT dans l'en-tête Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Envoyer la requête POST avec le token et les cookies
    return this.http.post(`${this.apiUrlCookie}/set-color`, null, {
      params,
      headers, // Inclure l'en-tête avec le token
      responseType: 'text', // Spécifier le type de réponse attendu
      withCredentials: true, // Inclure les cookies dans la requête
    });
  }
  getColorPreference(): Observable<string> {
    // Récupérer le token JWT depuis le localStorage
    const token = localStorage.getItem('token'); // Ou utilisez une autre méthode pour obtenir le token

    // Ajouter le token JWT dans l'en-tête Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Envoyer la requête GET avec le token et les cookies
    return this.http.get(`${this.apiUrlCookie}/get-color`, {
      headers, // Inclure l'en-tête avec le token
      responseType: 'text', // Spécifier le type de réponse attendu
      withCredentials: true, // Inclure les cookies dans la requête
    });
  }
  // Méthode pour supprimer le cookie
  deletePreferredColor(): Observable<string> {
    return this.http.post(
      this.deleteColorUrl,
      {},
      {
        withCredentials: true,
        responseType: 'text', // 👈 Indique qu'on attend une chaîne de caractères et non du JSON
      }
    );
  }
  logoutFromApp() {
    localStorage.removeItem('token');

    this.router.navigate(['/home']);
  }
}
