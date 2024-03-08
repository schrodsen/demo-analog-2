import { Component, OnInit } from '@angular/core';
import { NavMainComponent, NavMainItemModel } from '../nav-main/nav-main.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    NavMainComponent,
  ]
})
export class HeaderComponent implements OnInit {


  navBarMain: NavMainItemModel[] = [
    {
      route: '/Reiseziele',
      label: 'Reiseziele',
      iconClass: 'mars-icon-car'
    },
    {
      route: '/Gutschein',
      label: 'Gutschein',
      iconClass: 'mars-icon-ship'
    },
    {
      route: '/Katalog',
      label: 'Katalog',
      iconClass: 'mars-icon-plane'
    },
    {
      route: '/Karriere',
      label: 'Karriere',
      iconClass: 'mars-icon-plane'
    },
    {
      route: '/Merkliste',
      label: 'Merkliste',
      iconClass: 'mars-icon-plane'
    },
  ]

  navBarTravel: NavMainItemModel[] = [
    {
      route: '/Eigenanreisen',
      label: 'Eigenanreisen',
      iconClass: 'mars-icon-car'
    },
    {
      route: '/Kreusfahrten',
      label: 'Kreusfahrten',
      iconClass: 'mars-icon-ship'
    },
    {
      route: '/Flugreisen',
      label: 'Flugreisen',
      iconClass: 'mars-icon-plane'
    },
  ]

  contact: NavMainItemModel[] = [
    {
      route: '/tel: 0111111',
      label: 'Buchung und Beratung',
      iconClass: 'mars-icon-car'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
