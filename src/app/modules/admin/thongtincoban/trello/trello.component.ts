import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit {

  constructor() { }
  url:any;
  ngOnInit(): void {
    this.url = "https://trello.com"
    //this.url = "https://trello.com/chikiet881/boards"
  }
  SetUrl(url)
  {
    console.log(url);
    this.url = url
  }

}
