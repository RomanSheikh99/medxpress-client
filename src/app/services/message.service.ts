import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  private toastService = inject(HotToastService);

  constructor() { }

  success(msg: string) {
    this.toastService.success(msg, {
      icon: '😀',
      position: 'top-center',
      duration: 2000,
      style: {
        border: '1px solid #067A46',
        padding: '16px',
        color: '#067A46',
        background: '#D2F895',
        fontFamily: 'Agrandir-Regular',
      }
    });
  }

  failed(msg: string) {
    this.toastService.error(msg, {
      icon: '😞',
      position: 'top-center',
      duration: 2000,
      style: {
        border: '1px solid #FF0000',
        padding: '16px',
        color: '#FF0000',
        background: '#FFB0B0',
        fontFamily: 'Agrandir-Regular',
      },
    });
  }

}
