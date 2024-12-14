import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Método para registrar a un nuevo usuario
  async signup(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en el registro', error);
      throw error;
    }
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      throw error;
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      await this.afAuth.signOut();
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      throw error;
    }
  }
}
