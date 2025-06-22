import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-button',
  standalone: false,
  styleUrls: ['./ph-button.component.scss'],
  templateUrl: './ph-button.component.html'
})
export class PhButtonComponent implements OnInit {

  @Input() value: string | number = '';
  @Input() isActive: boolean = false;

  constructor() { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {}

  ngOnInit(): void {
  }

}
