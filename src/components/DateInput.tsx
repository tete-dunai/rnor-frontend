import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateInputProps {
  label: string | React.ReactNode;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const DateInput = ({ label, value, onChange, placeholder, disabled = false, icon }: DateInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (typeof label === 'object' && label?.props?.children === 'Departure from India' && !value) {
      return new Date(2000, 3); // April is month index 3
    }
    return value || new Date();
  });
  const [yearInput, setYearInput] = useState(currentMonth.getFullYear().toString());
  const [isOpen, setIsOpen] = useState(false);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
useEffect(() => {
  if (isOpen) {
    const timer = setTimeout(() => {
      const el = yearInputRef.current;
      if (el) el.focus();

      if (window.innerWidth < 768 && wrapperRef.current) {
                wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Optional: Add a slight upward scroll after it settles to show extra space above
        setTimeout(() => {
          window.scrollBy(0, -100); // adjust the offset as needed
        }, 400);
      }
    }, 100);

    return () => clearTimeout(timer);
  }
}, [isOpen]);

  const isValidDate = (day: number, month: number, year: number): boolean => {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;

    return day <= daysInMonth[month - 1];
  };

  const parseDate = (dateString: string): Date | null => {
    setError('');

    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        let day, month, year;

        if (format.source.startsWith('^(\\d{4})')) {
          [, year, month, day] = match;
        } else {
          [, day, month, year] = match;
        }

        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (!isValidDate(dayNum, monthNum, yearNum)) {
          setError(`Invalid date: ${dayNum}/${monthNum}/${yearNum} does not exist`);
          return null;
        }

        const date = new Date(yearNum, monthNum - 1, dayNum);

        if (date.getFullYear() === yearNum && 
            date.getMonth() === monthNum - 1 && 
            date.getDate() === dayNum) {
          return date;
        }
      }
    }

    if (dateString.trim()) {
      setError('Invalid format. Use DD MMM YYYY or CHOSE FROM CALENDAR');
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue) {
      const parsedDate = parseDate(newValue);
      if (parsedDate) {
        onChange(parsedDate);
        const calcBtn = document.getElementById("calculate-button");
        if (calcBtn) calcBtn.classList.remove("hidden");
        const resultDiv = document.getElementById("result");
        if (resultDiv) resultDiv.classList.remove("hidden");
        setCurrentMonth(parsedDate);
      } else {
        onChange(null);
      }
    } else {
      setError('');
      onChange(null);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      const calcBtn = document.getElementById("calculate-button");
      if (calcBtn) calcBtn.classList.remove("hidden");
      const resultDiv = document.getElementById("result");
      if (resultDiv) resultDiv.classList.remove("hidden");
      setInputValue('');
      setError('');
      setCurrentMonth(date);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    setYearInput(year);

    if (year.length === 4 && !isNaN(parseInt(year))) {
      const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1);
      setCurrentMonth(newDate);
    }
  };

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    setYearInput(newMonth.getFullYear().toString());
  };

  const handleYearNavigation = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear() + 1;
    const newDate = new Date(newYear, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
    setYearInput(newYear.toString());
  };


  return (
    <div ref={wrapperRef}>
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1 italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {icon || <CalendarIcon className={`w-4 h-4 ${
          typeof label === 'object' && label?.props?.children === 'Return to India' ? 'text-yellow-500' : 
          typeof label === 'object' && label?.props?.children === 'Departure from India' ? 'text-[#8c8c8c]' : 
          'text-blue-500'
        }`} />}
        {label}
      </label>
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <input
              type="text"
              value={inputValue || (value ? format(value, 'dd MMM yyyy') : '')}
              placeholder={placeholder || 'DD MMM YYYY'}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border text-sm focus:ring-2 focus:ring-[#1dc9a9] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer",
                error ? "border-red-300" : "border-gray-200"
              )}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                if (onChange.toString().includes('setRnorsMessage')) return;
                if (typeof label === 'object' && label?.props?.children === 'Departure from India' && !value) {
                  setCurrentMonth(new Date(2000, 3)); // April 2000
                }
                setIsOpen(true);
              }}
              onChange={handleInputChange}
            />
          </PopoverTrigger>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-emerald-50"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setIsOpen(true);
              }}
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="transform origin-top-right scale-[0.8] sm:scale-100 w-auto text-sm p-2 ml-0 sm:ml-0 sm:text-base sm:p-3"
            side="bottom"
            align="end"
            sideOffset={0}
            onKeyDown={(e) => {
              const active = document.activeElement;
              if (active?.tagName === 'INPUT') return;

              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();

                if (e.key === 'ArrowLeft') handleMonthNavigation('prev');
                else if (e.key === 'ArrowRight') handleMonthNavigation('next');
                else if (e.key === 'ArrowUp') handleYearNavigation('prev');
                else if (e.key === 'ArrowDown') handleYearNavigation('next');
              }
            }}
          >
            <div className="p-3">
              <div className="year-section flex items-center justify-between mb-2 gap-1 sm:gap-2 sm:mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearNavigation('prev')}
                  className="h-8"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>

                <input
                  type="number"
                  value={yearInput}
                  onChange={handleYearChange}
                  ref={yearInputRef}
                  className="w-16 text-center border border-[#25e3c0] rounded-full px-1.5 py-0.5 text-sm text-[#1a1e29] focus:ring-2 focus:ring-[#25e3c0] focus:outline-none transition-all sm:w-20 sm:text-base sm:px-2 sm:py-1"
                  min="1900"
                  max="2100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      setTimeout(() => {
                        const gridcells = document.querySelectorAll('[role="gridcell"]:not([aria-disabled="true"])');
                        const firstVisibleDay = Array.from(gridcells).find(cell => cell.textContent?.trim() === '1') as HTMLElement;
                        if (firstVisibleDay) firstVisibleDay.focus();
                      }, 50);
                    }
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearNavigation('next')}
                  className="h-8"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMonthNavigation('prev')}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm sm:text-base font-medium w-20 sm:w-24 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {format(currentMonth, 'MMMM')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMonthNavigation('next')}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={value === null ? undefined : value}
              onSelect={handleCalendarSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              components={{
                Caption: () => null
              }}
              classNames={{
                day: "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md text-gray-400 \
hover:bg-[#0f172a] hover:text-white \
focus:outline-none focus:ring-0 \
data-[selected]:bg-[#0c111d] data-[selected]:text-white data-[selected]:rounded-md data-[selected]:font-medium"
              }}
            />
            <div className="flex justify-end p-3 pt-0">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-[#25e3c0] text-black font-semibold px-4 py-1.5 text-sm rounded-full shadow-lg transition-all hover:bg-[#2be8c5] hover:shadow-xl sm:px-6 sm:py-2 sm:text-base"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Confirm
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default DateInput;
