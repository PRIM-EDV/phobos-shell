import { AfterContentInit, Component, ContentChildren, EventEmitter, HostListener, Input, OnInit, Output, QueryList } from '@angular/core';
import { PhDropListItemComponent } from '../ph-drop-list-item/ph-drop-list-item.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ph-drop-list',
    standalone: false,
    styleUrls: ['./ph-drop-list.component.scss'],
    templateUrl: './ph-drop-list.component.html'
})
export class PhDropListComponent implements OnInit, AfterContentInit {

    @Input() header: string = '';
    @Input() connectedLists: Array<PhDropListComponent> = [];
    @Output() drop: EventEmitter<any> = new EventEmitter<any>();
    @ContentChildren(PhDropListItemComponent) itemComponents!: QueryList<PhDropListItemComponent>;

    public draggedItem: any;

    private dropIndex = 0;
    private subscriptions: Array<Subscription> = [];

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {
        this.itemComponents.forEach((itemComponent: PhDropListItemComponent, index: number) => {
            const dragStartsub = itemComponent.onDragStart.subscribe((item: any) => {this.setDraggedItem(item)}) as Subscription;
            const dragStopsub = itemComponent.onDragStop.subscribe((item: any) => {this.resetDraggedItem();}) as Subscription;
            const dragOverSub = itemComponent.onDragOver.subscribe((item: any) => {this.dropIndex = itemComponent.index;}) as Subscription;

            this.subscriptions.push(dragStartsub);
            this.subscriptions.push(dragStopsub);
            this.subscriptions.push(dragOverSub);

            itemComponent.index = index;
        });

        this.itemComponents.changes.subscribe((changes) => {
            this.clearSubscriptions();

            changes.forEach((change : any, index: number) => {
                const dragStartsub = change.onDragStart.subscribe((item: any) => {this.setDraggedItem(item)}) as Subscription;
                const dragStopsub = change.onDragStop.subscribe((item: any) => {this.resetDraggedItem();}) as Subscription;
                const dragOverSub = change.onDragOver.subscribe((item: any) => {this.dropIndex = change.index;}) as Subscription;

                this.subscriptions.push(dragStartsub);
                this.subscriptions.push(dragStopsub);
                this.subscriptions.push(dragOverSub);
                change.index = index;
            });
        });
    }

    public handleMouseOver(ev: MouseEvent) {

    }

    public handleMouseOut(ev: MouseEvent) {
        this.dropIndex = this.itemComponents.length;
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        if (this.draggedItem != undefined) {
            this.drop.next({index: this.dropIndex, data: this.draggedItem});
        }
        this.resetDraggedItem();
    }

    private clearSubscriptions() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.subscriptions = [];
    }

    private setDraggedItem(item: any) {
        for (const list of this.connectedLists) {
            list.draggedItem = item;
            list.itemComponents.forEach((itemComponent: PhDropListItemComponent) => {
                itemComponent.draggedItem = item;
            });
        }
    }

    private resetDraggedItem() {
        for (const list of this.connectedLists) {
            list.draggedItem = undefined;
            list.itemComponents.forEach((itemComponent: PhDropListItemComponent) => {
                itemComponent.draggedItem = undefined;
            });
        }
    }
}
