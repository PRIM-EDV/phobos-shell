import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-window',
  standalone: false,
  styleUrls: ['./ph-window.component.scss'],
  templateUrl: './ph-window.component.html',
})
export class PhWindowComponent implements OnInit {

  @Input() public title = '';
  @Input() public subtitle = '';

  private dragStartCoursor = {x: 0, y: 0};
  private dragStartElement = {x: 0, y: 0};

  private isDragged = false;

  constructor(public ref: ElementRef) { 
    window.addEventListener('mouseup', (e) => {  
        this.handleDragStop();
      });
  }

  public hide() {
    this.ref.nativeElement.style.display = "none";
    this.ref.nativeElement.style.pointerEvents = "none";
  }

  public show() {
    this.ref.nativeElement.style.display = "block";
    this.ref.nativeElement.style.pointerEvents = "auto";
  }

  ngOnInit(): void {
  }

  handleDragStart(ev: MouseEvent) {
    ev.preventDefault();

    this.dragStartCoursor = {x: ev.x, y: ev.y};
    this.dragStartElement = {x: this.ref.nativeElement.offsetLeft, y: this.ref.nativeElement.offsetTop};

    this.isDragged = true;
  }

  handleDrag(ev: MouseEvent) {
    ev.preventDefault();

    if (this.isDragged) {
        this.ref.nativeElement.style.left = `${this.dragStartElement.x + ev.x - this.dragStartCoursor.x}px`;
        this.ref.nativeElement.style.top = `${this.dragStartElement.y + ev.y - this.dragStartCoursor.y}px`;
    }
  }

  handleDragStop() {
    this.isDragged = false;
  }

}
