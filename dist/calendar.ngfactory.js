/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "@angular/core";
import * as i1 from "./weekview.ngfactory";
import * as i2 from "./weekview";
import * as i3 from "./calendar.service";
import * as i4 from "@angular/common";
import * as i5 from "./calendar";
var styles_CalendarComponent = ["[_nghost-%COMP%]    > div[_ngcontent-%COMP%] { height: 100%; }\n\n        .event-detail-container[_ngcontent-%COMP%] {\n          border-top: 2px darkgrey solid;\n        }\n\n        .no-events-label[_ngcontent-%COMP%] {\n          font-weight: bold;\n          color: darkgrey;\n          text-align: center;\n        }\n\n        .event-detail[_ngcontent-%COMP%] {\n          cursor: pointer;\n          white-space: nowrap;\n          text-overflow: ellipsis;\n        }\n\n        .calendar-event-inner[_ngcontent-%COMP%] {\n          overflow: hidden;\n          background-color: #3a87ad;\n          color: white;\n          height: 100%;\n          width: 100%;\n          padding: 2px;\n          line-height: 15px;\n          text-align: initial;\n        }\n\n        @media (max-width: 750px) {\n          .calendar-event-inner[_ngcontent-%COMP%] {\n            font-size: 12px;\n          }\n        }"];
var RenderType_CalendarComponent = i0.ɵcrt({ encapsulation: 0, styles: styles_CalendarComponent, data: {} });
export { RenderType_CalendarComponent as RenderType_CalendarComponent };
function View_CalendarComponent_1(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 3, "div", [["class", "calendar-event-inner"]], null, null, null, null, null)), (_l()(), i0.ɵted(1, null, ["", ""])), (_l()(), i0.ɵeld(2, 0, null, null, 0, "br", [], null, null, null, null, null)), (_l()(), i0.ɵted(3, null, ["", ""]))], null, function (_ck, _v) { var currVal_0 = _v.context.displayEvent.event.title; _ck(_v, 1, 0, currVal_0); var currVal_1 = _v.context.displayEvent.event.phone; _ck(_v, 3, 0, currVal_1); }); }
function View_CalendarComponent_2(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "weekview", [], [[2, "weekview", null]], [[null, "onRangeChanged"], [null, "onEventSelected"], [null, "onTimeSelected"], [null, "onTitleChanged"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("onRangeChanged" === en)) {
        var pd_0 = (_co.rangeChanged($event) !== false);
        ad = (pd_0 && ad);
    } if (("onEventSelected" === en)) {
        var pd_1 = (_co.eventSelected($event) !== false);
        ad = (pd_1 && ad);
    } if (("onTimeSelected" === en)) {
        var pd_2 = (_co.timeSelected($event) !== false);
        ad = (pd_2 && ad);
    } if (("onTitleChanged" === en)) {
        var pd_3 = (_co.titleChanged($event) !== false);
        ad = (pd_3 && ad);
    } return ad; }, i1.View_WeekViewComponent_0, i1.RenderType_WeekViewComponent)), i0.ɵdid(1, 4964352, null, 0, i2.WeekViewComponent, [i3.CalendarService, i0.ElementRef], { weekviewNormalEventTemplate: [0, "weekviewNormalEventTemplate"], formatWeekTitle: [1, "formatWeekTitle"], formatWeekViewDayHeader: [2, "formatWeekViewDayHeader"], formatHourColumn: [3, "formatHourColumn"], startingDayWeek: [4, "startingDayWeek"], hourParts: [5, "hourParts"], eventSource: [6, "eventSource"], roomSource: [7, "roomSource"], markDisabled: [8, "markDisabled"], locale: [9, "locale"], dateFormatter: [10, "dateFormatter"], dir: [11, "dir"], scrollToHour: [12, "scrollToHour"], preserveScrollPosition: [13, "preserveScrollPosition"], lockSwipeToPrev: [14, "lockSwipeToPrev"], lockSwipes: [15, "lockSwipes"], startHour: [16, "startHour"], endHour: [17, "endHour"], sliderOptions: [18, "sliderOptions"] }, { onRangeChanged: "onRangeChanged", onEventSelected: "onEventSelected", onTimeSelected: "onTimeSelected", onTitleChanged: "onTitleChanged" })], function (_ck, _v) { var _co = _v.component; var currVal_1 = (_co.weekviewNormalEventTemplate || i0.ɵnov(_v.parent, 0)); var currVal_2 = _co.formatWeekTitle; var currVal_3 = _co.formatWeekViewDayHeader; var currVal_4 = _co.formatHourColumn; var currVal_5 = _co.startingDayWeek; var currVal_6 = _co.hourParts; var currVal_7 = _co.eventSource; var currVal_8 = _co.roomSource; var currVal_9 = _co.markDisabled; var currVal_10 = _co.locale; var currVal_11 = _co.dateFormatter; var currVal_12 = _co.dir; var currVal_13 = _co.scrollToHour; var currVal_14 = _co.preserveScrollPosition; var currVal_15 = _co.lockSwipeToPrev; var currVal_16 = _co.lockSwipes; var currVal_17 = _co.startHour; var currVal_18 = _co.endHour; var currVal_19 = _co.sliderOptions; _ck(_v, 1, 1, [currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13, currVal_14, currVal_15, currVal_16, currVal_17, currVal_18, currVal_19]); }, function (_ck, _v) { var currVal_0 = i0.ɵnov(_v, 1).class; _ck(_v, 0, 0, currVal_0); }); }
export function View_CalendarComponent_0(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵand(0, [["defaultNormalEventTemplate", 2]], null, 0, null, View_CalendarComponent_1)), (_l()(), i0.ɵeld(1, 0, null, null, 3, "div", [], [[8, "className", 0]], null, null, null, null)), i0.ɵdid(2, 16384, null, 0, i4.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_CalendarComponent_2)), i0.ɵdid(4, 278528, null, 0, i4.NgSwitchCase, [i0.ViewContainerRef, i0.TemplateRef, i4.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.calendarMode; _ck(_v, 2, 0, currVal_1); var currVal_2 = "week"; _ck(_v, 4, 0, currVal_2); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i0.ɵinlineInterpolate(1, "", _co.calendarMode, "view-container"); _ck(_v, 1, 0, currVal_0); }); }
export function View_CalendarComponent_Host_0(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "calendar", [], null, null, null, View_CalendarComponent_0, RenderType_CalendarComponent)), i0.ɵprd(512, null, i3.CalendarService, i3.CalendarService, []), i0.ɵdid(2, 245760, null, 0, i5.CalendarComponent, [i3.CalendarService, i0.LOCALE_ID], null, null)], function (_ck, _v) { _ck(_v, 2, 0); }, null); }
var CalendarComponentNgFactory = i0.ɵccf("calendar", i5.CalendarComponent, View_CalendarComponent_Host_0, { currentDate: "currentDate", eventSource: "eventSource", roomSource: "roomSource", calendarMode: "calendarMode", formatDay: "formatDay", formatDayHeader: "formatDayHeader", formatDayTitle: "formatDayTitle", formatWeekTitle: "formatWeekTitle", formatMonthTitle: "formatMonthTitle", formatWeekViewDayHeader: "formatWeekViewDayHeader", formatHourColumn: "formatHourColumn", showEventDetail: "showEventDetail", startingDayMonth: "startingDayMonth", startingDayWeek: "startingDayWeek", noEventsLabel: "noEventsLabel", queryMode: "queryMode", step: "step", timeInterval: "timeInterval", autoSelect: "autoSelect", markDisabled: "markDisabled", weekviewHeaderTemplate: "weekviewHeaderTemplate", weekviewNormalEventTemplate: "weekviewNormalEventTemplate", dayviewNormalEventTemplate: "dayviewNormalEventTemplate", dateFormatter: "dateFormatter", dir: "dir", scrollToHour: "scrollToHour", preserveScrollPosition: "preserveScrollPosition", lockSwipeToPrev: "lockSwipeToPrev", lockSwipes: "lockSwipes", locale: "locale", startHour: "startHour", endHour: "endHour", sliderOptions: "sliderOptions" }, { onCurrentDateChanged: "onCurrentDateChanged", onRangeChanged: "onRangeChanged", onEventSelected: "onEventSelected", onTimeSelected: "onTimeSelected", onTitleChanged: "onTitleChanged" }, []);
export { CalendarComponentNgFactory as CalendarComponentNgFactory };
