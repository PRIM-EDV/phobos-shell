import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'ph-context-menu',
  standalone: false,
  styleUrls: ['./ph-context-menu.component.scss'],
  templateUrl: './ph-context-menu.component.html'
})
export class PhContextMenuComponent implements OnInit {

  public isOpened = false;

  constructor(public ref: ElementRef) {
    window.addEventListener('mousedown', (e) => {  
      if(!ref.nativeElement.contains(e.target)) {
        this.close();
      }
    });

    window.addEventListener('wheel', (e) => {  
      if(!ref.nativeElement.contains(e.target)) {
        this.close();
      }
    });
  }

  ngOnInit(): void {
  }

  public open(position?: {x: number, y: number}) {
    if(position) {
      this.ref.nativeElement.style.top = `${position.y - 6}px`;
      this.ref.nativeElement.style.left = `${position.x - 6}px`;
    }
    this.ref.nativeElement.style.display = "block";
    this.isOpened = true;
  }

  public close() {
    this.isOpened = false;
    this.ref.nativeElement.style.display = "none";
  }

}
