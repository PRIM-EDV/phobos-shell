import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-command-list',
  standalone: false,
  styleUrls: ['./ph-command-list.component.scss'],
  templateUrl: './ph-command-list.component.html'
})
export class PhCommandListComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
