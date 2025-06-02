import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const DateInput = ({ label, value, onChange, placeholder }: DateInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [yearInput, setYearInput] = useState(currentMonth.getFullYear().toString());

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
      setError('Invalid format. Use DD/MM/YYYY or similar formats');
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
      setInputValue(format(date, 'dd/MM/yyyy'));
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
    <div>
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
        <CalendarIcon className={`w-4 h-4 ${label === 'Return to India' ? 'text-yellow-500' : label === 'Departure from India' ? 'text-[#8c8c8c]' : 'text-blue-500'}`} />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue || (value ? format(value, 'dd/MM/yyyy') : '')}
          onChange={handleInputChange}
          placeholder={placeholder || 'DD/MM/YYYY'}
          className={cn(
            "w-full px-4 py-3 pr-12 rounded-lg border text-sm focus:ring-2 focus:ring-[#1dc9a9] focus:border-transparent focus:outline-none transition-all bg-white",
            error ? "border-red-300" : "border-gray-200"
          )}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-emerald-50"
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-3">
              <div className="year-section flex items-center justify-between mb-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearNavigation('prev')}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <input
                  type="number"
                  value={yearInput}
                  onChange={handleYearChange}
                  className="w-20 text-center border rounded px-2 py-1 text-base"
                  min="1900"
                  max="2100"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleYearNavigation('next')}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
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
                <div className="text-base font-medium w-24 text-center">
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
              selected={value || undefined}
              onSelect={handleCalendarSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              components={{
                Caption: () => null
              }}
            />
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
