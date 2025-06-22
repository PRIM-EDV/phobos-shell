import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'ph-slider',
  standalone: false,
  styleUrls: ['./ph-slider.component.scss'],
  templateUrl: './ph-slider.component.html'
})
export class PhSliderComponent implements OnChanges, AfterViewInit  {
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
    }

    ngAfterViewInit(): void {
        this.setTick();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.active = this.tickValues.indexOf(this.value);
        if(this.track) {
            this.setTick();
        }
    }

    onDragStart(idx: number) {
        this.dragged = true;
        this.active = idx;
        console.log("Drag")
        this.update();
        this.setTick();
    }

    onDrag(e: MouseEvent) {
        if (this.dragged) {
            const width = this.track.nativeElement.clientWidth;
            const rect = this.track.nativeElement.getBoundingClientRect();
            const p =  ((e.x - rect.left) / width) * 100;

            this.active = Math.round(((e.x - rect.left) / width) * (this.ticks.length - 1));
            this.track.nativeElement.style.background = `linear-gradient(90deg, #f8a403 0%, #f8a403 ${p}%, rgba(0, 0, 0, 0) ${p}%, rgba(0, 0, 0, 0) 100%)`;
            this.handle.nativeElement.style.left = `${Math.max(Math.min((e.x - rect.left) - 10, width - 8), -10) }px`; 
        }
    }

    onDragEnd() {
        if (this.dragged) {
            this.update();
            this.setTick();
        }
        this.dragged = false;

    }

    setTick() {
        const width = this.track.nativeElement.clientWidth + 2;
        const p = (this.active / (this.ticks.length - 1)) * 100;
        this.track.nativeElement.style.background = `linear-gradient(90deg, #f8a403 0%, #f8a403 ${p}%, rgba(0, 0, 0, 0) ${p}%, rgba(0, 0, 0, 0) 100%)`;
        this.handle.nativeElement.style.left = `${(this.active / (this.ticks.length - 1)) * width  - 10}px`; 
        console.log(`${(this.active / (this.ticks.length - 1)) * width  - 10}px`);
    }

    private update() {
        this.value = this.tickValues[this.active];
        this.valueChange.next(this.value);
    }
}
