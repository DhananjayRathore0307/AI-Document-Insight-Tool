export default function History() {
  const history = JSON.parse(localStorage.getItem('history')) || [];

  return (
    <div>
     <h2 className="text-xl font-semibold mb-4">Upload History</h2>
{history.length === 0 ? (
  <p className="text-gray-500">No uploads yet.</p>
) : (
  <ul className="space-y-3">
    {history.map((entry, idx) => (
      <li key={idx} className="border p-3 rounded bg-white shadow">
        <strong className="block text-blue-700">{entry.name}</strong>
        <div className="text-gray-700">{entry.summary || entry.topWords?.join(', ')}</div>
      </li>
    ))}
  </ul>
)}
    </div>
  );
}
