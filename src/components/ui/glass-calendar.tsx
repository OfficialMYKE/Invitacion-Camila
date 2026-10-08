import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  eventDate?: Date;
  className?: string;
}

const WEEKDAYS = ["l", "m", "m", "j", "v", "s", "d"];

export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  ({ selectedDate: propSelectedDate, onDateSelect, eventDate, className, children, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() => propSelectedDate ?? new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date>(() => propSelectedDate ?? new Date());

    const monthDays = React.useMemo(
      () =>
        eachDayOfInterval({
          start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
          end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
        }),
      [currentMonth],
    );

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-[360px] rounded-3xl p-5 shadow-2xl overflow-hidden",
          "bg-black/20 backdrop-blur-xl border border-white/10",
          "text-white",
          className,
        )}
        {...props}
      >
        {/* Month display and navigation */}
        <div className="flex items-center justify-between gap-3">
          <motion.p
            key={format(currentMonth, "yyyy-MM")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl @sm:text-2xl font-bold tracking-tight capitalize"
          >
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </motion.p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={handlePrevMonth}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={handleNextMonth}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="mt-4 grid grid-cols-7 text-center">
          {WEEKDAYS.map((day, index) => (
            <span key={`${day}-${index}`} className="text-[11px] font-bold uppercase text-white/45">
              {day}
            </span>
          ))}
        </div>

        {/* Monthly calendar grid */}
        <div className="mt-1 grid grid-cols-7 gap-y-1.5">
          {monthDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isOutside = !isSameMonth(date, currentMonth);
            const isEvent = eventDate ? isSameDay(date, eventDate) : false;
            return (
              <button
                key={date.toISOString()}
                type="button"
                aria-label={format(date, "d 'de' MMMM", { locale: es })}
                aria-pressed={isSelected}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "relative mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                  isSelected
                    ? "bg-gradient-to-br from-[#6b8e23] to-[#4b5320] text-white shadow-lg"
                    : isOutside
                      ? "text-white/30 hover:bg-white/10"
                      : "text-white/85 hover:bg-white/15",
                )}
              >
                {getDate(date)}
                {isEvent && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#c0f381]" />}
                {isToday(date) && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#b0cb47]" />}
              </button>
            );
          })}
        </div>

        {children}
      </div>
    );
  },
);

GlassCalendar.displayName = "GlassCalendar";
