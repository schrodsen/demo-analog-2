import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ImageSliderModel, ImageTagModel, ProductCodes } from './image-slider.model';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { load } from './image-slider.server';
import { injectLoad } from '@analogjs/router';

@Component({
  selector: 'image-slider',
  standalone: true,
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  imports: [
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageSliderComponent implements OnInit {

  @Input() productCode: string = '';
  @Input() images: ImageTagModel[] = [];

  //data = toSignal(injectLoad<typeof load>(), { requireSync: true });

  private httpClient = inject(HttpClient);

  // add dummy
  activeIdx: number = 0;
  activeImage = new BehaviorSubject<ImageTagModel | null>(null)
  activeImg$ = this.activeImage as Observable<ImageTagModel | null>;

  constructor() {
    console.log('ctor image slider');
    this.getImages();
    //console.log(this.data());
  }

  ngOnInit() {
    console.log('ng onint image slider');
    //console.log(this.data());
   //this.activeImage.next(this.images[0]);
  }

  onNext() {
    if (this.activeIdx < this.images.length - 1) {
      this.activeIdx++;
      this.activeImage.next(this.images[this.activeIdx]);
    }
  }

  onPrevious() {
    if (this.activeIdx > 0) {
      this.activeIdx--;
      this.activeImage.next(this.images[this.activeIdx]);
    }
  }

  onSelection(i: number) {
    console.log(i)
    this.activeImage.next(this.images[i]);
  }

  getImages() : void {

    // const serverApiUrl = 'https://localhost:5173/api/v1/slider/kuga';
    // this.httpClient.get<string>(serverApiUrl).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   }
    // });


    const productCode = this.getRandomProductCode();
    const apiUrl = `https://vhdev.proxy.beeceptor.com/slider/${productCode}`;
    console.log('url', apiUrl);

    this.httpClient.get<ImageSliderModel>(apiUrl)
      .pipe(
        map((responseModel) => {
          for (let image of responseModel.images) {
            image.url = image.url + '?w=960&h=540'
          }
          return responseModel.images;
        }),
        catchError((err) => {
        console.log('err', err)
        const emptyArray: ImageTagModel[] = [];
        return of(emptyArray)
      }))
      .subscribe({
        next: (images) => {
          console.log(images);
          if (images.length > 0) {
            this.activeImage.next(images[0]);
            this.images = images;
          }
        },
      })
  }

  private getRandomProductCode() : string {
    const randomNumber = this.randomIntFromInterval(0,7);
    return ProductCodes[randomNumber];
  }

  // min and max included
  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
