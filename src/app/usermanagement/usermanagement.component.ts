import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { UpdateComponent } from '../update/update.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class UsermanagementComponent {
  username: string = '';
  showPopup = false;
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['name', 'actions', 'update', 'status'];

  users: User[] = [];
  filterValue: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.tableData();
    this.username = this.authService.getStoredUserName() || '';
  }

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

  /* toggleStatus(user: User): void {
    if (user.id === undefined) {
      console.error('User ID is undefined. Cannot toggle status.');
      return;
    }

    const newStatus = user.status === 'true' ? 'false' : 'true';
    this.userService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        this.dataSource.data = [...this.users];
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut', err);
      },
    });
  }
 */
  deleteUser(id: number): void {
    // Ouvrir la boîte de dialogue de confirmation
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      disableClose: true,
    });

    // Traitement après la fermeture de la boîte de dialogue
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

  tableData(): void {
    this.userService.getAllUsers().subscribe((response: User[]) => {
      this.users = response;
      this.dataSource.data = this.users;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goToUsersManagement() {
    this.router.navigate(['/usermanagement']);
  }

  goToToDoList() {
    this.router.navigate(['/todolist']);
  }
  goToDashboard() {
    this.showPopup = false; // Ferme la popup
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
    this.router.navigate(['/dashboard']);
  }
  goToCookiesGame() {}
  logOut() {
    this.authService.logOut();
  }

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
