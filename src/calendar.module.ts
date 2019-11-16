import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeekViewComponent } from './weekview';
import { CalendarComponent } from './calendar';
import { initPositionScrollComponent } from './init-position-scroll';

@NgModule({
    declarations: [
        WeekViewComponent, CalendarComponent, initPositionScrollComponent
    ],
    imports: [IonicModule, CommonModule],
    exports: [CalendarComponent],
    entryComponents: [CalendarComponent]
})
export class NgCalendarModule {}
