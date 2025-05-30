interface StatusResultsProps {
  results: Array<{
    financialYear: string;
    status: 'RNOR' | 'NR' | 'ROR';
  }>;
}

const StatusResults = ({ results }: StatusResultsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RNOR':
        return 'bg-[#7C5CFF] text-white shadow-lg shadow-purple-200 border-2 border-[#7C5CFF]';
      case 'NR':
        return 'bg-[#ff6b6b] text-white shadow-lg shadow-red-200 border-2 border-[#ff6b6b]';
      case 'ROR':
        return 'bg-[#ffc107] text-white shadow-lg shadow-yellow-400 border-2 border-[#ffc107]';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getSpecialStyling = (status: string) => {
    if (status === 'RNOR') {
      return 'transform hover:scale-110 transition-all duration-300 relative z-10 text-lg font-bold tracking-wide shadow-2xl hover:shadow-emerald-300';
    }
    return 'hover:scale-105 transition-all duration-200';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          RNOR Status Results
        </h2>
        <p className="text-gray-600">Financial year wise residential status calculation</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center group"
            >
              <div className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-2 bg-gray-50 shadow-md px-4 py-2 rounded-full">
                {result.financialYear}
              </div>
              <div className={`
                px-4 py-2 rounded-xl text-xs font-semibold tracking-wide cursor-pointer
                ${getStatusColor(result.status)} 
                ${getSpecialStyling(result.status)}
              `}>
                <span className={result.status === 'RNOR' ? 'drop-shadow-md' : ''}>
                  {result.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex justify-center gap-8 text-sm text-gray-700 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#7C5CFF]"></div>
            <span className="font-medium">RNOR - Resident but Not Ordinarily Resident</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#ff6b6b]"></div>
            <span className="font-medium">NR - Non Resident</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#ffd66b]"></div>
            <span className="font-medium">ROR - Resident and Ordinarily Resident</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusResults;
