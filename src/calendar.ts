import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, Inject, LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';

import { CalendarService } from './calendar.service';

export interface IBooking {
    endDate: Date;
    startDate: Date;
    title: string;
    room: number;
    phone: string;
}

export interface IRange {
    startTime: Date;
    endTime: Date;
}

export interface IView {
}

export interface IWeekView extends IView {
    roomData: IWeekViewRow[][];
    dayHeaderRow: IWeekViewDayHeaderRow[];
}

export interface IWeekViewDayHeaderRow {
    date: Date;
    dayHeaderString: string;
}

export interface IWeekViewRow {
    roomEvents: IDisplayBooking[];
    roomName: string;
}

export interface IDisplayBooking {
    startedPreviousWeek: boolean
    event: IBooking;
    days: number;
}

export interface IDisplayWeekViewHeader {
    viewDate: IWeekViewDayHeaderRow;
}

export interface ICalendarComponent {
    currentViewIndex: number;
    direction: number;
    bookingsSource: IBooking[];
    getRange: { (date:Date): IRange; };
    getViewData: { (date:Date): IView };
    mode: CalendarMode;
    range: IRange;
    views: IView[];
    onDataLoaded: { (): void };
    onRangeChanged: EventEmitter<IRange>;
}

export interface ITimeSelected {
    events: IBooking[];
    selectedTime: Date;
    disabled: boolean;
}

export interface IWeekViewNormalEventSectionTemplateContext {
    roomDayData: IWeekViewRow,
    eventTemplate: TemplateRef<IBooking>
}

export interface IDateFormatter {
    formatWeekViewDayHeader?: { (date:Date): string; };
    formatWeekViewTitle?: { (date:Date): string; };
    formatWeekViewHourColumn?: { (date:Date): string; };
}

export type CalendarMode = 'week';

export type QueryMode = 'local' | 'remote';

export enum Step {
    QuarterHour = 15,
    HalfHour = 30,
    Hour = 60
}

@Component({
    selector: 'calendar',
    template: `
        <ng-template #defaultWeekviewHeaderTemplate let-dayHeader="dayHeader"> 
            {{ dayHeader.dayHeaderString }} 
        </ng-template>
        
        <ng-template #defaultNormalEventTemplate let-booking="booking">
            <div class="calendar-event-inner" [ngStyle]="{ 'background-color' : getBackgroundColor(booking.event.status), 'color' : getTextColor(booking.event.status) }">{{booking.event.title}}<br>{{booking.event.phone}}</div>
        </ng-template>
        
        <ng-template #defaultNormalEventSectionTemplate let-roomDayData="roomDayData" let-eventTemplate="eventTemplate">
            <div [ngClass]="{'calendar-event-wrap': roomDayData.roomEvents}" *ngIf="roomDayData.roomEvents" style="height: 100%">
                <div *ngFor="let displayBooking of roomDayData.roomEvents" class="calendar-event-wrap" tappable (click)="eventSelected(displayBooking.event)"
                     [ngStyle]="{'width': displayBooking.startedPreviousWeek ? 50 + (displayBooking.days - 1) * 100 + '%' : 100 + (displayBooking.days - 2) * 100 + '%',
                                 'height': '100%',
                                 'margin-left': displayBooking.startedPreviousWeek ? '0%' : '50%'}">
                    <ng-template [ngTemplateOutlet]="eventTemplate"
                                 [ngTemplateOutletContext]="{booking:displayBooking}"></ng-template>
                </div>
            </div>
        </ng-template>
        
        <div class="weekview-container">
            <weekview [formatWeekTitle]="formatWeekTitle"
                      [formatWeekViewDayHeader]="formatWeekViewDayHeader" [formatHourColumn]="formatHourColumn"
                      [startingDayWeek]="startingDayWeek" [autoSelect]="autoSelect" [bookingsSource]="bookingsSource"
                      [roomNamesSource]="roomNamesSource"
                      [weekviewHeaderTemplate]="weekviewHeaderTemplate||defaultWeekviewHeaderTemplate"
                      [weekviewNormalEventTemplate]="weekviewNormalEventTemplate||defaultNormalEventTemplate"
                      [weekviewNormalEventSectionTemplate]="weekviewNormalEventSectionTemplate||defaultNormalEventSectionTemplate"
                      [locale]="locale" [dateFormatter]="dateFormatter" [startHour]="startHour" [endHour]="endHour" (onRangeChanged)="rangeChanged($event)"
                      (onEventSelected)="eventSelected($event)"
                      (onTitleChanged)="titleChanged($event)">
            </weekview>
        </div>`,
    styles: [`
        :host > div { height: 100%; }

        .calendar-event-inner {
          overflow: hidden;
          background-color: #3a87ad;
          color: white;
          height: 100%;
          width: 100%;
          padding: 2px;
          line-height: 15px;
          text-align: initial;
        }

        @media (max-width: 750px) {
          .calendar-event-inner {
            font-size: 12px;
          }
        }
    `],
    providers: [CalendarService]
})
export class CalendarComponent implements OnInit {
    @Input()
    get currentDate():Date {
        return this._currentDate;
    }

    set currentDate(val:Date) {
        if (!val) {
            val = new Date();
        }

        this._currentDate = val;
        this.calendarService.setCurrentDate(val, true);
        this.onCurrentDateChanged.emit(this._currentDate);
    }

    @Input() bookingsSource:IBooking[] = [];
    @Input() roomNamesSource: string[] = [];
    @Input() calendarMode:CalendarMode = 'week';
    @Input() formatWeekTitle:string = 'MMMM yyyy, \'Week\' w';
    @Input() formatWeekViewDayHeader:string = 'EEE d';
    @Input() formatHourColumn:string = 'ha';
    @Input() startingDayWeek:number = 0;
    @Input() queryMode:QueryMode = 'local';
    @Input() step:Step = Step.Hour;
    @Input() timeInterval:number = 60;
    @Input() autoSelect:boolean = true;
    @Input() weekviewHeaderTemplate:TemplateRef<IDisplayWeekViewHeader>;
    @Input() weekviewNormalEventTemplate:TemplateRef<IDisplayBooking>;
    @Input() weekviewNormalEventSectionTemplate:TemplateRef<IWeekViewNormalEventSectionTemplateContext>;
    @Input() dateFormatter:IDateFormatter;
    @Input() locale:string = "";
    @Input() startHour:number = 0;
    @Input() endHour:number = 24;

    @Output() onCurrentDateChanged = new EventEmitter<Date>();
    @Output() onRangeChanged = new EventEmitter<IRange>();
    @Output() onEventSelected = new EventEmitter<IBooking>();
    @Output() onTitleChanged = new EventEmitter<string>();

    private _currentDate:Date;
    private currentDateChangedFromChildrenSubscription:Subscription;

    constructor(private calendarService:CalendarService, @Inject(LOCALE_ID) private appLocale:string) {
        this.locale = appLocale;
    }

    ngOnInit() {
        if (this.autoSelect) {
            if (this.autoSelect.toString() === 'false') {
                this.autoSelect = false;
            } else {
                this.autoSelect = true;
            }
        }
        this.startHour = parseInt(this.startHour.toString());
        this.endHour = parseInt(this.endHour.toString());
        this.calendarService.queryMode = this.queryMode;

        this.currentDateChangedFromChildrenSubscription = this.calendarService.currentDateChangedFromChildren$.subscribe(currentDate => {
            this._currentDate = currentDate;
            this.onCurrentDateChanged.emit(currentDate);
        });
    }

    ngOnDestroy() {
        if (this.currentDateChangedFromChildrenSubscription) {
            this.currentDateChangedFromChildrenSubscription.unsubscribe();
            this.currentDateChangedFromChildrenSubscription = null;
        }
    }

    rangeChanged(range:IRange) {
        this.onRangeChanged.emit(range);
    }

    eventSelected(event:IBooking) {
        this.onEventSelected.emit(event);
    }

    titleChanged(title:string) {
        this.onTitleChanged.emit(title);
    }

    loadEvents() {
        this.calendarService.loadEvents();
    }

    getBackgroundColor(status: string) {
        let statusInt = parseInt(status) || status;
        if (statusInt == 0) {
            return '#d50000'
        } else if (statusInt == 1) {
            return '#ffd600'
        } else {
            return '#00c853'
        }
    }

    getTextColor(status: string) {
        let statusInt = parseInt(status) || status;
        if (statusInt == 0) {
            return '#ffffff'
        } else if (statusInt == 1) {
            return '#000000'
        } else {
            return '#000000'
        }
    }
}
