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
        return 'bg-[#1ee1c2] text-white shadow-lg shadow-cyan-200 border-2 border-[#1ee1c2]';
      case 'NR':
        return 'bg-[#8c8c8c] text-white shadow-lg shadow-gray-300 border-2 border-[#8c8c8c]';
      case 'ROR':
        return 'bg-[#fdb04f] text-white shadow-lg shadow-orange-200 border-2 border-[#fdb04f]';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getSpecialStyling = (status: string) => {
    return 'hover:scale-105 transition-all duration-200';
  };

  const hasRNOR = results.some(r => r.status === 'RNOR');
  const hasNR = results.some(r => r.status === 'NR');
  const hasROR = results.some(r => r.status === 'ROR');

  const rnorYears = results.filter(r => r.status === 'RNOR').map(r => r.financialYear);
  const rnorMessage = rnorYears.length > 0
    ? `You qualify as RNOR for ${rnorYears.join(', ')}`
    : 'You do NOT qualify as RNOR for any of the following years.';

  return (
    <div className="w-full">
      <div className="text-center mb-3">
        <h2 className="text-xl sm:text-3xl font-bold text-[#1dc9a9] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          RNOR Status Results
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Financial year wise residential status calculation</p>
      </div>

      <div className="flex justify-center mb-7">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {results.map((result, index) => (
            <div key={index} className="flex flex-row sm:flex-col items-center justify-center gap-2">
              <div className="bg-gray-50 px-3 py-1 rounded-full text-sm font-medium text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {result.financialYear}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(result.status)} ${getSpecialStyling(result.status)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {result.status === 'NR' ? 'NRI' : result.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div
        className="text-center text-lg text-black font-bold tracking-wide mb-1"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {rnorMessage}
      </div>

      <div className="mt-4 text-center">
        <div className="flex justify-center gap-x-3 sm:gap-x-6 gap-y-1 sm:gap-y-3 text-sm text-gray-700 flex-wrap">
          {hasNR && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#8c8c8c]"></div>
              <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>NRI - Non Resident Indian</span>
            </div>
          )}
          {hasRNOR && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#1ee1c2]"></div>
              <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>RNOR - Resident but Not Ordinarily Resident</span>
            </div>
          )}
          {hasROR && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#fdb04f]"></div>
              <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>ROR - Resident and Ordinarily Resident</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusResults;
