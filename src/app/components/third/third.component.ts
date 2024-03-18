import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-template/dynamic-template.types';

@Component({
  selector: 'app-third',
  standalone: true,
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.css']
})
export class ThirdComponent implements OnInit, DynamicComponent {

  constructor() { }

  ngOnInit() {
  }

}
