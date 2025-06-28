import { useState } from 'react';
import { uploadResume, getInsights } from '../api';
import InsightDisplay from './InsightDisplay';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [insight, setInsight] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const uploadResult = await uploadResume(file);
    const insightData = await getInsights(uploadResult.id);
    setInsight(insightData);

    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ id: uploadResult.id, name: file.name, ...insightData });
    localStorage.setItem('history', JSON.stringify(history));
  };

  return (
    <div>
      <input
  type="file"
  accept="application/pdf"
  onChange={e => setFile(e.target.files[0])}
  className="border border-gray-300 rounded p-2"
/>
<button
  onClick={handleUpload}
  className="ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ">
  Upload
</button>

      {insight && <InsightDisplay insight={insight} />}
    </div>
  );
}
