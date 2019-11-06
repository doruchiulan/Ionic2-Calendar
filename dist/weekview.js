import * as tslib_1 from "tslib";
import { DatePipe } from '@angular/common';
import { IonSlides } from '@ionic/angular';
import { Component, HostBinding, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, TemplateRef, ElementRef } from '@angular/core';
import { CalendarService } from './calendar.service';
var WeekViewComponent = /** @class */ (function () {
    function WeekViewComponent(calendarService, elm) {
        this.calendarService = calendarService;
        this.elm = elm;
        this.class = true;
        this.dir = "";
        this.scrollToHour = 0;
        this.onRangeChanged = new EventEmitter();
        this.onEventSelected = new EventEmitter();
        this.onTimeSelected = new EventEmitter();
        this.onTitleChanged = new EventEmitter(true);
        this.views = [];
        this.currentViewIndex = 0;
        this.direction = 0;
        this.mode = 'week';
        this.inited = false;
        this.callbackOnInit = true;
        this.daysBetween = function (date1, date2) {
            var one_day = 1000 * 60 * 60 * 24; // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime(); // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms; // Convert back to days and return
            return Math.round(difference_ms / one_day) + 1;
        };
    }
    WeekViewComponent_1 = WeekViewComponent;
    WeekViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hourRange = this.endHour - this.startHour;
        if (this.dateFormatter && this.dateFormatter.formatWeekViewDayHeader) {
            this.formatDayHeader = this.dateFormatter.formatWeekViewDayHeader;
        }
        else {
            var datePipe_1 = new DatePipe(this.locale);
            this.formatDayHeader = function (date) {
                return datePipe_1.transform(date, this.formatWeekViewDayHeader);
            };
        }
        if (this.dateFormatter && this.dateFormatter.formatWeekViewTitle) {
            this.formatTitle = this.dateFormatter.formatWeekViewTitle;
        }
        else {
            var datePipe_2 = new DatePipe(this.locale);
            this.formatTitle = function (date) {
                return datePipe_2.transform(date, this.formatWeekTitle);
            };
        }
        if (this.dateFormatter && this.dateFormatter.formatWeekViewHourColumn) {
            this.formatHourColumnLabel = this.dateFormatter.formatWeekViewHourColumn;
        }
        else {
            var datePipe_3 = new DatePipe(this.locale);
            this.formatHourColumnLabel = function (date) {
                return datePipe_3.transform(date, this.formatHourColumn);
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
        this.currentDateChangedFromParentSubscription = this.calendarService.currentDateChangedFromParent$.subscribe(function (currentDate) {
            _this.refreshView();
        });
        this.eventSourceChangedSubscription = this.calendarService.eventSourceChanged$.subscribe(function () {
            _this.onDataLoaded();
        });
    };
    WeekViewComponent.prototype.ngAfterViewInit = function () {
        var title = this.getTitle();
        this.onTitleChanged.emit(title);
        if (this.scrollToHour > 0) {
            var hourColumns_1 = this.elm.nativeElement.querySelector('.weekview-normal-event-container').querySelectorAll('.calendar-hour-column');
            var me_1 = this;
            setTimeout(function () {
                me_1.initScrollPosition = hourColumns_1[me_1.scrollToHour - me_1.startHour].offsetTop;
            }, 0);
        }
    };
    WeekViewComponent.prototype.ngOnChanges = function (changes) {
        if (!this.inited)
            return;
        var eventSourceChange = changes['eventSource'];
        if (eventSourceChange && eventSourceChange.currentValue) {
            this.onDataLoaded();
        }
        var lockSwipeToPrev = changes['lockSwipeToPrev'];
        if (lockSwipeToPrev) {
            this.slider.lockSwipeToPrev(lockSwipeToPrev.currentValue);
        }
        var lockSwipes = changes['lockSwipes'];
        if (lockSwipes) {
            this.slider.lockSwipes(lockSwipes.currentValue);
        }
    };
    WeekViewComponent.prototype.ngOnDestroy = function () {
        if (this.currentDateChangedFromParentSubscription) {
            this.currentDateChangedFromParentSubscription.unsubscribe();
            this.currentDateChangedFromParentSubscription = null;
        }
        if (this.eventSourceChangedSubscription) {
            this.eventSourceChangedSubscription.unsubscribe();
            this.eventSourceChangedSubscription = null;
        }
    };
    WeekViewComponent.prototype.onSlideChanged = function () {
        var _this = this;
        if (this.callbackOnInit) {
            this.callbackOnInit = false;
            return;
        }
        var currentSlideIndex = this.slider.getActiveIndex(), direction = 0, currentViewIndex = this.currentViewIndex;
        this.slider.getActiveIndex().then(function (currentSlideIndex) {
            currentSlideIndex = (currentSlideIndex + 2) % 3;
            if (currentSlideIndex - currentViewIndex === 1) {
                direction = 1;
            }
            else if (currentSlideIndex === 0 && currentViewIndex === 2) {
                direction = 1;
                _this.slider.slideTo(1, 0, false);
            }
            else if (currentViewIndex - currentSlideIndex === 1) {
                direction = -1;
            }
            else if (currentSlideIndex === 2 && currentViewIndex === 0) {
                direction = -1;
                _this.slider.slideTo(3, 0, false);
            }
            _this.currentViewIndex = currentSlideIndex;
            _this.move(direction);
        });
    };
    WeekViewComponent.prototype.move = function (direction) {
        if (direction === 0) {
            return;
        }
        this.direction = direction;
        var adjacent = this.calendarService.getAdjacentCalendarDate(this.mode, direction);
        this.calendarService.setCurrentDate(adjacent);
        this.refreshView();
        this.direction = 0;
    };
    WeekViewComponent.createWeekRooms = function (rooms) {
        var roomsFilled = [];
        for (var roomIdx = 0; roomIdx < rooms.length; roomIdx += 1) {
            var row = [];
            for (var day = 0; day < 7; day += 1) {
                row.push({
                    roomEvents: [],
                    roomName: rooms[roomIdx]
                });
            }
            roomsFilled.push(row);
        }
        return roomsFilled;
    };
    WeekViewComponent.getDates = function (startTime, n) {
        var dates = new Array(n), current = new Date(startTime.getTime()), i = 0;
        current.setHours(12); // Prevent repeated dates because of timezone bug
        while (i < n) {
            dates[i++] = {
                date: new Date(current.getTime()),
                events: []
            };
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };
    WeekViewComponent.prototype.getRoomLabels = function () {
        var roomLabels = [];
        for (var roomIdx = 0, length_1 = this.views[0].rooms.length; roomIdx < length_1; roomIdx += 1) {
            roomLabels.push(this.views[0].rooms[roomIdx][0].roomName);
        }
        return roomLabels;
    };
    WeekViewComponent.prototype.getViewData = function (startTime) {
        var dates = WeekViewComponent_1.getDates(startTime, 7);
        var dayHeaders = [];
        for (var i = 0; i < 7; i++) {
            dayHeaders.push(this.formatDayHeader(dates[i].date));
            dates[i].dayHeader = this.formatDayHeader(dates[i].date);
        }
        return {
            rooms: WeekViewComponent_1.createWeekRooms(this.roomSource),
            // dates: dates,
            dayHeaders: dayHeaders
        };
    };
    WeekViewComponent.prototype.getRange = function (currentDate) {
        var year = currentDate.getFullYear(), month = currentDate.getMonth(), date = currentDate.getDate(), day = currentDate.getDay(), difference = day - this.startingDayWeek;
        if (difference < 0) {
            difference += 7;
        }
        var firstDayOfWeek = new Date(year, month, date - difference);
        var endTime = new Date(year, month, date - difference + 7);
        return {
            startTime: firstDayOfWeek,
            endTime: endTime
        };
    };
    WeekViewComponent.prototype.onDataLoaded = function () {
        var eventSource = this.eventSource, len = eventSource ? eventSource.length : 0, startTime = this.range.startTime, endTime = this.range.endTime, currentViewIndex = this.currentViewIndex, rooms = this.views[currentViewIndex].rooms, normalEventInRange = false;
        for (var day = 0; day < 7; day += 1) {
            for (var roomIdx = 0; roomIdx < rooms.length; roomIdx += 1) {
                rooms[roomIdx][day].roomEvents = [];
            }
        }
        // Walk all events
        for (var i = 0; i < len; i += 1) {
            var event_1 = eventSource[i];
            var eventStartTime = new Date(event_1.startDate.getTime());
            var eventEndTime = new Date(event_1.endDate.getTime());
            if (eventEndTime < startTime || eventStartTime >= endTime) {
                continue;
            }
            else {
                normalEventInRange = true;
                var startedPreviousWeek = false;
                var daysBetween = this.daysBetween(eventStartTime, eventEndTime);
                var weekDayStartIndex = (event_1.startDate.getDay() + 6) % 7;
                if (eventStartTime < startTime) {
                    startedPreviousWeek = true;
                    daysBetween = this.daysBetween(startTime, eventEndTime);
                    weekDayStartIndex = 0;
                }
                // Place events in current week
                var displayEvent = {
                    event: event_1,
                    days: daysBetween,
                    startedPreviousWeek: startedPreviousWeek
                };
                var eventSet = rooms[event_1.room][weekDayStartIndex].roomEvents;
                if (eventSet) {
                    eventSet.push(displayEvent);
                }
                else {
                    eventSet = [];
                    eventSet.push(displayEvent);
                    rooms[event_1.room][weekDayStartIndex].roomEvents = eventSet;
                }
            }
        }
    };
    WeekViewComponent.prototype.refreshView = function () {
        this.range = this.getRange(this.calendarService.currentDate);
        if (this.inited) {
            var title = this.getTitle();
            this.onTitleChanged.emit(title);
        }
        this.calendarService.populateAdjacentViews(this);
        this.calendarService.rangeChanged(this);
    };
    WeekViewComponent.prototype.getTitle = function () {
        var firstDayOfWeek = new Date(this.range.startTime.getTime());
        firstDayOfWeek.setHours(12, 0, 0, 0);
        return this.formatTitle(firstDayOfWeek);
    };
    WeekViewComponent.prototype.select = function (selectedTime, events) {
        var disabled = false;
        if (this.markDisabled) {
            disabled = this.markDisabled(selectedTime);
        }
        this.onTimeSelected.emit({
            selectedTime: selectedTime,
            events: events.map(function (e) { return e.event; }),
            disabled: disabled
        });
    };
    WeekViewComponent.prototype.eventSelected = function (event) {
        this.onEventSelected.emit(event);
    };
    WeekViewComponent.prototype.setScrollPosition = function (scrollPosition) {
        this.initScrollPosition = scrollPosition;
    };
    var WeekViewComponent_1;
    tslib_1.__decorate([
        ViewChild('weekSlider'),
        tslib_1.__metadata("design:type", IonSlides)
    ], WeekViewComponent.prototype, "slider", void 0);
    tslib_1.__decorate([
        HostBinding('class.weekview'),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "class", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", TemplateRef)
    ], WeekViewComponent.prototype, "weekviewNormalEventTemplate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], WeekViewComponent.prototype, "formatWeekTitle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], WeekViewComponent.prototype, "formatWeekViewDayHeader", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], WeekViewComponent.prototype, "formatHourColumn", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "startingDayWeek", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "hourParts", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], WeekViewComponent.prototype, "eventSource", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], WeekViewComponent.prototype, "roomSource", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function)
    ], WeekViewComponent.prototype, "markDisabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], WeekViewComponent.prototype, "locale", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "dateFormatter", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], WeekViewComponent.prototype, "dir", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "scrollToHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], WeekViewComponent.prototype, "preserveScrollPosition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], WeekViewComponent.prototype, "lockSwipeToPrev", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], WeekViewComponent.prototype, "lockSwipes", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "startHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "endHour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WeekViewComponent.prototype, "spaceBetween", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "sliderOptions", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "onRangeChanged", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "onEventSelected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "onTimeSelected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], WeekViewComponent.prototype, "onTitleChanged", void 0);
    WeekViewComponent = WeekViewComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'weekview',
            template: "\n        <ion-slides #weekSlider [options]=\"sliderOptions\" [dir]=\"dir\" (ionSlideDidChange)=\"onSlideChanged()\" class=\"slides-container\">\n            <ion-slide class=\"slide-container\">\n                <table class=\"table table-bordered table-fixed weekview-header\">\n                    <thead>\n                    <tr>\n                        <th class=\"calendar-hour-column\"></th>\n                        <th class=\"weekview-header text-center\" *ngFor=\"let dayHeader of views[0].dayHeaders\">{{dayHeader}}\n                        </th>\n                    </tr>\n                    </thead>\n                </table>\n                <div *ngIf=\"0===currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\"\n                                          [emitEvent]=\"preserveScrollPosition\" (onScroll)=\"setScrollPosition($event)\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let room of views[0].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let roomDay of room\" class=\"calendar-cell\" tappable\n                                    (click)=\"select(roomDay.time, roomDay.roomEvents)\">\n                                    <div [ngClass]=\"{'calendar-event-wrap': roomDay.roomEvents}\" *ngIf=\"roomDay.roomEvents\"  style=\"height: 100%\">\n                                        <div *ngFor=\"let displayEvent of roomDay.roomEvents\" class=\"calendar-event\" tappable\n                                             (click)=\"eventSelected(displayEvent.event)\"\n                                             [ngStyle]=\"{\n                                            'width': displayEvent.startedPreviousWeek ? 50 + (displayEvent.days - 1) * 100 + '%' : 100 + (displayEvent.days - 2) * 100 + '%',\n                                            'height': '100%',\n                                            'margin-left': displayEvent.startedPreviousWeek ? '0%' : '50%'}\">\n                                            <ng-template [ngTemplateOutlet]=\"weekviewNormalEventTemplate\"\n                                                         [ngTemplateOutletContext]=\"{displayEvent:displayEvent}\">\n                                            </ng-template>\n                                        </div>\n                                    </div>\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n                <div *ngIf=\"0!==currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let row of views[0].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let tm of row\" class=\"calendar-cell\">\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n            </ion-slide>\n            <ion-slide>\n                <table class=\"table table-bordered table-fixed weekview-header\">\n                    <thead>\n                    <tr>\n                        <th class=\"calendar-hour-column\">Camera</th>\n                        <th class=\"weekview-header text-center\" *ngFor=\"let dayHeader of views[1].dayHeaders\">{{dayHeader}}\n                        </th>\n                    </tr>\n                    </thead>\n                </table>\n                <div *ngIf=\"1===currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\"\n                                          [emitEvent]=\"preserveScrollPosition\" (onScroll)=\"setScrollPosition($event)\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let room of views[1].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let roomDay of room\" class=\"calendar-cell\" tappable\n                                    (click)=\"select(roomDay.time, roomDay.roomEvents)\">\n                                    <div [ngClass]=\"{'calendar-event-wrap': roomDay.roomEvents}\" *ngIf=\"roomDay.roomEvents\"  style=\"height: 100%\">\n                                        <div *ngFor=\"let displayEvent of roomDay.roomEvents\" class=\"calendar-event\" tappable\n                                             (click)=\"eventSelected(displayEvent.event)\"\n                                             [ngStyle]=\"{\n                                            'width': displayEvent.startedPreviousWeek ? 50 + (displayEvent.days - 1) * 100 + '%' : 100 + (displayEvent.days - 2) * 100 + '%',\n                                            'height': '100%',\n                                            'margin-left': displayEvent.startedPreviousWeek ? '0%' : '50%'}\">\n                                            <ng-template [ngTemplateOutlet]=\"weekviewNormalEventTemplate\"\n                                                         [ngTemplateOutletContext]=\"{displayEvent:displayEvent}\">\n                                            </ng-template>\n                                        </div>\n                                    </div>\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n                <div *ngIf=\"1!==currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let row of views[1].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let tm of row\" class=\"calendar-cell\">\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n            </ion-slide>\n            <ion-slide>\n                <table class=\"table table-bordered table-fixed weekview-header\">\n                    <thead>\n                    <tr>\n                        <th class=\"calendar-hour-column\"></th>\n                        <th class=\"weekview-header text-center\" *ngFor=\"let dayHeader of views[2].dayHeaders\">{{dayHeader}}\n                        </th>\n                    </tr>\n                    </thead>\n                </table>\n                <div *ngIf=\"2===currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\"\n                                          [emitEvent]=\"preserveScrollPosition\" (onScroll)=\"setScrollPosition($event)\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let room of views[2].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let roomDay of room\" class=\"calendar-cell\" tappable\n                                    (click)=\"select(roomDay.time, roomDay.roomEvents)\">\n                                    <div [ngClass]=\"{'calendar-event-wrap': roomDay.roomEvents}\" *ngIf=\"roomDay.roomEvents\"  style=\"height: 100%\">\n                                        <div *ngFor=\"let displayEvent of roomDay.roomEvents\" class=\"calendar-event\" tappable\n                                             (click)=\"eventSelected(displayEvent.event)\"\n                                             [ngStyle]=\"{\n                                        'width': displayEvent.startedPreviousWeek ? 50 + (displayEvent.days - 1) * 100 + '%' : 100 + (displayEvent.days - 2) * 100 + '%',\n                                        'height': '100%',\n                                        'margin-left': displayEvent.startedPreviousWeek ? '0%' : '50%'}\">\n                                            <ng-template [ngTemplateOutlet]=\"weekviewNormalEventTemplate\"\n                                                         [ngTemplateOutletContext]=\"{displayEvent:displayEvent}\">\n                                            </ng-template>\n                                        </div>\n                                    </div>\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n                <div *ngIf=\"2!==currentViewIndex\">\n                    <init-position-scroll class=\"weekview-normal-event-container\" [initPosition]=\"initScrollPosition\">\n                        <table class=\"table table-bordered table-fixed weekview-normal-event-table\">\n                            <tbody>\n                            <tr *ngFor=\"let row of views[2].rooms; let i = index\">\n                                <td class=\"calendar-hour-column text-center\">\n                                    {{roomLabels[i]}}\n                                </td>\n                                <td *ngFor=\"let tm of row\" class=\"calendar-cell\">\n                                </td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </init-position-scroll>\n                </div>\n            </ion-slide>\n        </ion-slides>\n    ",
            styles: ["\n        .table-fixed {\n            table-layout: fixed;\n        }\n\n        .table {\n            width: 100%;\n            max-width: 100%;\n            background-color: transparent;\n        }\n\n        .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td,\n        .table > tbody > tr > td, .table > tfoot > tr > td {\n            padding: 8px;\n            line-height: 20px;\n            vertical-align: top;\n        }\n\n        .table > thead > tr > th {\n            vertical-align: bottom;\n            border-bottom: 2px solid #ddd;\n        }\n\n        .table > thead:first-child > tr:first-child > th, .table > thead:first-child > tr:first-child > td {\n            border-top: 0\n        }\n\n        .table > tbody + tbody {\n            border-top: 2px solid #ddd;\n        }\n\n        .table-bordered {\n            border: 1px solid #ddd;\n        }\n\n        .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th,\n        .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {\n            border: 1px solid #ddd;\n        }\n\n        .table-bordered > thead > tr > th, .table-bordered > thead > tr > td {\n            border-bottom-width: 2px;\n        }\n\n        .table-striped > tbody > tr:nth-child(odd) > td, .table-striped > tbody > tr:nth-child(odd) > th {\n            background-color: #f9f9f9\n        }\n\n        .calendar-hour-column {\n            width: 100px;\n            white-space: nowrap;\n        }\n\n        .calendar-event {\n            padding: 2px;\n            cursor: pointer;\n            z-index: 10000;\n            height: 100%;\n            position: relative;\n        }\n\n        .calendar-cell {\n            padding: 0 !important;\n            height: 37px;\n        }\n\n        .weekview-header th {\n            overflow: hidden;\n            white-space: nowrap;\n            font-size: 14px;\n        }\n\n        .weekview-normal-event-container {\n            margin-top: 38px;\n            overflow: hidden;\n            left: 0;\n            right: 0;\n            top: 0;\n            bottom: 0;\n            position: absolute;\n            font-size: 14px;\n        }\n\n        .weekview .slide-zoom {\n            height: 100%;\n        }\n\n        ::-webkit-scrollbar,\n        *::-webkit-scrollbar {\n            display: none;\n        }\n\n        .table > tbody > tr > td.calendar-hour-column {\n            padding-left: 0;\n            padding-right: 0;\n            vertical-align: middle;\n        }\n\n        @media (max-width: 750px) {\n            .table > tbody > tr > td.calendar-hour-column {\n                padding-left: 0;\n                padding-right: 0;\n                vertical-align: middle;\n                line-height: 12px;\n            }\n\n            .table > thead > tr > th.weekview-header {\n                padding-left: 0;\n                padding-right: 0;\n                font-size: 12px;\n            }\n\n        }\n    "],
            encapsulation: ViewEncapsulation.None
        }),
        tslib_1.__metadata("design:paramtypes", [CalendarService, ElementRef])
    ], WeekViewComponent);
    return WeekViewComponent;
}());
export { WeekViewComponent };
