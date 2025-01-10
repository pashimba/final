import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss']
})
export class EventoFormComponent implements OnInit {
  action: string = 'create';
  id: any;
  data: any;
  form: FormGroup;
  eventos: any[] = []; 
  showForm: boolean = false; 

  

  constructor(
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public db: DatabaseService
  ) {
  
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      photoURL: ['', []],
      description: ['', []],
      country: ['', []],
      city: ['', []],
      location: ['', []],
      date: ['', []],
      price: ['', []],
      discount: ['', []],
      cantidadEntradas: ['',[]],
      category: ['', []],
    });

    
    const routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.action = routeAction ? routeAction : 'create';

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    
    this.loadEvents();

  
    if (this.action !== 'create') {
      this.db.getDocumentById('events', this.id).subscribe((res: any) => {
        console.log('Evento seleccionado', res);
        this.data = res;

        if (res) {
          const { name, photoURL, description, country, city, location, date, price, discount, cantidadEntradas, category } = this.data;
          this.form.setValue({
            name: name || '',
            photoURL: photoURL || '',
            description: description || '',
            country: country || '',
            city: city || '',
            location: location || '',
            date: date || '',
            price: price || '',
            discount: discount || '',
            category: category || '',
            cantidadEntradas: cantidadEntradas || '',
          });
        }
      });
    }
  }



  
  toggleForm() {
    this.showForm = !this.showForm;

    if (this.showForm) {
      this.action = 'create';
      this.form.reset();
    }
  }

  
  transaction() {
    if (this.form.valid) {
      console.log('Formulario válido', this.form.value);

      if (this.action === 'create') {
        this.db.addFirestoreDocument('events', this.form.value).then(() => {
          alert('Evento creado');
          this.form.reset();
          this.loadEvents(); 
        });
      }

      if (this.action === 'update') {
        this.db.updateFirestoreDocument('events', this.id, this.form.value).then(() => {
          alert('Evento actualizado');
          this.loadEvents();
        });
      }

      if (this.action === 'delete') {
        this.db.deleteFirestoreDocument('events', this.id).then(() => {
          alert('Evento eliminado');
          this.loadEvents(); 
        });
      }
    } else {
      alert('Formulario inválido');
    }
  }

  
  loadEvents() {
    this.db.fetchFirestoreCollection('events').subscribe((res: any[]) => {
      this.eventos = res;
      console.log('Lista de eventos cargados:', this.eventos);
    });
  }

  
  createEvent() {
    this.action = 'create';
    this.id = null;
    this.form.reset(); 
    alert('Evento creado')
  }


  editEvent(evento: any) {
    this.action = 'update';
    this.id = evento.id;
    this.form.patchValue(evento); 
    alert('Haga click en editar evento')
  }


  deleteEvent(eventoId: string) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
      this.db.deleteFirestoreDocument('events', eventoId).then(() => {
        alert('Evento eliminado');
        this.loadEvents(); 
      });
    }
  }
}
