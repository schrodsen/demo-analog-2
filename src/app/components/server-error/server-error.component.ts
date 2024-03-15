import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-error',
  standalone: true,
  template: `
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-500">
        <h1>500</h1>
      </div>
      <h2>We are sorry, Server went missing!</h2>
      <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
      <a href="/">Back To Homepage</a>
    </div>
  </div>`,
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
