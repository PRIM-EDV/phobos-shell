import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-dropdown-item',
  standalone: false,
  styleUrls: ['./ph-dropdown-item.component.scss'],
  templateUrl: './ph-dropdown-item.component.html'
})
export class PhDropdownItemComponent implements OnInit {

    @Input() label: string = "";
    @Input() value: any = "";

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {}

    constructor() { }

    ngOnInit(): void {
    }

}
