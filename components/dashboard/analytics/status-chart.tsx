import React from "react";

export function StatusChart() {
  const data = [
    { label: "Approved", value: 65, color: "#188015" },
    { label: "Pending", value: 20, color: "#f97316" },
    { label: "Failed", value: 15, color: "#ef4444" },
  ];

  let currentAngle = 0;
  const gradientSegments = data.map((item) => {
    const start = currentAngle;
    const degrees = (item.value / 100) * 360;
    currentAngle += degrees;
    return `${item.color} ${start}deg ${currentAngle}deg`;
  });

  const backgroundStyle = `conic-gradient(${gradientSegments.join(", ")})`;

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Status Distribution</h3>

      <div className="flex-1 flex flex-col md:flex-row lg:flex-col items-center justify-center gap-8">
        {/* The Donut Chart */}
        <div
          className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-inner"
          style={{ background: backgroundStyle }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-gray-800">100%</span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-600">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
