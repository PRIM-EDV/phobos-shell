import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'ph-slider-vertical',
  standalone: false,
  styleUrls: ['./ph-slider-vertical.component.scss'],
  templateUrl: './ph-slider-vertical.component.html'
})
export class PhSliderVerticalComponent implements OnChanges, AfterViewInit  {
    public active = 0;

    @Input() public label = '';
    @Input() public value: number = 0;
    @Input() public ticks: string[] = [];
    @Input() public tickValues: any[] = [];

    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('track') track!: ElementRef<HTMLDivElement>;
    @ViewChild('handle') handle!: ElementRef<HTMLDivElement>;


    private dragged = false;

    constructor() { 
        window.addEventListener('mouseup', (e) => {  
            this.onDragEnd();
        });

        window.addEventListener('touchend', (e) => {  
            this.onDragEnd();
        });
    }

    ngAfterViewInit(): void {
        this.setTick();
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    onDragStart() {
        this.dragged = true;
        this.update();
        console.log("Drag") 
    }

    onDrag(e: MouseEvent) {
        if (this.dragged) {
            const height = this.track.nativeElement.clientHeight;
            const rect = this.track.nativeElement.getBoundingClientRect(); 
            this.handle.nativeElement.style.top = `${Math.max(Math.min(e.y - rect.top - 10, height), 0) }px`;
            this.update()
        }
    }

    onTouchDrag(e: TouchEvent) {
        if (this.dragged) {
            const height = this.track.nativeElement.clientHeight;
            const rect = this.track.nativeElement.getBoundingClientRect(); 
            this.handle.nativeElement.style.top = `${Math.max(Math.min(e.changedTouches[0].clientY - rect.top - 10, height), 0) }px`;
        }
    }


    onDragEnd() {
        this.dragged = false;

    }

    setTick() {
        const width = this.track.nativeElement.clientWidth + 2;
        const p = (this.active / (this.ticks.length - 1)) * 100;
        this.track.nativeElement.style.background = `linear-gradient(90deg, #f8a403 0%, #f8a403 ${p}%, rgba(0, 0, 0, 0) ${p}%, rgba(0, 0, 0, 0) 100%)`;
        this.handle.nativeElement.style.left = `${(this.active / (this.ticks.length - 1)) * width  - 10}px`; 
    }

    private update() {
        // this.value = this.tickValues[this.active];
        this.value = 100 - Math.round((this.handle.nativeElement.offsetTop / this.track.nativeElement.clientHeight) * 100);
        this.valueChange.next(this.value);
    }
}
