import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-sidebar',
  standalone: false,
  styleUrls: ['./ph-sidebar.component.scss'],
  templateUrl: './ph-sidebar.component.html'
})
export class PhSidebarComponent implements OnInit {
  @Input() public icon: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
