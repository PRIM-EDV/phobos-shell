import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-table',
  standalone: false,
  styleUrls: ['./ph-table.component.scss'],
  templateUrl: './ph-table.component.html'
})
export class PhTableComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
