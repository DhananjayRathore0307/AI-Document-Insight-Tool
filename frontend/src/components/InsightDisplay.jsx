export default function InsightDisplay({ insight }) {
  return (
    <div className="mt-6 p-4 border rounded shadow-sm bg-gray-50">
  <h2 className="text-lg font-semibold mb-2 text-gray-700">Insights</h2>
  <pre className="text-gray-800 whitespace-pre-wrap">{insight.summary || insight.topWords.join(', ')}</pre>
</div>

  );
}
