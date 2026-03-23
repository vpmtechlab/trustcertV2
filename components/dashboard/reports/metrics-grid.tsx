"use client";

import React from "react";
import { TrendingUp, CheckCircle, FileText, Clock } from "lucide-react";

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Compliance Score */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Compliance Score</p>
          <h3 className="text-3xl font-bold text-gray-900">92%</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> +4% from last month
          </p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-green-200 flex items-center justify-center">
          <CheckCircle size={24} className="text-green-500" />
        </div>
      </div>

      {/* Total Verifications */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Verifications</p>
          <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
          <p className="text-xs text-gray-500 mt-2">Running total</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <FileText size={24} />
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Reviews</p>
          <h3 className="text-3xl font-bold text-gray-900">14</h3>
          <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
            Requires attention
          </p>
        </div>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
          <Clock size={24} />
        </div>
      </div>
    </div>
  );
}
