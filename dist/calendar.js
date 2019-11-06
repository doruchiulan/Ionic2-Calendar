import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef, Inject, LOCALE_ID } from '@angular/core';
import { CalendarService } from './calendar.service';
export var Step;
(function (Step) {
    Step[Step["QuarterHour"] = 15] = "QuarterHour";
    Step[Step["HalfHour"] = 30] = "HalfHour";
    Step[Step["Hour"] = 60] = "Hour";
})(Step || (Step = {}));
var CalendarComponent = /** @class */ (function () {
    function CalendarComponent(calendarService, appLocale) {
        this.calendarService = calendarService;
        this.appLocale = appLocale;
        this.eventSource = [];
        this.roomSource = [];
        this.calendarMode = 'week';
        this.formatDay = 'd';
        this.formatDayHeader = 'EEE';
        this.formatDayTitle = 'MMMM dd, yyyy';
        this.formatWeekTitle = 'MMMM yyyy, \'Week\' w';
        this.formatMonthTitle = 'MMMM yyyy';
        this.formatWeekViewDayHeader = 'EEE d';
        this.formatHourColumn = 'ha';
        this.showEventDetail = true;
        this.startingDayMonth = 0;
        this.startingDayWeek = 0;
        this.noEventsLabel = 'No Events';
        this.queryMode = 'local';
        this.step = Step.Hour;
        this.timeInterval = 60;
        this.autoSelect = true;
        this.dir = "";
        this.scrollToHour = 0;
        this.preserveScrollPosition = false;
        this.lockSwipeToPrev = false;
        this.lockSwipes = false;
        this.locale = "";
        this.startHour = 0;
        this.endHour = 24;
        this.onCurrentDateChanged = new EventEmitter();
        this.onRangeChanged = new EventEmitter();
        this.onEventSelected = new EventEmitter();
        this.onTimeSelected = new EventEmitter();
        this.onTitleChanged = new EventEmitter();
        this.hourParts = 1;
        this.hourSegments = 1;
        this.locale = appLocale;
    }
    Object.defineProperty(CalendarComponent.prototype, "currentDate", {
        get: function () {
            return this._currentDate;
        },
        set: function (val) {
            if (!val) {
                val = new Date();
            }
            this._currentDate = val;
            this.calendarService.setCurrentDate(val, true);
            this.onCurrentDateChanged.emit(this._currentDate);
        },
        enumerable: true,
        configurable: true
    });
    CalendarComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.autoSelect) {
            if (this.autoSelect.toString() === 'false') {
                this.autoSelect = false;
            }
            else {
                this.autoSelect = true;
            }
        }
        this.hourSegments = 60 / this.timeInterval;
        this.hourParts = 60 / this.step;
        if (this.hourParts <= this.hourSegments) {
            this.hourParts = 1;
        }
        else {
            this.hourParts = this.hourParts / this.hourSegments;
        }
        this.startHour = parseInt(this.startHour.toString());
        this.endHour = parseInt(this.endHour.toString());
        this.calendarService.queryMode = this.queryMode;
        this.currentDateChangedFromChildrenSubscription = this.calendarService.currentDateChangedFromChildren$.subscribe(function (currentDate) {
            _this._currentDate = currentDate;
            _this.onCurrentDateChanged.emit(currentDate);
        });
    };
    CalendarComponent.prototype.ngOnDestroy = function () {
        if (this.currentDateChangedFromChildrenSubscription) {
            this.currentDateChangedFromChildrenSubscription.unsubscribe();
            this.currentDateChangedFromChildrenSubscription = null;
        }
    };
    CalendarComponent.prototype.rangeChanged = function (range) {
        this.onRangeChanged.emit(range);
    };
    CalendarComponent.prototype.eventSelected = function (event) {
        this.onEventSelected.emit(event);
    };
    CalendarComponent.prototype.timeSelected = function (timeSelected) {
        this.onTimeSelected.emit(timeSelected);
    };
    CalendarComponent.prototype.titleChanged = function (title) {
        this.onTitleChanged.emit(title);
    };
    CalendarComponent.prototype.loadEvents = function () {
        this.calendarService.loadEvents();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Date),
        tslib_1.__metadata("design:paramtypes", [Date])
    ], CalendarComponent.prototype, "currentDate", null);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], CalendarComponent.prototype, "eventSource", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], CalendarComponent.prototype, "roomSource", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "calendarMode", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatDay", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatDayHeader", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatDayTitle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatWeekTitle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatMonthTitle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatWeekViewDayHeader", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "formatHourColumn", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], CalendarComponent.prototype, "showEventDetail", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "startingDayMonth", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "startingDayWeek", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "noEventsLabel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "queryMode", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "step", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "timeInterval", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], CalendarComponent.prototype, "autoSelect", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function)
    ], CalendarComponent.prototype, "markDisabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", TemplateRef)
    ], CalendarComponent.prototype, "weekviewHeaderTemplate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", TemplateRef)
    ], CalendarComponent.prototype, "weekviewNormalEventTemplate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", TemplateRef)
    ], CalendarComponent.prototype, "dayviewNormalEventTemplate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "dateFormatter", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "dir", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "scrollToHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], CalendarComponent.prototype, "preserveScrollPosition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], CalendarComponent.prototype, "lockSwipeToPrev", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], CalendarComponent.prototype, "lockSwipes", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CalendarComponent.prototype, "locale", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "startHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CalendarComponent.prototype, "endHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "sliderOptions", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "onCurrentDateChanged", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "onRangeChanged", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "onEventSelected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "onTimeSelected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CalendarComponent.prototype, "onTitleChanged", void 0);
    CalendarComponent = tslib_1.__decorate([
        Component({
            selector: 'calendar',
            template: "\n        <ng-template #defaultNormalEventTemplate let-displayEvent=\"displayEvent\">\n            <div class=\"calendar-event-inner\">{{displayEvent.event.title}}<br>{{displayEvent.event.phone}}</div>\n        </ng-template>\n\n        <div [ngSwitch]=\"calendarMode\" class=\"{{calendarMode}}view-container\">\n            <weekview *ngSwitchCase=\"'week'\"\n                [formatWeekTitle]=\"formatWeekTitle\"\n                [formatWeekViewDayHeader]=\"formatWeekViewDayHeader\"\n                [formatHourColumn]=\"formatHourColumn\"\n                [startingDayWeek]=\"startingDayWeek\"\n                [roomSource]=\"roomSource\"\n                [hourParts]=\"hourParts\"\n                [eventSource]=\"eventSource\"\n                [markDisabled]=\"markDisabled\"\n                [weekviewNormalEventTemplate]=\"weekviewNormalEventTemplate||defaultNormalEventTemplate\"\n                [locale]=\"locale\"\n                [dateFormatter]=\"dateFormatter\"\n                [dir]=\"dir\"\n                [scrollToHour]=\"scrollToHour\"\n                [preserveScrollPosition]=\"preserveScrollPosition\"\n                [lockSwipeToPrev]=\"lockSwipeToPrev\"\n                [lockSwipes]=\"lockSwipes\"\n                [startHour]=\"startHour\"\n                [endHour]=\"endHour\"\n                [sliderOptions]=\"sliderOptions\"\n                (onRangeChanged)=\"rangeChanged($event)\"\n                (onEventSelected)=\"eventSelected($event)\"\n                (onTimeSelected)=\"timeSelected($event)\"\n                (onTitleChanged)=\"titleChanged($event)\">\n            </weekview>\n        </div>\n    ",
            styles: ["\n        :host > div { height: 100%; }\n\n        .event-detail-container {\n          border-top: 2px darkgrey solid;\n        }\n\n        .no-events-label {\n          font-weight: bold;\n          color: darkgrey;\n          text-align: center;\n        }\n\n        .event-detail {\n          cursor: pointer;\n          white-space: nowrap;\n          text-overflow: ellipsis;\n        }\n\n        .calendar-event-inner {\n          overflow: hidden;\n          background-color: #3a87ad;\n          color: white;\n          height: 100%;\n          width: 100%;\n          padding: 2px;\n          line-height: 15px;\n          text-align: initial;\n        }\n\n        @media (max-width: 750px) {\n          .calendar-event-inner {\n            font-size: 12px;\n          }\n        }\n    "],
            providers: [CalendarService]
        }),
        tslib_1.__param(1, Inject(LOCALE_ID)),
        tslib_1.__metadata("design:paramtypes", [CalendarService, String])
    ], CalendarComponent);
    return CalendarComponent;
}());
export { CalendarComponent };
