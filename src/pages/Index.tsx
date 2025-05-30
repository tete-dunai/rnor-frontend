import { useState } from 'react';
import { Calculator, Clock, IndianRupee } from 'lucide-react';
import DateInput from '@/components/DateInput';
import StatusResults from '@/components/StatusResults';
import { calculateRNORStatus } from '@/utils/apiService';

const Index = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [averageIndiaDays, setAverageIndiaDays] = useState<number | null>(null);
  const [passiveIncome, setPassiveIncome] = useState<number | null>(null);
  const [expectedCTC, setExpectedCTC] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');

  // Preview data with all three status types
  const previewResults = [
    { financialYear: 'FY 24-25', status: 'ROR' as const },
    { financialYear: 'FY 25-26', status: 'RNOR' as const },
    { financialYear: 'FY 26-27', status: 'NR' as const },
    { financialYear: 'FY 27-28', status: 'RNOR' as const },
    { financialYear: 'FY 28-29', status: 'ROR' as const },
  ];

  const handleCalculate = async () => {
    if (!departureDate || !returnDate) {
      setError('Please select both departure and return dates');
      return;
    }
    if (averageIndiaDays < 0 || passiveIncome < 0 || expectedCTC < 0) {
      setError('Please enter a non-negative number.');
      return;
    }
    if (averageIndiaDays === null || passiveIncome === null || expectedCTC === null) {
      setError('Please fill all the fields correctly.');
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      const requestData = {
        departure: departureDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        return: returnDate.toISOString().split('T')[0],
        avg_days: averageIndiaDays,
        ctc: expectedCTC,
        passive_income: passiveIncome
      };

      console.log('Sending request:', requestData);
      
      const apiResults = await calculateRNORStatus(requestData);
      
      // Transform the API response to match our component's expected format
      const transformedResults = apiResults.map(item => ({
        financialYear: item.fy,
        status: item.status
      }));

      console.log('Received results:', transformedResults);
      
      setResults(transformedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Calculation failed:', error);
      setError('Failed to calculate RNOR status. Please check if the backend server is running.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              RNOR Status Calculator
            </h1>
          </div>
          <p className="text-base text-gray-600 mb-2">
            Get an accurate estimate of your RNOR (Resident but Not Ordinarily Resident) status in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <DateInput
            label="Date of Departure"
            value={departureDate}
            onChange={setDepartureDate}
            placeholder="DD/MM/YYYY"
          />
          <DateInput
            label="Date of Return"
            value={returnDate}
            onChange={setReturnDate}
            placeholder="DD/MM/YYYY"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              Avg. Days Spent in India
            </label>
            <input
              type="number"
              value={averageIndiaDays !== null && averageIndiaDays !== undefined ? averageIndiaDays : ''}
              onChange={(e) =>
                setAverageIndiaDays(e.target.value === '' ? null : Number(e.target.value))
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              placeholder="25"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <IndianRupee className="w-4 h-4 text-yellow-500" />
              Passive Income
            </label>
            <input
              type="number"
              value={passiveIncome !== null && passiveIncome !== undefined ? passiveIncome : ''}
              onChange={(e) =>
                setPassiveIncome(e.target.value === '' ? null : Number(e.target.value))
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              placeholder="120000"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <IndianRupee className="w-4 h-4 text-yellow-500" />
              Expected CTC
            </label>
            <input
              type="number"
              value={expectedCTC !== null && expectedCTC !== undefined ? expectedCTC : ''}
              onChange={(e) =>
                setExpectedCTC(e.target.value === '' ? null : Number(e.target.value))
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              placeholder="1000000"
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

        <div className="text-center mb-12">
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-md hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[160px]"
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

        {/* {!showResults && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Preview: How your results will look</h3>
              <p className="text-gray-500">Sample output showing different status types</p>
            </div>
            <StatusResults results={previewResults} />
          </div>
        )} */}

        {showResults && (
          <StatusResults results={results} />
        )}
      </div>
    </div>
  );
};

export default Index;
