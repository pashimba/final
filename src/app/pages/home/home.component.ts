import { Component, importProvidersFrom, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { MessageComponent } from '../../components/message/message.component';
import { BtnComponent } from '../../components/btn/btn.component';
/////// paso 1 importar servicio
import { AuthService } from '../../services/auth.service';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { CoreModule } from '../../core.module';
import { TabbarComponent } from '../../components/tabbar/tabbar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [// HttpClientModule debe estar aquí
    RouterLink,
    NgFor,
    NgClass,
    CardComponent,
    MessageComponent,
    TabbarComponent,
    BtnComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  title: any;
  posts: any;
  postsFiltrados: any;
  tags: any = [];
  tagsMarcados: any = [];
  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public auth: AuthService /////// paso 2 importar servicio
  ) {
    this.title = 'Home';

  }

  ngOnInit(): void {
    this.loadData();
    console.log('posts', this.posts);
    /* this.db.fetchFirestoreCollection('figuras')
    .subscribe((res: any)=>{
      console.log('res', res)
    }) */
  }
  loadData() {
    console.log('loadData', this.posts);
    this.db.fetchFirestoreCollection('posts')
      .subscribe((res: any) => {
        this.postsFiltrados = res;
        this.posts = res;
        console.log('posts', this.posts);
        /// tags para filtros
        this.tags = [];
        this.posts.forEach((e: any) => {
          e.userTags.forEach((tag: any) => {
            if (this.tags.indexOf(tag) === -1) {
              this.tags.push(tag);
            }
          })
        });
      })
  }

  selectUserTag(tag: any) {
    const index = this.tagsMarcados.indexOf(tag)
    if (index === -1) {
      this.tagsMarcados.push(tag);
    }
    else {
      this.tagsMarcados.splice(index, 1)
    }
    this.filterData()
  }

  filterData() {
    this.postsFiltrados = [];
    for (let i = 0; i < this.posts.length; i++) {
      console.log(this.posts[i])
      for (let j = 0; j < this.posts[i].userTags.length; j++) {
        if (this.tagsMarcados.indexOf(this.posts[i].userTags[j]) >= 0) {
          this.postsFiltrados.push(this.posts[i]);
          break;
        }
      }
    }
  }

}
