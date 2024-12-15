import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.scss'
})
export class EventoFormComponent {
  action: any;
  id: any;
  data: any;

  form: FormGroup;
  constructor (
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public db: DatabaseService
  ){

    if (this.activatedRoute.snapshot.paramMap.get('action')){
      this.action = this.activatedRoute.snapshot.paramMap.get('action');
    }
    else {
      this.action = 'create';
    }

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.form = this.fb.group ({ 
      title : ['', [Validators.required]],
      image : ['', []],
      description : ['', []],
      country : ['', []],
      city : ['', []],
      address : ['', []],
      date : ['', []],
      price : ['', []],
      userTags : ['', []],

    })

    if (this.action !== 'create'){
      this.db.getDocumentById('events', this.id)
      .subscribe((res:any)=>{
        console.log('evento seleccionado', res)
        this.data = res;

        if (res){  
        const { title, image, description, country, city, address, date, price, userTags } = this.data;
        this.form.setValue({
          title: title, 
          image: image, 
          description: description, 
          country: country, 
          city: city, 
          address: address, 
          date: date, 
          price: price, 
          userTags: userTags})
      }});
    }
  };
  
  transaction(){
    if (this.form.valid){
      console.log('formulario valido', this.form.value);

      if (this.action === 'create'){
        this.db.addFirestoreDocument('events', this.form.value)
        alert('Datos almacenados')
      }

      if (this.action === 'update'){
        this.db.updateFirestoreDocument('events', this.id, this.form.value)
        alert('evento actualizado')
      }

      if (this.action === 'delete'){
        this.db.deleteFirestoreDocument('events', this.id)
        alert('evento eliminado')
      }

    }
    else {
      alert('formulario invalido')
    }
  }
}

