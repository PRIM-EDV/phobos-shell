import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ph-input',
  standalone: false,
  styleUrls: ['./ph-input.component.scss'],
  templateUrl: './ph-input.component.html'
})
export class PhInputComponent implements OnInit {

  @Input() label: string = "";
  @Input() type: string = "text";
  @Input() value: string | number = "";

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onValueChange(event: any) {
    this.valueChange.emit(event.target.value);
  }

}
