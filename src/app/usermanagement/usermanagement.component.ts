import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { UpdateComponent } from '../update/update.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { MatPaginator } from '@angular/material/paginator'; // Import de MatPaginator

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class UsermanagementComponent implements AfterViewInit {
  // Implémentation de AfterViewInit
  username: string = '';
  showPopup = false;
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['name', 'actions', 'update', 'status'];

  users: User[] = [];
  filterValue: string = '';

  // Déclaration de @ViewChild pour récupérer l'élément MatPaginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.tableData(); // Chargement des données à l'initialisation
    this.username = this.authService.getStoredUserName() || '';
  }

  ngAfterViewInit() {
    // Assigner le paginator à la dataSource une fois la vue initialisée
    this.dataSource.paginator = this.paginator;
  }
  pageEvent(event: any) {
    console.log('Page changed:', event);
    // Vous pouvez mettre à jour ici vos données ou effectuer des actions supplémentaires
  }

  // Fonction pour récupérer les données des utilisateurs depuis le service
  tableData(): void {
    this.userService.getAllUsers().subscribe((response: User[]) => {
      this.users = response;
      this.dataSource.data = this.users; // Affecter les données à la source de données
      // Assigner le paginator à la dataSource ici si nécessaire
    });
  }

  // Fonction de mise à jour d'un utilisateur
  handleUpdateAction(user: User): void {
    if (user.id === undefined) {
      console.error('User ID is undefined. Cannot update.');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.disableClose = true;
    dialogConfig.data = { user };

    const dialogRef = this.dialog.open(UpdateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((updatedData: User) => {
      if (updatedData) {
        this.userService
          .updateUser(user.id as number, updatedData)
          .subscribe((updatedUser) => {
            const index = this.users.findIndex((u) => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users];
            }
          });
      }
    });
  }

  // Fonction pour supprimer un utilisateur avec confirmation
  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.userService.deleteUser(id).subscribe(
          () => {
            this.users = this.users.filter((user) => user.id !== id);
            this.dataSource.data = [...this.users];
            console.log('Utilisateur supprimé avec succès.');
          },
          (error) => {
            console.error(
              "Erreur lors de la suppression de l'utilisateur",
              error
            );
          }
        );
      }
    });
  }

  // Appliquer le filtre sur la table des utilisateurs
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Fonction pour la gestion de la navigation
  goToUsersManagement() {
    this.router.navigate(['/usermanagement']);
  }

  goToToDoList() {
    this.router.navigate(['/todolist']);
  }

  goToDashboard() {
    this.showPopup = false;
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
    this.router.navigate(['/dashboard']);
  }

  goToCookiesGame() {
    this.router.navigate(['/cookiesgame']);
  }

  logOut() {
    this.authService.logOut();
  }

  // Fonction pour changer le statut d'un utilisateur
  toggleStatus(user: User): void {
    if (user.email === undefined) {
      console.error('User ID is undefined. Cannot toggle status.');
      return;
    }

    const newStatus = user.status === 'true' ? 'false' : 'true';
    this.userService.updateUserStatus(user.email, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        this.dataSource.data = [...this.users];
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut', err);
      },
    });
  }
}
