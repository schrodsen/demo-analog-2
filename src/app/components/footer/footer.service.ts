import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor() { }

  getData() : FooterComponentModel {
    return {
      career: 'PlaceHolder',
      contact: 'PlaceHolder',
      cookiesettings: 'PlaceHolder',
      faq: 'PlaceHolder',
      hotelCategory: 'PlaceHolder',
      hotelPartner: 'PlaceHolder',
      imprint: 'PlaceHolder',
      newsletter: 'PlaceHolder',
      newsletterText: 'PlaceHolder',
      newsletterButton: 'PlaceHodler',
      privacy: 'PlaceHolder',
      termsAndConditions: 'PlaceHolder',
      travelInsurance: 'PlaceHolder',
    }
  }
}

export interface FooterComponentModel {
  career: string,
  contact: string,
  cookiesettings: string,
  faq: string,
  hotelCategory: string,
  hotelPartner: string,
  imprint: string,
  newsletter: string,
  newsletterText: string,
  newsletterButton: string,
  privacy: string,
  termsAndConditions: string,
  travelInsurance: string,
}
