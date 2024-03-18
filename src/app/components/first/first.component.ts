import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-template/dynamic-template.types';

@Component({
  selector: 'app-first',
  standalone: true,
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements DynamicComponent, OnInit {

  constructor() { }

  ngOnInit() {
  }

}
