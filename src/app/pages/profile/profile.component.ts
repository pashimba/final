import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    NgFor,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  postsFiltrados: any;
  constructor(
    public auth: AuthService,
    public db: DatabaseService
  ) {
    console.log('hola desde perfil component', auth.profile);
    this.db.getDocumentsByField('posts', 'userId', this.auth.profile?.id)
    .subscribe((res: any)=>{
      console.log('posts filtrados', res);
      this.postsFiltrados = res;
    });
  }


  /*  db.updateFirestoreDocument('users', auth.profile.id, { phone: '+591145625' });
    db.updateFirestoreDocument('users', auth.profile.id, {
      description: 'Full Stack developer',
      ocupation: 'Teacher',
      link: 'https:github.com/@lopezfer',
      protraitPhoto: '',
      nickname: 'lopezfer',
      verified: 'true',

      followers: [],
      following: [],
      posts: []
    }); */



}
