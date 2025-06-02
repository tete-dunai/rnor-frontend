import { useState, useRef } from 'react';
import { Calculator, Clock } from 'lucide-react';
import DateInput from '@/components/DateInput';
import StatusResults from '@/components/StatusResults';
import { calculateRNORStatus } from '@/utils/apiService';

const Index = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [averageIndiaDays, setAverageIndiaDays] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = async () => {
    if (!departureDate || !returnDate) {
      setError('Please select both departure and return dates');
      return;
    }
    if (averageIndiaDays < 0) {
      setError('Please enter a non-negative number of days.');
      return;
    }

    if (averageIndiaDays === null ) {
      setError('Please fill all the fields.');
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      const requestData = {
        departure: departureDate.toISOString().split('T')[0],
        return: returnDate.toISOString().split('T')[0],
        avg_days: averageIndiaDays
      };

      const apiResults = await calculateRNORStatus(requestData);

      const transformedResults = apiResults.map(item => ({
        financialYear: item.fy,
        status: item.status
      }));

      setResults(transformedResults);
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Calculation failed:', error);
      setError('Failed to calculate RNOR status. Please check if the backend server is running.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-[#1dc9a9]">
              RNOR Status Calculator
            </h1>
          </div>
          <p className="text-base text-gray-600 mb-2">
            Get an accurate estimate of your RNOR (Resident but Not Ordinarily Resident) status in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DateInput
            label="Departure from India"
            value={departureDate}
            onChange={setDepartureDate}
            placeholder="DD/MM/YYYY"
          />
          <DateInput
            label="Return to India"
            value={returnDate}
            onChange={setReturnDate}
            placeholder="DD/MM/YYYY"
          />
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 text-[#8c8c8c]" />
              Average days stayed in India (past 7 years)
            </label>
            <input
              type="number"
              value={averageIndiaDays ?? ''}
              onChange={(e) =>
                setAverageIndiaDays(e.target.value === '' ? null : Number(e.target.value))
              }
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

        <div className="text-center mb-6">
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="bg-[#2EE3C6] text-black px-6 py-3 rounded-full font-bold text-base shadow-xl hover:bg-[#29d1b6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </div>
            ) : (
              'Calculate'
            )}
          </button>
        </div>

        {showResults && (
          <div ref={resultsRef}>
            <StatusResults results={results} />
            <div className="text-center mt-6">
              <p className="text-sm text-gray-700 mb-1">
                These results are for educational purposes only and may not reflect your exact RNOR status.
              </p>
              <p className="text-sm text-gray-700">
                Want help planning your move back to India?
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Let our cross-border experts guide you.
              </p>
              <a
                href="https://www.turtlefinance.in/nris"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Talk to a Cross-Border Advisor
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;