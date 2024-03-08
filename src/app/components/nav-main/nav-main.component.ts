import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-main',
  standalone: true,
  template: `
      @for (item of items; track item) {
        <a class="flex-container-column flex-item-even" href="{{item.route}}">
          <i class="{{item.iconClass}}"></i>
          <div class="">{{item.label}}</div>
        </a>
      }
  `,
  styles: `
    a {
      color: white;
      justify-content: center;
      align-items: center;
    }

    a:hover {
      border-bottom: 3px solid yellow;
    }

    a > i {
      display: block;
      font-size: 28px;
    }

    a > div {
      font-size: 18px;
    }
  `
})
export class NavMainComponent implements OnInit {

  @Input() items: NavMainItemModel[] = []

  constructor() { }

  ngOnInit() {
  }

}

export interface NavMainItemModel {
  route: string,
  label: string,
  iconClass: string,
}
