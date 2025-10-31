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
  const [view, setView] = useState<View>(Views.MONTH);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: any;
    x: number;
    y: number;
  }>({ visible: false, content: null, x: 0, y: 0 });

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
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
    <div className="relative h-full m-0 p-0">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "work_week", "day"]}
        view={view}
        style={{ height: "100%" }}
        onView={handleOnChangeView}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
        defaultDate={new Date()}
        components={{
          event: EventComponent,
        }}
      />

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
