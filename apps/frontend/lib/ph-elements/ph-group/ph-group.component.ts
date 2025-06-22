import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ph-group',
  standalone: false,
  styleUrls: ['./ph-group.component.scss'],
  templateUrl: './ph-group.component.html'
})
export class PhGroupComponent implements OnInit {
    @Input() label: string = '';

    ngOnInit(): void {
    }
}