import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = {}; 
  favorites: any[] = [];
  showFavorites: boolean = false;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.verifyIsLogued()) {
      this.router.navigateByUrl('/login'); 
      return;
    }
    
  
    this.profile = this.auth.profile || {};
    
    
    this.loadFavorites();
  }

  
  async loadFavorites() {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      console.error('Usuario no autenticado.');
      return;
    }

    try {
      const userId = currentUser.uid;

      
      this.favorites = [];

      const querySnapshot = await this.db.queryFavorites(userId);
      this.favorites = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log('Favoritos cargados:', this.favorites);
    } catch (error) {
      console.error('Error al cargar los favoritos:', error);
    }
  }

  
  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
  }


  async toggleFavorite(evento: any) {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      console.error('Usuario no autenticado.');
      return;
    }

    try {
      const userId = currentUser.uid;

      if (evento.isFavorite) {
        await this.db.removeFavorite(userId, evento.id);
        evento.isFavorite = false;
      } else {
        await this.db.addFavorite(userId, evento);
        evento.isFavorite = true;
      }


      await this.loadFavorites();
    } catch (error) {
      console.error('Error al manejar favoritos:', error);
    }
  }

  
  logout() {
    this.auth.logoutUser()
      .then(() => {
        localStorage.clear(); 
        this.router.navigateByUrl('/login'); 
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}
