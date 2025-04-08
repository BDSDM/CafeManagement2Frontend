import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService, User } from './user.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/users';
  const apiUrlCookie = 'http://localhost:8080/users/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP non traitée ne subsiste
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it("devrait mettre à jour le statut d'un utilisateur", () => {
    const email = 'test@example.com';
    const status = 'active';

    service.updateUserStatus(email, status).subscribe((response) => {
      expect(response).toEqual('Statut mis à jour');
    });

    const req = httpMock.expectOne(
      `${apiUrl}/update-status/${status}?email=${email}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush('Statut mis à jour');
  });

  it('devrait enregistrer un utilisateur', () => {
    const mockUser: User = {
      name: 'John Doe',
      contactNumber: '123456789',
      email: 'john@example.com',
      password: 'password123',
    };

    service.registerUser(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('devrait récupérer un utilisateur par ID', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      contactNumber: '123456789',
      email: 'john@example.com',
    };

    service.getUserById(1).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('devrait récupérer tous les utilisateurs avec le token JWT', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        contactNumber: '123456789',
        email: 'john@example.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        contactNumber: '987654321',
        email: 'jane@example.com',
      },
    ];
    localStorage.setItem('token', 'fake-token');

    service.getAllUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(mockUsers);
  });

  it('devrait mettre à jour un utilisateur', () => {
    const updatedUser: User = {
      id: 1,
      name: 'John Updated',
      contactNumber: '123456789',
      email: 'john@example.com',
    };

    service.updateUser(1, updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('devrait supprimer un utilisateur', () => {
    service.deleteUser(1).subscribe((response) => {
      expect(response).toBeNull(); // Correction ici
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Retourne bien null pour correspondre à l'attente du test
  });

  it('devrait envoyer la préférence de couleur avec le token', () => {
    localStorage.setItem('token', 'fake-token');
    const color = 'blue';

    service.setColorPreference(color).subscribe((response) => {
      expect(response).toEqual('Couleur mise à jour');
    });

    const req = httpMock.expectOne(`${apiUrlCookie}/set-color?color=blue`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(req.request.withCredentials).toBeTrue();
    req.flush('Couleur mise à jour');
  });

  it('devrait lever une erreur si la couleur est vide', () => {
    expect(() => service.setColorPreference('')).toThrowError(
      'La couleur ne peut pas être vide'
    );
  });

  it('devrait récupérer la préférence de couleur avec le token', () => {
    localStorage.setItem('token', 'fake-token');

    service.getColorPreference().subscribe((response) => {
      expect(response).toBe('blue');
    });

    const req = httpMock.expectOne(`${apiUrlCookie}/get-color`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(req.request.withCredentials).toBeTrue();
    req.flush('blue');
  });
});
