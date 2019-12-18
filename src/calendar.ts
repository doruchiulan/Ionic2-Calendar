import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, Inject, LOCALE_ID, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {CalendarService} from './calendar.service';

export interface IBooking {
    endDate: Date;
    startDate: Date;
    name: string;
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
    getRange: { (date: Date): IRange; };
    getViewData: { (date: Date): IView };
    mode: CalendarMode;
    range: IRange;
    views: IView[];
    onDataLoaded: { (): void };
    onRangeChanged: EventEmitter<IRange>;
}

export interface IWeekViewNormalEventSectionTemplateContext {
    roomDayData: IWeekViewRow,
    dayIndex: number,
    eventTemplate: TemplateRef<IBooking>
}

export interface IDateFormatter {
    formatWeekViewDayHeader?: { (date: Date): string; };
    formatWeekViewTitle?: { (date: Date): string; };
}

export type CalendarMode = 'week';

export type QueryMode = 'local' | 'remote';

export enum Step {
    Hour = 60
}

@Component({
    selector: 'calendar',
    template: `
        <ng-template #defaultWeekviewHeaderTemplate let-dayHeader="dayHeader">
            {{ dayHeader["dayHeaderString"] }}
        </ng-template>

        <ng-template #defaultNormalEventTemplate let-booking="booking">
            <div class="calendar-event-inner"
                 [ngStyle]="{ 'background-color' : getBackgroundColor(booking.event.status), 'color' : getTextColor(booking.event.status) }">{{booking.event.name}}
                <br>{{booking.event.phone}}</div>
        </ng-template>

        <ng-template #defaultNormalEventSectionTemplate let-roomDayData="roomDayData" let-dayIndex="dayIndex"
                     let-eventTemplate="eventTemplate">
            <div [ngClass]="{'calendar-event-wrap': roomDayData['roomEvents']}" *ngIf="roomDayData['roomEvents']"
                 style="height: 100%">
                <div *ngFor="let displayBooking of roomDayData['roomEvents']" class="calendar-event-wrap" tappable
                     (click)="eventSelected(displayBooking.event)"
                     [ngStyle]="{'width': getEventWidth(displayBooking, dayIndex),
                                 'height': '100%',
                                 'margin-left': displayBooking['startedPreviousWeek'] ? '0%' : '50%'}">
                    <ng-template [ngTemplateOutlet]="eventTemplate"
                                 [ngTemplateOutletContext]="{booking:displayBooking}"></ng-template>
                </div>
            </div>
        </ng-template>

        <div class="weekview-container">
            <weekview [formatViewTitle]="formatWeekTitle"
                      [formatWeekViewDayHeader]="formatWeekViewDayHeader"
                      [bookingsSource]="bookingsSource"
                      [roomNamesSource]="roomNamesSource"
                      [weekviewHeaderTemplate]="weekviewHeaderTemplate||defaultWeekviewHeaderTemplate"
                      [weekviewNormalEventTemplate]="weekviewNormalEventTemplate||defaultNormalEventTemplate"
                      [weekviewNormalEventSectionTemplate]="weekviewNormalEventSectionTemplate||defaultNormalEventSectionTemplate"
                      [locale]="locale"
                      [dateFormatter]="dateFormatter"
                      (onRangeChanged)="rangeChanged($event)"
                      (onEventSelected)="eventSelected($event)"
                      (onTitleChanged)="titleChanged($event)">
            </weekview>
        </div>`,
    styles: [`
        :host > div {
            height: 100%;
        }

        .calendar-event-inner {
            overflow: hidden;
            background-color: #3a87ad;
            color: white;
            height: 100%;
            width: 100%;
            padding: 2px;
            line-height: 15px;
            text-align: center;
            text-overflow: ellipsis;
        }

        @media (max-width: 750px) {
            .calendar-event-inner {
                font-size: 12px;
            }
        }
    `],
    providers: [CalendarService]
})
export class CalendarComponent implements OnInit, OnDestroy {
    @Input()
    get currentDate(): Date {
        return this._currentDate;
    }

    set currentDate(val: Date) {
        if (!val) {
            val = new Date();
        }

        this._currentDate = val;
        this.calendarService.setCurrentDate(val, true);
        this.onCurrentDateChanged.emit(this._currentDate);
    }

    @Input() bookingsSource: IBooking[] = [];
    @Input() roomNamesSource: string[] = [];
    @Input() calendarMode: CalendarMode = 'week';
    @Input() formatWeekTitle: string = 'MMMM yyyy, \'Saptamana\' w';
    @Input() formatWeekViewDayHeader: string = 'EEE d';
    @Input() step: Step = Step.Hour;
    @Input() weekviewHeaderTemplate: TemplateRef<IDisplayWeekViewHeader>;
    @Input() weekviewNormalEventTemplate: TemplateRef<IDisplayBooking>;
    @Input() weekviewNormalEventSectionTemplate: TemplateRef<IWeekViewNormalEventSectionTemplateContext>;
    @Input() dateFormatter: IDateFormatter;
    @Input() locale: string = "";

    @Output() onCurrentDateChanged = new EventEmitter<Date>();
    @Output() onRangeChanged = new EventEmitter<IRange>();
    @Output() onEventSelected = new EventEmitter<IBooking>();
    @Output() onTitleChanged = new EventEmitter<string>();

    private _currentDate: Date;
    private currentDateChangedFromChildrenSubscription: Subscription;

    constructor(private calendarService: CalendarService, @Inject(LOCALE_ID) private appLocale: string) {
        this.locale = appLocale;
    }

    ngOnInit() {
        this.calendarService.queryMode = 'local';

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

    rangeChanged(range: IRange) {
        this.onRangeChanged.emit(range);
    }

    eventSelected(event: IBooking) {
        this.onEventSelected.emit(event);
    }

    titleChanged(title: string) {
        this.onTitleChanged.emit(title);
    }

    loadEvents = () => {
        this.calendarService.loadEvents();
    };

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

    getEventWidth(displayBooking: IDisplayBooking, dayIndex: number) {
        let eventWidth = 0;
        if (displayBooking.startedPreviousWeek) {
            eventWidth = 50 + (displayBooking.days - 1) * 100
        } else {
            eventWidth = 100 + (displayBooking.days - 2) * 100

            switch (dayIndex) {
                case 0:
                    eventWidth = eventWidth > 700 ? 700 : eventWidth;
                    break;
                case 1:
                    eventWidth = eventWidth > 550 ? 700 : eventWidth;
                    break;
                case 2:
                    eventWidth = eventWidth > 450 ? 700 : eventWidth;
                    break;
                case 3:
                    eventWidth = eventWidth > 350 ? 700 : eventWidth;
                    break;
                case 4:
                    eventWidth = eventWidth > 250 ? 700 : eventWidth;
                    break;
                case 5:
                    eventWidth = eventWidth > 150 ? 150 : eventWidth;
                    break;
                case 6:
                    eventWidth = eventWidth > 50 ? 50 : eventWidth;
                    break;
            }


        }

        return eventWidth + "%";
    }
}
