"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: {
    title: string;
    start: Date;
    end: Date;
    subject?: string;
    class?: string;
    teacher?: string;
    day?: string;
  }[];
}) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: any;
    x: number;
    y: number;
  }>({ visible: false, content: null, x: 0, y: 0 });

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "TODAY") {
      setDate(new Date());
    } else if (action === "PREV") {
      const newDate = new Date(date);
      if (view === Views.MONTH) {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === Views.WEEK || view === Views.WORK_WEEK) {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      setDate(newDate);
    } else if (action === "NEXT") {
      const newDate = new Date(date);
      if (view === Views.MONTH) {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === Views.WEEK || view === Views.WORK_WEEK) {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      setDate(newDate);
    }
  };

  // Custom event component with hover tooltip
  const EventComponent = ({ event }: { event: any }) => {
    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        content: event,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    };

    const handleMouseLeave = () => {
      setTooltip({ visible: false, content: null, x: 0, y: 0 });
    };

    return (
      <div
        className="rbc-event-content cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="font-medium text-sm">{event.title}</div>
        <div className="text-xs opacity-90">{event.subject}</div>
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Custom Navigation Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate("TODAY")}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => handleNavigate("PREV")}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            ◀
          </button>
          <button
            onClick={() => handleNavigate("NEXT")}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            ▶
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-800">
            {moment(date).format("MMMM YYYY")}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleOnChangeView(Views.MONTH)}
            className={`px-3 py-1.5 text-sm font-medium rounded ${
              view === Views.MONTH
                ? "bg-blue-500 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleOnChangeView(Views.WEEK)}
            className={`px-3 py-1.5 text-sm font-medium rounded ${
              view === Views.WEEK
                ? "bg-blue-500 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handleOnChangeView(Views.DAY)}
            className={`px-3 py-1.5 text-sm font-medium rounded ${
              view === Views.DAY
                ? "bg-blue-500 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-auto min-h-0 pb-6">
        <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          view={view}
          date={date}
          onNavigate={setDate}
          style={{ height: "100%", minHeight: "500px" }}
          onView={handleOnChangeView}
          min={new Date(2025, 1, 0, 8, 0, 0)}
          max={new Date(2025, 1, 0, 17, 0, 0)}
          toolbar={false}
          components={{
            event: EventComponent,
          }}
        />
      </div>

      {/* Custom Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold text-gray-800 mb-2">
            {tooltip.content.title}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Subject:</span>
              <span className="font-medium">{tooltip.content.subject}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">{tooltip.content.class}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Teacher:</span>
              <span className="font-medium">{tooltip.content.teacher}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Day:</span>
              <span className="font-medium">{tooltip.content.day}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {tooltip.content.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {tooltip.content.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          {/* Shadow for arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"
            style={{ marginTop: "1px" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
