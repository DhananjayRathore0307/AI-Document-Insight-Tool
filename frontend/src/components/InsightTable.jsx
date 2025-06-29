import React, { useEffect, useState } from "react";

const InsightTable = () => {
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInsights = () => {
    fetch("http://localhost:8000/insights/all")
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching insights:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this insight?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/insights/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updated = { ...insights };
        delete updated[id];
        setInsights(updated);
      } else {
        alert("Failed to delete insight.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("An error occurred.");
    }
  };

  if (loading) return <p>Loading insights...</p>;

  const rows = Object.entries(insights);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uploaded PDF Insights</h2>
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Insight</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, data]) => (
              <tr key={id} className="border-t">
                <td className="px-4 py-2 font-mono text-sm">{id}</td>
                <td className="px-4 py-2">
                  {data.summary
                    ? data.summary
                    : data.topWords?.join(", ") || "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsightTable;
