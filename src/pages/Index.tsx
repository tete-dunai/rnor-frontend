import { useState, useRef, useEffect } from 'react';
import { Calculator, Clock } from 'lucide-react';
import DateInput from '@/components/DateInput';
import StatusResults from '@/components/StatusResults';
import { calculateRNORStatus } from '@/utils/apiService';

// Helper: formats a Date as YYYY-MM-DD in **local** time (e.g., 2000‑04‑12)
const formatDateLocal = (d: Date) =>
  d.toLocaleDateString('en-CA'); // 'en-CA' → YYYY-MM-DD

const Index = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [averageIndiaDays, setAverageIndiaDays] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [inputsChanged, setInputsChanged] = useState(false);

  useEffect(() => {
    if (showResults && results.length > 0) {
      setTimeout(() => {
        const cta = document.getElementById('cta-button');
        if (cta) {
          const offset = 230; // adjust this value as needed
          const y = cta.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 200);
    }
  }, [showResults, results]);

  const handleCalculate = async () => {
    if (!departureDate || !returnDate) {
      setError('Please select both departure and return dates');
      return;
    }

    if (averageIndiaDays === null) {
      setError('Please fill all the fields.');
      return;
    }

    if (averageIndiaDays < 0) {
      setError('Please enter a non‑negative number of days.');
      return;
    }

    setIsCalculating(true);
    setError('');
    setShowResults(false);

    try {
      const requestData = {
        departure: formatDateLocal(departureDate),
        return: formatDateLocal(returnDate),
        avg_days: averageIndiaDays
      };

      const apiResults = await calculateRNORStatus(requestData);

      const transformedResults = apiResults.map(item => ({
        financialYear: item.fy,
        status: item.status
      }));

      setShowResults(false); // reset before setting again
      setResults(transformedResults);
      setShowResults(true);
      setInputsChanged(false);
      // setTimeout(() => {
      //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // }, 100);
    } catch (error) {
      console.error('Calculation failed:', error);
      setError('Please Retry after some Interval.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-2 md:pb-2 overflow-hidden">
      <div className="scale-[0.85] origin-top-left w-[117.6%] overflow-hidden sm:scale-100 sm:w-full">
        <div className="max-w-6xl mx-auto">
<div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-semibold text-[#1dc9a9]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              RNOR Status Calculator
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <DateInput
            label="Departure from India"
            value={departureDate}
            onChange={(date) => {
              setDepartureDate(date);
              setInputsChanged(true);
            }}
            placeholder="DD MMM YYYY"
          />
          <DateInput
            label="Return to India"
            value={returnDate}
            onChange={(date) => {
              setReturnDate(date);
              setInputsChanged(true);
            }}
            placeholder="DD MMM YYYY"
          />
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <Clock className="w-4 h-4 text-[#8c8c8c]" />
              Total days spent in India in the last 7 years
            </label>
            <input
              type="number"
              min={0}
              value={averageIndiaDays ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 || e.target.value === '') {
                  setAverageIndiaDays(e.target.value === '' ? null : val);
                }
setInputsChanged(true);
              }}
              onKeyDown={(e) => {
                // Block Arrow-Down when value would become negative
                if (
                  e.key === 'ArrowDown' &&
                  (e.currentTarget.value === '' || Number(e.currentTarget.value) <= 0)
                ) {
                  e.preventDefault();
                }
}}
              onWheel={(e) => e.currentTarget.blur()} // disables mouse-wheel changes
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1dc9a9] focus:border-transparent focus:outline-none transition-all bg-white"
              placeholder="25"
 />
            </div>
        </div>

        {error && (
          <div className="text-center mb-6">
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          </div>
        )}

        <div
          className={`text-center transition-all duration-300 ease-in-out ${
            !showResults || inputsChanged
              ? 'mb-3 opacity-100 scale-100 h-auto'
              : 'mb-1 opacity-0 scale-95 pointer-events-none h-0'
          }`}
        >
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="bg-[#2EE3C6] text-black px-6 py-3 rounded-full font-bold text-base shadow-xl hover:bg-[#29d1b6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </div>
            ) : (
              'Calculate'
            )}
          </button>
        </div>

        {showResults && !isCalculating && (
          <div ref={resultsRef}>
            <StatusResults results={results} />
            <div id="cta-button" className="text-center mt-4">
              <p className="text-sm text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Please note this is an estimate basis your inputs and your exact travel history is required for exact calculations.
              </p>
              <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Want help planning your move back to India?
              </p>
              <a
                href="https://www.turtlefinance.in/nris"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Talk to a Cross-Border Advisor
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Index;
