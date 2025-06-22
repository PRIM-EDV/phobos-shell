import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "ph-drop-list-item",
    standalone: false,
    styleUrls: ["./ph-drop-list-item.component.scss"],
    templateUrl: "./ph-drop-list-item.component.html"
})
export class PhDropListItemComponent implements OnInit {

    @Input() data: any;

    public index: number = 0;
    public draggedItem: any;
    public dropOver: boolean = false;   

    public onDragStart: Subject<any> = new Subject<any>();
    public onDragStop: Subject<any> = new Subject<any>();
    public onDragOver: Subject<any> = new Subject<any>();

    private dragStartCoursor = { x: 0, y: 0 };
    private dragStartElement = { x: 0, y: 0 };
    private zIndex = 0;

    constructor(public ref: ElementRef) {
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
    }

    ngOnInit(): void {}

    handleDragStart(ev: MouseEvent) {
        ev.preventDefault();

        if (ev.button != 0) {
            return;
        }

        this.onDragStart.next(this.data);

        const rect = this.ref.nativeElement.getBoundingClientRect();
        this.dragStartCoursor = { x: ev.x, y: ev.y };
        this.dragStartElement = {
            x: this.ref.nativeElement.offsetLeft,
            y: this.ref.nativeElement.offsetTop,
        };

        this.zIndex = this.ref.nativeElement.style.zIndex;

        this.ref.nativeElement.style.position = "absolute";
        this.ref.nativeElement.style.width = `${rect.width}px`;
        this.ref.nativeElement.style.height = `${rect.height}px`;
        this.ref.nativeElement.style.pointerEvents = "none";
        this.ref.nativeElement.style.left = `${ this.dragStartElement.x + ev.x - this.dragStartCoursor.x}px`;
        this.ref.nativeElement.style.top = `${this.dragStartElement.y + ev.y - this.dragStartCoursor.y}px`;
        this.ref.nativeElement.style.zIndex = "1000";

        window.addEventListener("mousemove", this.handleDrag);
        window.addEventListener("mouseup", this.handleDragStop);
    }

    handleDrag(ev: MouseEvent) {
        ev.preventDefault();

        this.ref.nativeElement.style.left = `${ this.dragStartElement.x + ev.x - this.dragStartCoursor.x}px`;
        this.ref.nativeElement.style.top = `${this.dragStartElement.y + ev.y - this.dragStartCoursor.y}px`;
    }

    handleDragStop() {
        window.removeEventListener("mousemove", this.handleDrag);
        window.removeEventListener("mouseup", this.handleDragStop);

        this.onDragStop.next(this.data);

        this.ref.nativeElement.style.position = null;
        this.ref.nativeElement.style.width = null;
        this.ref.nativeElement.style.height = null;
        this.ref.nativeElement.style.left = null;
        this.ref.nativeElement.style.top = null;
        this.ref.nativeElement.style.pointerEvents = null;
        this.ref.nativeElement.style.zIndex = this.zIndex;
    }

  handleDropOver(ev: MouseEvent) {
    if (this.draggedItem !== undefined) {
        this.dropOver = true;
        this.onDragOver.next(this);
    }
  }

  handleDropLeave(ev: MouseEvent) {
    this.dropOver = false;
  }
}
