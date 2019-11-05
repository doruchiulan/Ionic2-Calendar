import { DatePipe } from '@angular/common';
import { IonSlides } from '@ionic/angular';
import { Component, OnInit, OnChanges, HostBinding, Input, Output, EventEmitter, SimpleChanges, ViewChild, ViewEncapsulation, TemplateRef, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ICalendarComponent, IDisplayEvent, IEvent, ITimeSelected, IRange, IWeekView, IWeekViewRow, IWeekViewDateRow, CalendarMode, IDateFormatter, IDisplayWeekViewHeader } from './calendar';
import { CalendarService } from './calendar.service';
import { IWeekViewNormalEventSectionTemplateContext } from "./calendar";

@Component({
    selector: 'weekview',
    template: `
        <ion-slides #weekSlider [options]="sliderOptions" [dir]="dir" (ionSlideDidChange)="onSlideChanged()" class="slides-container">
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column"></th>
                        
                    </tr>
                    </thead>
                </table>
                <div *ngIf="0===currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[0].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of room" class="calendar-cell" tappable (click)="select(roomDay.time, roomDay.roomEvents)">
                                    <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="0!==currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[0].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of row" class="calendar-cell">
                                    <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column">Camera</th>
                    </tr>
                    </thead>
                </table>
                <div *ngIf="1===currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[1].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of room" class="calendar-cell" tappable (click)="select(roomDay.time, roomDay.roomEvents)">
                                    <div [ngClass]="{'calendar-event-wrap': roomDay.roomEvents}" *ngIf="roomDay.roomEvents">
                                        <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="1!==currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[0].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of room" class="calendar-cell">
                                    <div [ngClass]="{'calendar-event-wrap': roomDay.roomEvents}" *ngIf="roomDay.roomEvents">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column"></th>
                    </tr>
                    </thead>
                </table>
                <div *ngIf="2===currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[2].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of row" class="calendar-cell" tappable (click)="select(roomDay.time, roomDay.roomEvents)">
                                    <div [ngClass]="{'calendar-event-wrap': tm.roomEvents}" *ngIf="tm.roomEvents">
                                        <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="2!==currentViewIndex">
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let room of views[2].rooms; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{roomLabels[i]}}
                                </td>
                                <td *ngFor="let roomDay of row" class="calendar-cell">
                                    <div [ngClass]="{'calendar-event-wrap': roomDay.roomEvents}" *ngIf="roomDay.roomEvents">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:roomDay, hourParts: hourParts}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
        </ion-slides>
    `,
    styles: [`
        .table-fixed {
          table-layout: fixed;
        }

        .table {
          width: 100%;
          max-width: 100%;
          background-color: transparent;
        }

        .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td,
        .table > tbody > tr > td, .table > tfoot > tr > td {
          padding: 8px;
          line-height: 20px;
          vertical-align: top;
        }

        .table > thead > tr > th {
          vertical-align: bottom;
          border-bottom: 2px solid #ddd;
        }

        .table > thead:first-child > tr:first-child > th, .table > thead:first-child > tr:first-child > td {
          border-top: 0
        }

        .table > tbody + tbody {
          border-top: 2px solid #ddd;
        }

        .table-bordered {
          border: 1px solid #ddd;
        }

        .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th,
        .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
          border: 1px solid #ddd;
        }

        .table-bordered > thead > tr > th, .table-bordered > thead > tr > td {
          border-bottom-width: 2px;
        }

        .table-striped > tbody > tr:nth-child(odd) > td, .table-striped > tbody > tr:nth-child(odd) > th {
          background-color: #f9f9f9
        }

        .calendar-hour-column {
          width: 100px;
          white-space: nowrap;
        }

        .calendar-event-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .calendar-event {
          position: absolute;
          padding: 2px;
          cursor: pointer;
          z-index: 10000;
          height: 100%;
          position: relative;
        }

        .calendar-cell {
          padding: 0 !important;
          height: 37px;
        }
        
        .slides-container {
            height: 100%;
        }
        
        .slide-container {
            display: block;
        }

        .weekview-header th {
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
        }

        .weekview-normal-event-container {
          margin-top: 38px;
          overflow: hidden;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          position: absolute;
          font-size: 14px;
        }

        .scroll-content {
            overflow-y: auto;
            overflow-x: hidden;
        }
        
        ::-webkit-scrollbar,
        *::-webkit-scrollbar {
            display: none;
        }

        .table > tbody > tr > td.calendar-hour-column {
          padding-left: 0;
          padding-right: 0;
          vertical-align: middle;
        }

        @media (max-width: 750px) {
          .table > tbody > tr > td.calendar-hour-column {
            padding-left: 0;
            padding-right: 0;
            vertical-align: middle;
            line-height: 12px;
          }

          .table > thead > tr > th.weekview-header {
            padding-left: 0;
            padding-right: 0;
            font-size: 12px;
          }
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class WeekViewComponent implements ICalendarComponent, OnInit, OnChanges {
    @ViewChild('weekSlider') slider:IonSlides;
    @HostBinding('class.weekview') class = true;

    @Input() weekviewHeaderTemplate:TemplateRef<IDisplayWeekViewHeader>;
    @Input() weekviewNormalEventTemplate:TemplateRef<IDisplayEvent>;
    @Input() weekviewNormalEventSectionTemplate:TemplateRef<IWeekViewNormalEventSectionTemplateContext>;
    @Input() weekviewInactiveNormalEventSectionTemplate:TemplateRef<IWeekViewNormalEventSectionTemplateContext>;

    @Input() formatWeekTitle:string;
    @Input() formatWeekViewDayHeader:string;
    @Input() formatHourColumn:string;
    @Input() startingDayWeek:number;
    @Input() roomSource: string[];
    @Input() hourParts:number;
    @Input() eventSource:IEvent[];
    @Input() autoSelect:boolean = true;
    @Input() markDisabled:(date:Date) => boolean;
    @Input() locale:string;
    @Input() dateFormatter:IDateFormatter;
    @Input() dir:string = "";
    @Input() scrollToHour:number = 0;
    @Input() preserveScrollPosition:boolean;
    @Input() lockSwipeToPrev:boolean;
    @Input() lockSwipes:boolean;
    @Input() startHour:number;
    @Input() endHour:number;
    @Input() sliderOptions:any;
    @Input() hourSegments:number;

    @Output() onRangeChanged = new EventEmitter<IRange>();
    @Output() onEventSelected = new EventEmitter<IEvent>();
    @Output() onTimeSelected = new EventEmitter<ITimeSelected>();
    @Output() onTitleChanged = new EventEmitter<string>(true);

    public views:IWeekView[] = [];
    public currentViewIndex = 0;
    public range:IRange;
    public direction = 0;
    public mode:CalendarMode = 'week';

    private inited = false;
    private callbackOnInit = true;
    private currentDateChangedFromParentSubscription:Subscription;
    private eventSourceChangedSubscription:Subscription;
    public roomLabels:string[];
    public initScrollPosition:number;
    private formatDayHeader:(date:Date) => string;
    private formatTitle:(date:Date) => string;
    private formatHourColumnLabel:(date:Date) => string;
    private hourRange:number;

    constructor(private calendarService:CalendarService, private elm:ElementRef) {
    }

    ngOnInit() {
        if(!this.sliderOptions) {
            this.sliderOptions = {};
        }
        this.sliderOptions.loop = true;

        this.hourRange = (this.endHour - this.startHour) * this.hourSegments;
        if (this.dateFormatter && this.dateFormatter.formatWeekViewDayHeader) {
            this.formatDayHeader = this.dateFormatter.formatWeekViewDayHeader;
        } else {
            let datePipe = new DatePipe(this.locale);
            this.formatDayHeader = function (date:Date) {
                return datePipe.transform(date, this.formatWeekViewDayHeader);
            };
        }

        if (this.dateFormatter && this.dateFormatter.formatWeekViewTitle) {
            this.formatTitle = this.dateFormatter.formatWeekViewTitle;
        } else {
            let datePipe = new DatePipe(this.locale);
            this.formatTitle = function (date:Date) {
                return datePipe.transform(date, this.formatWeekTitle);
            };
        }

        if (this.dateFormatter && this.dateFormatter.formatWeekViewHourColumn) {
            this.formatHourColumnLabel = this.dateFormatter.formatWeekViewHourColumn;
        } else {
            let datePipe = new DatePipe(this.locale);
            this.formatHourColumnLabel = function (date:Date) {
                return datePipe.transform(date, this.formatHourColumn);
            };
        }

        if (this.lockSwipeToPrev) {
            this.slider.lockSwipeToPrev(true);
        }

        if (this.lockSwipes) {
            this.slider.lockSwipes(true);
        }

        this.refreshView();
        this.roomLabels = this.getRoomLabels();
        this.inited = true;

        this.currentDateChangedFromParentSubscription = this.calendarService.currentDateChangedFromParent$.subscribe(currentDate => {
            this.refreshView();
        });

        this.eventSourceChangedSubscription = this.calendarService.eventSourceChanged$.subscribe(() => {
            this.onDataLoaded();
        });
    }

    ngAfterViewInit() {
        let title = this.getTitle();
        this.onTitleChanged.emit(title);

        if (this.scrollToHour > 0) {
            let hourColumns = this.elm.nativeElement.querySelector('.weekview-normal-event-container').querySelectorAll('.calendar-hour-column');
            let me = this;
            setTimeout(function () {
                me.initScrollPosition = hourColumns[me.scrollToHour - me.startHour].offsetTop;
            }, 50);
        }
    }

    ngOnChanges(changes:SimpleChanges) {
        if (!this.inited) return;

        let eventSourceChange = changes['eventSource'];
        if (eventSourceChange && eventSourceChange.currentValue) {
            this.onDataLoaded();
        }

        let lockSwipeToPrev = changes['lockSwipeToPrev'];
        if (lockSwipeToPrev) {
            this.slider.lockSwipeToPrev(lockSwipeToPrev.currentValue);
        }

        let lockSwipes = changes['lockSwipes'];
        if (lockSwipes) {
            this.slider.lockSwipes(lockSwipes.currentValue);
        }
    }

    ngOnDestroy() {
        if (this.currentDateChangedFromParentSubscription) {
            this.currentDateChangedFromParentSubscription.unsubscribe();
            this.currentDateChangedFromParentSubscription = null;
        }

        if (this.eventSourceChangedSubscription) {
            this.eventSourceChangedSubscription.unsubscribe();
            this.eventSourceChangedSubscription = null;
        }
    }

    onSlideChanged() {
        if (this.callbackOnInit) {
            this.callbackOnInit = false;
            return;
        }

        let currentSlideIndex = this.slider.getActiveIndex(),
            direction = 0,
            currentViewIndex = this.currentViewIndex;

        this.slider.getActiveIndex().then((currentSlideIndex) => {
            currentSlideIndex = (currentSlideIndex + 2) % 3;
            if (currentSlideIndex - currentViewIndex === 1) {
                direction = 1;
            } else if (currentSlideIndex === 0 && currentViewIndex === 2) {
                direction = 1;
                this.slider.slideTo(1, 0, false);
            } else if (currentViewIndex - currentSlideIndex === 1) {
                direction = -1;
            } else if (currentSlideIndex === 2 && currentViewIndex === 0) {
                direction = -1;
                this.slider.slideTo(3, 0, false);
            }
            this.currentViewIndex = currentSlideIndex;
            this.move(direction);
        });
    }

    move(direction:number) {
        if (direction === 0) {
            return;
        }
        this.direction = direction;
        let adjacent = this.calendarService.getAdjacentCalendarDate(this.mode, direction);
        this.calendarService.setCurrentDate(adjacent);
        this.refreshView();
        this.direction = 0;
    }

    static createWeekRooms(rooms: string[]):IWeekViewRow[][] {
        let roomsFilled:IWeekViewRow[][] = [];

        for (let roomIdx = 0; roomIdx < rooms.length; roomIdx += 1) {
            let row:IWeekViewRow[] = [];
            for (let day = 0; day < 7; day += 1) {
                row.push({
                    roomEvents: [],
                    roomName: rooms[roomIdx]
                })
            }
            roomsFilled.push(row);
        }
        return roomsFilled;
    }

    static getDates(startTime:Date, n:number):IWeekViewDateRow[] {
        let dates = new Array(n),
            current = new Date(startTime.getTime()),
            i = 0;
        current.setHours(12); // Prevent repeated dates because of timezone bug
        while (i < n) {
            dates[i++] = {
                date: new Date(current.getTime()),
                events: [],
                dayHeader: ''
            };
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }

    private getRoomLabels():string[] {
        let roomLabels:string[] = [];
        for (let roomIdx = 0, length = this.views[0].rooms.length; roomIdx < length; roomIdx += 1) {
            roomLabels.push(this.views[0].rooms[roomIdx][0].roomName);
        }
        return roomLabels;
    }

    getViewData(startTime:Date):IWeekView {
        let dates = WeekViewComponent.getDates(startTime, 7);
        let dayHeaders:string[] = [];
        for (let i = 0; i < 7; i++) {
            dayHeaders.push(this.formatDayHeader(dates[i].date));
            dates[i].dayHeader = this.formatDayHeader(dates[i].date);
        }

        return {
            rooms: WeekViewComponent.createWeekRooms(this.roomSource),
            // dates: dates,
            dayHeaders: dayHeaders
        };

    }

    getRange(currentDate:Date):IRange {
        let year = currentDate.getFullYear(),
            month = currentDate.getMonth(),
            date = currentDate.getDate(),
            day = currentDate.getDay(),
            difference = day - this.startingDayWeek;

        if (difference < 0) {
            difference += 7;
        }

        let firstDayOfWeek = new Date(year, month, date - difference);
        let endTime = new Date(year, month, date - difference + 7);

        return {
            startTime: firstDayOfWeek,
            endTime: endTime
        };
    }

    onDataLoaded() {
        let eventSource = this.eventSource,
            len = eventSource ? eventSource.length : 0,
            startTime = this.range.startTime,
            endTime = this.range.endTime,
            currentViewIndex = this.currentViewIndex,
            rooms = this.views[currentViewIndex].rooms,
            normalEventInRange = false,
            rangeStartRowIndex = this.startHour * this.hourSegments,
            rangeEndRowIndex = this.endHour * this.hourSegments,
            allRows = 24 * this.hourSegments;


        for (let day = 0; day < 7; day += 1) {
            for (let roomIdx = 0; roomIdx < rooms.length; roomIdx += 1) {
                rooms[roomIdx][day].roomEvents = [];
            }
        }

        // Walk all events
        for (let i = 0; i < len; i += 1) {
            let event = eventSource[i];
            let eventStartTime = new Date(event.startDate.getTime());
            let eventEndTime = new Date(event.endDate.getTime());

            if (eventEndTime < startTime || eventStartTime > endTime) {
                continue;
            } else {
                    normalEventInRange = true;
                    let startedPreviousWeek = false;
                    let daysBetween = this.daysBetween(eventStartTime, eventEndTime);
                    let weekDayStartIndex = event.startDate.getDay();

                    if (eventStartTime < startTime) {
                        startedPreviousWeek = true;
                        daysBetween = this.daysBetween(startTime, eventEndTime);
                        weekDayStartIndex = 0;
                    }

                        // Place events in current week
                    let displayEvent = {
                        event: event,
                        days: daysBetween,
                        startedPreviousWeek: startedPreviousWeek
                    };
                    let eventSet = rooms[event.room][weekDayStartIndex].roomEvents;
                    if (eventSet) {
                        eventSet.push(displayEvent);
                    } else {
                        eventSet = [];
                        eventSet.push(displayEvent);
                        rooms[event.room][weekDayStartIndex].roomEvents = eventSet;
                    }
            }
        }
    }

    refreshView() {
        this.range = this.getRange(this.calendarService.currentDate);

        if (this.inited) {
            let title = this.getTitle();
            this.onTitleChanged.emit(title);
        }
        this.calendarService.populateAdjacentViews(this);
        // this.updateCurrentView(this.range.startTime, this.views[this.currentViewIndex]);
        this.calendarService.rangeChanged(this);
    }

    getTitle():string {
        let firstDayOfWeek = new Date(this.range.startTime.getTime());
        firstDayOfWeek.setHours(12, 0, 0, 0);
        return this.formatTitle(firstDayOfWeek);
    }

    getHighlightClass(date: IWeekViewDateRow):string {
        let className = '';

        if (date.date) {
            if (className) {
                className += ' ';
            }
            className = 'weekview-with-event';
        }

        if (date.selected) {
            if (className) {
                className += ' ';
            }
            className += 'weekview-selected';
        }

        return className;
    }

    select(selectedTime:Date, events:IDisplayEvent[]) {
        let disabled = false;
        if (this.markDisabled) {
            disabled = this.markDisabled(selectedTime);
        }

        this.onTimeSelected.emit({
            selectedTime: selectedTime,
            events: events.map(e => e.event),
            disabled: disabled
        });
    }

    setScrollPosition(scrollPosition:number) {
        this.initScrollPosition = scrollPosition;
    }

    daysBetween = function( date1: Date, date2: Date ) {   //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();    // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;        // Convert back to days and return
        return Math.round(difference_ms / one_day) + 1;
    };
}
