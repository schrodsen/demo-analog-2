import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-template/dynamic-template.types';

@Component({
  selector: 'app-second',
  standalone: true,
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit, DynamicComponent {

  constructor() { }

  ngOnInit() {
  }

}
