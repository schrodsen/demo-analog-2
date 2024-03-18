import { Component, OnInit, inject } from '@angular/core';
import { FooterComponentModel, FooterService } from './footer.service';
import { DynamicComponent } from '../dynamic-template/dynamic-template.types';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements DynamicComponent, OnInit {

  footerService = inject(FooterService);

  pageData: FooterComponentModel;
  newsletterEmail: string = '';

  constructor() {
    this.pageData = this.footerService.getData();
  }

  ngOnInit() {
  }

  onSubmitNewsletter(event: any) : void {

  }
}

