import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-topbar-header',
  standalone: false,
  styleUrls: ['./ph-topbar-header.component.scss'],
  templateUrl: './ph-topbar-header.component.html'
})
export class PhTopbarHeaderComponent implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
