import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { NgFor, NgClass } from '@angular/common';
import { OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { RouterLink } from '@angular/router';



@Component({
    selector: 'app-view-events',
    standalone: true,
    imports: [NgFor, NgClass, CardComponent, RouterLink],
    templateUrl: './view-events.component.html',
    styleUrl: './view-events.component.scss'
})
export class ViewEventsComponent implements OnInit {
  events: any;
  eventsFiltrados: any;
  tags: any = [];
  tagsMarcados: any = [];

  constructor(
    public db: DatabaseService,
  ) {
    this.db.fetchFirestoreCollection('events')
    .subscribe((res: any) => {
      console.log('Eventos desde firebase', res);
      this.events = res;
    });
  }

  ngOnInit(): void {
    this.loadData();
    console.log('posts', this.events);
    /* this.db.fetchFirestoreCollection('figuras')
    .subscribe((res: any)=>{
      console.log('res', res)
    }) */
  }

  
  loadData() {
    console.log('loadData', this.events);
    this.db.fetchFirestoreCollection('events')
      .subscribe((res: any) => {
        this.eventsFiltrados = res;
        this.events = res;
        console.log('posts', this.events);
        /// tags para filtros
        this.tags = [];
        this.events.forEach((e: any) => {
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
    this.eventsFiltrados = [];
    for (let i = 0; i < this.events.length; i++) {
      console.log(this.events[i])
      for (let j = 0; j < this.events[i].userTags.length; j++) {
        if (this.tagsMarcados.indexOf(this.events[i].userTags[j]) >= 0) {
          this.eventsFiltrados.push(this.events[i]);
          break;
        }
      }
    }
  }

}

    


