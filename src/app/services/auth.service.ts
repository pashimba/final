import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { EventService } from './event.service'


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogued = false;
  profile: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    public db: DatabaseService,
    public router: Router
  ) {
    this.verifyIsLogued();
    this.initializeProfile();
  }

  /**
   * Inicializa el perfil y usuario desde localStorage
   */
  private initializeProfile() {
    const storedProfile = localStorage.getItem('profile');
    const storedUser = localStorage.getItem('user');

    if (storedProfile && storedProfile !== 'undefined') {
      try {
        this.profile = JSON.parse(storedProfile);
      } catch (error) {
        console.error('Error al parsear el perfil:', error);
      }
    }

    if (storedUser && storedUser !== 'undefined') {
      try {
        const user = JSON.parse(storedUser);
        this.getProfile(user?.uid);
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
      }
    }
  }

  /**
   * Registra un nuevo usuario con correo y contraseña.
   * Guarda datos adicionales en Firestore.
   */
  async registerUser(email: string, password: string, additionalData: { name: string; phone: string; username: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(this.firestore, `users/${userId}`), {
        ...additionalData,
        email,
        createdAt: new Date(),
      });

      console.log('Usuario registrado y documento creado en Firestore');
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }

  /**
   * Inicia sesión con correo y contraseña.
   */
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      localStorage.setItem('user', JSON.stringify(user));
      this.getProfile(user.uid);

      console.log('Usuario autenticado:', user);
      this.router.navigateByUrl('/profile');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  /**
   * Verifica si el usuario está logueado.
   */
  verifyIsLogued(): boolean {
    const user = localStorage.getItem('user');
    this.isLogued = !!user;
    return this.isLogued;
  }

  /**
   * Obtiene el perfil del usuario desde Firestore.
   */
  getProfile(uid: string) {
    this.db.getDocumentById('users', uid).subscribe(
      (res: any) => {
        console.log('Perfil obtenido desde Firestore:', res);
        localStorage.setItem('profile', JSON.stringify(res));
        this.profile = res;
      },
      (error: any) => console.error('Error al obtener el perfil:', error)
    );
  }

  /**
   * Cierra la sesión y limpia los datos locales.
   */
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.clear();
      this.router.navigateByUrl('/login');
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
