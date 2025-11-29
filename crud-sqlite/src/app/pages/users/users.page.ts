import { Component, OnInit } from '@angular/core';
import { SQLiteService } from '../../services/sqlite-service';
import { UsersPageModule } from './users.module';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonList, 
  IonListHeader, 
  IonLabel 
} from '@ionic/angular/standalone'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonIcon, IonList, IonListHeader, IonLabel, UsersPageModule]
})
export class UsersPage implements OnInit {
  users: any[] = [];
  name = '';
  email = '';

  constructor(private sqliteService: SQLiteService) { }

  async ngOnInit() {
    await this.sqliteService.initDB();
    await this.loadUsers();
  }
  async loadUsers() {
    this.users = await this.sqliteService.getUsers();
    console.log('Usuários carregados:' , this.users);
  
}
  async addUser() {
    if (this.name && this.email) {
      await this.sqliteService.addUser(this.name, this.email);
      this.name = '';
      this.email = '';
      await this.loadUsers();
    }
  }

  async deleteUser(id: number) {
    await this.sqliteService.deleteUser(id);
    await this.loadUsers();
  }
}
