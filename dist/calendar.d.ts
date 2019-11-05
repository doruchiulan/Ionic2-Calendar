import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { CalendarService } from './calendar.service';
export interface IEvent {
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
    rooms: IWeekViewRow[][];
    dayHeaders: string[];
}
export interface IWeekViewDateRow {
    date: Date;
    hasEvent?: boolean;
    selected?: boolean;
    dayHeader: string;
}
export interface IWeekViewRow {
    roomEvents: IDisplayEvent[];
    roomName: string;
}
export interface IDisplayEvent {
    event: IEvent;
    days: number;
}
export interface IDisplayWeekViewHeader {
    viewDate: IWeekViewDateRow;
}
export interface ICalendarComponent {
    currentViewIndex: number;
    direction: number;
    eventSource: IEvent[];
    getRange: {
        (date: Date): IRange;
    };
    getViewData: {
        (date: Date): IView;
    };
    mode: CalendarMode;
    range: IRange;
    views: IView[];
    onDataLoaded: {
        (): void;
    };
    onRangeChanged: EventEmitter<IRange>;
}
export interface ITimeSelected {
    events: IEvent[];
    selectedTime: Date;
    disabled: boolean;
}
export interface IWeekViewNormalEventSectionTemplateContext {
    tm: IWeekViewRow;
    eventTemplate: TemplateRef<IDisplayEvent>;
}
export interface IDateFormatter {
    formatMonthViewDay?: {
        (date: Date): string;
    };
    formatMonthViewDayHeader?: {
        (date: Date): string;
    };
    formatMonthViewTitle?: {
        (date: Date): string;
    };
    formatWeekViewDayHeader?: {
        (date: Date): string;
    };
    formatWeekViewTitle?: {
        (date: Date): string;
    };
    formatWeekViewHourColumn?: {
        (date: Date): string;
    };
    formatDayViewTitle?: {
        (date: Date): string;
    };
    formatDayViewHourColumn?: {
        (date: Date): string;
    };
}
export declare type CalendarMode = 'week';
export declare type QueryMode = 'local' | 'remote';
export declare enum Step {
    QuarterHour = 15,
    HalfHour = 30,
    Hour = 60
}
export declare class CalendarComponent implements OnInit {
    private calendarService;
    private appLocale;
    currentDate: Date;
    eventSource: IEvent[];
    roomSource: string[];
    calendarMode: CalendarMode;
    formatDay: string;
    formatDayHeader: string;
    formatDayTitle: string;
    formatWeekTitle: string;
    formatMonthTitle: string;
    formatWeekViewDayHeader: string;
    formatHourColumn: string;
    showEventDetail: boolean;
    startingDayMonth: number;
    startingDayWeek: number;
    noEventsLabel: string;
    queryMode: QueryMode;
    step: Step;
    timeInterval: number;
    autoSelect: boolean;
    markDisabled: (date: Date) => boolean;
    weekviewHeaderTemplate: TemplateRef<IDisplayWeekViewHeader>;
    weekviewNormalEventTemplate: TemplateRef<IDisplayEvent>;
    dayviewNormalEventTemplate: TemplateRef<IDisplayEvent>;
    dateFormatter: IDateFormatter;
    dir: string;
    scrollToHour: number;
    preserveScrollPosition: boolean;
    lockSwipeToPrev: boolean;
    lockSwipes: boolean;
    locale: string;
    startHour: number;
    endHour: number;
    sliderOptions: any;
    onCurrentDateChanged: EventEmitter<Date>;
    onRangeChanged: EventEmitter<IRange>;
    onEventSelected: EventEmitter<IEvent>;
    onTimeSelected: EventEmitter<ITimeSelected>;
    onTitleChanged: EventEmitter<string>;
    private _currentDate;
    hourParts: number;
    hourSegments: number;
    private currentDateChangedFromChildrenSubscription;
    constructor(calendarService: CalendarService, appLocale: string);
    ngOnInit(): void;
    ngOnDestroy(): void;
    rangeChanged(range: IRange): void;
    eventSelected(event: IEvent): void;
    timeSelected(timeSelected: ITimeSelected): void;
    titleChanged(title: string): void;
    loadEvents(): void;
}
