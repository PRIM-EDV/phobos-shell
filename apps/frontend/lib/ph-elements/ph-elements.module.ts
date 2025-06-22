import { NgModule } from '@angular/core';
import { PhWindowComponent } from './ph-window/ph-window.component';
import { PhButtonSelectComponent } from './ph-button-select/ph-button-select.component';
import { PhSidebarComponent } from './ph-sidebar/ph-sidebar.component';
import { PhTopbarComponent } from './ph-topbar/ph-topbar.component';
import { PhFormComponent } from './ph-form/ph-form.component';
import { PhInputComponent } from './ph-input/ph-input.component';
import { PhButtonComponent } from './ph-button/ph-button.component';
import { PhCommandListComponent } from './ph-command-list/ph-command-list.component';
import { PhButtonListComponent } from './ph-button-list/ph-button-list.component';
import { PhTableComponent } from './ph-table/ph-table.component';
import { PhContextMenuComponent } from './ph-context-menu/ph-context-menu.component';
import { PhContextMenuItemComponent } from './ph-context-menu-item/ph-context-menu-item.component';
import { PhSliderComponent } from './ph-slider/ph-slider.component';
import { PhDropdownComponent } from './ph-dropdown/ph-dropdown.component';
import { PhDropdownItemComponent } from './ph-dropdown-item/ph-dropdown-item.component';
import { PhSidebarItemComponent } from './ph-sidebar-item/ph-sidebar-item.component';
import { PhTopbarItemComponent } from './ph-topbar-item/ph-topbar-item.component';
import { PhTopbarHeaderComponent } from './ph-topbar-header/ph-topbar-header.component';
import { PhDropAreaComponent } from './ph-drop-area/ph-drop-area.component';
import { PhDropListComponent } from './ph-drop-list/ph-drop-list.component';
import { PhDropListItemComponent } from './ph-drop-list-item/ph-drop-list-item.component';
import { CommonModule } from '@angular/common';
import { PhSliderVerticalComponent } from './ph-slider-vertical/ph-slider-vertical.component';

import { PhGroupComponent } from './ph-group/ph-group.component';
import { PhErrorComponent } from './ph-error/ph-error.component';
@NgModule({
  declarations: [
    PhGroupComponent,
    PhWindowComponent,
    PhButtonSelectComponent,
    PhSidebarComponent,
    PhTopbarComponent,
    PhFormComponent,
    PhInputComponent,
    PhButtonComponent,
    PhCommandListComponent,
    PhButtonListComponent,
    PhTableComponent,
    PhContextMenuComponent,
    PhContextMenuItemComponent,
    PhSliderComponent,
    PhSliderVerticalComponent,
    PhDropdownComponent,
    PhDropdownItemComponent,
    PhSidebarItemComponent,
    PhTopbarItemComponent,
    PhTopbarHeaderComponent,
    PhDropAreaComponent,
    PhDropListComponent,
    PhDropListItemComponent,
    PhErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhGroupComponent,
    PhWindowComponent,
    PhSidebarComponent,
    PhTopbarComponent,
    PhFormComponent,
    PhButtonListComponent,
    PhButtonSelectComponent,
    PhButtonComponent,
    PhInputComponent,
    PhCommandListComponent,
    PhTableComponent,
    PhContextMenuComponent,
    PhContextMenuItemComponent,
    PhSliderComponent,
    PhSliderVerticalComponent,
    PhDropdownComponent,
    PhDropdownItemComponent,
    PhSidebarItemComponent,
    PhTopbarItemComponent,
    PhTopbarHeaderComponent,
    PhDropAreaComponent,
    PhDropListComponent,
    PhDropListItemComponent,
    PhErrorComponent
  ],
  providers: [],
  bootstrap: []
})
export class PhElementsModule { }
