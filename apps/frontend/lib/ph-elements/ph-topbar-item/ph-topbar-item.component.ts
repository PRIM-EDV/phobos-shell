import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-topbar-item',
  standalone: false,
  styleUrls: ['./ph-topbar-item.component.scss'],
  templateUrl: './ph-topbar-item.component.html'
})
export class PhTopbarItemComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
