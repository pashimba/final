import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent {
  id: string | null = null;
  link: string | null = null;
  formulario!: FormGroup;
  post: any;
  formularioEvent!: FormGroup; // Formulario para eventos
  event: any;
  imageFile: File | null = null; // Para manejar el archivo de imagen

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute
  ) {
    // Extraer parámetros de la URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.link = this.activatedRoute.snapshot.queryParamMap.get('link');
    console.log('ID:', this.id, 'Link:', this.link);

    // Inicializar formularios
    this.formulario = this.fb.group({
      image: ['/posts/', []],
      content: ['', [Validators.required]],
    });

    this.formularioEvent = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: ['', [Validators.required]],
      price: ['', [Validators.required]],
      adress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      image: ['', []], // Campo para la imagen
    });

    // Cargar datos si hay un ID
    if (this.id) {
      this.loadPostData(this.id);
      this.loadEventData(this.id);
    }
  }

  /**
   * Cargar datos del post para edición.
   * @param id - ID del post a editar
   */
  loadPostData(id: string) {
    this.db.getDocumentById('posts', id).subscribe(
      (res: any) => {
        this.post = res;
        console.log('Post recuperado:', res);

        // Actualizar valores del formulario de post
        this.formulario.patchValue({
          image: res.image,
          content: res.content,
        });
      },
      (error: any) => {
        console.error('Error al recuperar el post:', error);
        alert('Error al cargar los datos del post.');
      }
    );
  }

  /**
   * Cargar datos del evento para edición.
   * @param id - ID del evento a editar
   */
  loadEventData(id: string) {
    this.db.getDocumentById('events', id).subscribe(
      (res: any) => {
        this.event = res;
        console.log('Evento recuperado:', res);

        // Actualizar valores del formulario de evento
        this.formularioEvent.patchValue({
          title: res.title,
          description: res.description,
          date: res.date,
          price: res.price,
          adress: res.adress,
          city: res.city,
          country: res.country,
          image: res.image,
        });
      },
      (error: any) => {
        console.error('Error al recuperar el evento:', error);
        alert('Error al cargar los datos del evento.');
      }
    );
  }

  /**
   * Guardar o actualizar el post en Firestore.
   */
  async storePost() {
    if (this.formulario.valid) {
      const { image, content } = this.formulario.value;

      try {
        if (this.id) {
          // Actualizar post existente
          await this.db.updateFirestoreDocument('posts', this.id, { image, content });
          alert('Post actualizado exitosamente.');
        } else {
          // Crear nuevo post
          await this.db.addFirestoreDocument('posts', {
            userId: this.auth.profile?.id,
            image: image,
            content: content,
            userTags: [],
            share: [],
            likes: [],
            comentarios: [],
            createdAt: new Date().toISOString(),
          });
          alert('Nuevo post creado exitosamente.');
        }
      } catch (error) {
        console.error('Error al guardar el post:', error);
        alert('Ocurrió un error al guardar el post.');
      }
    } else {
      alert('Por favor, complete los campos requeridos.');
    }
  }

  /**
   * Guardar o actualizar el evento en Firestore.
   */
  async storeEvent() {
    if (this.formularioEvent.valid) {
      const { title, description, date, price, adress, city, country, image } =
        this.formularioEvent.value;

      try {
        if (this.id) {
          // Actualizar evento existente
          await this.db.updateFirestoreDocument('events', this.id, {
            title,
            description,
            date,
            price,
            adress,
            city,
            country,
            image,
          });
          alert('Evento actualizado exitosamente.');
        } else {
          // Crear nuevo evento
          await this.db.addFirestoreDocument('events', {
            userId: this.auth.profile?.id,
            title,
            description,
            date,
            price,
            adress,
            city,
            country,
            image,
            userTags: [],
            createdAt: new Date().toISOString(),
          });
          alert('Nuevo evento creado exitosamente.');
        }
      } catch (error) {
        console.error('Error al guardar el evento:', error);
        alert('Ocurrió un error al guardar el evento.');
      }
    } else {
      alert('Por favor, complete los campos requeridos del evento.');
    }
  }

  /**
   * Manejar el archivo de imagen cargado.
   */
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      console.log('Archivo de imagen seleccionado:', file);
    }
  }
}
