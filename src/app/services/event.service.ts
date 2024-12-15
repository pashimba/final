import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Event {
  id: string; // ID del evento
  date: number; // Fecha del evento
  image: string; // Ruta de la imagen
  location: string; // Ubicación
  name: string; // Nombre del evento
  price: number; // Precio
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los eventos
  getEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges({ idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Error al obtener eventos:', error);
        return throwError(() => new Error('Error al obtener los eventos.'));
      })
    );
  }

  // Obtener un evento por ID
  getEventById(id: string): Observable<Event | undefined> {
    return this.firestore.collection<Event>('events').doc(id).valueChanges().pipe(
      catchError((error) => {
        console.error('Error al obtener el evento por ID:', error);
        return throwError(() => new Error('Error al obtener el evento.'));
      })
    );
  }
}
