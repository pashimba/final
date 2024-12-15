import { Component, Input, OnInit } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass, BtnComponent, RouterLink, NgIf, NgFor],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() data: any; // Recibe tanto eventos como posts
  @Input() isEvent: boolean = false; // Indica si es un evento
  toggleInput: boolean = false;
  showComments: boolean = false;
  user: any;

  constructor(
    public db: DatabaseService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    // Recupera la información del usuario asociado al evento o post
    if (this.data?.userId) {
      this.db.getDocumentById('users', this.data.userId).subscribe(
        (res: any) => {
          this.user = res;
        },
        (error) => console.error('Error al obtener datos del usuario:', error)
      );
    }
  }

  /**
   * Manejo de "Me gusta"
   */
  setLike() {
    if (!Array.isArray(this.data.likes)) {
      this.data.likes = []; // Asegura que los likes siempre sean un array
    }

    let likesToUpdate = [...this.data.likes];

    if (this.checkLike()) {
      // Si ya le dio "Me gusta", elimina su ID de los likes
      likesToUpdate = likesToUpdate.filter((id) => id !== this.auth.profile?.id);
    } else {
      // Si no le ha dado "Me gusta", agrega su ID a los likes
      likesToUpdate.push(this.auth.profile?.id);
    }

    // Determina la colección (events o posts) según el tipo
    const collectionName = this.isEvent ? 'events' : 'posts';

    this.db.updateFirestoreDocument(collectionName, this.data.id, { likes: likesToUpdate })
      .then(() => console.log('Likes actualizados correctamente'))
      .catch((error) => console.error('Error al actualizar likes:', error));
  }

  /**
   * Verifica si el usuario actual ya le dio "Me gusta"
   */
  checkLike(): boolean {
    if (!Array.isArray(this.data.likes)) return false;
    return this.data.likes.includes(this.auth.profile?.id);
  }
}
