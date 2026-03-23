"use client";

import React from "react";
import { PieChart, TrendingUp } from "lucide-react";

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart size={18} className="text-gray-400" />
          Verification Status
        </h3>
        <div className="flex items-center justify-center py-8">
          {/* Simple visual representation using CSS */}
          <div className="flex gap-4 items-end h-40">
            <div className="w-16 bg-green-500 rounded-t-lg h-3/4 relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                75%
              </span>
            </div>
            <div className="w-16 bg-red-400 rounded-t-lg h-1/6 relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                10%
              </span>
            </div>
            <div className="w-16 bg-amber-400 rounded-t-lg h-1/4 relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                15%
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Passed
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div> Failed
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div> Pending
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-gray-400" />
          Common Rejection Reasons
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Blurred Document</span>
              <span className="font-medium text-gray-900">42%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full"
                style={{ width: "42%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Expired ID</span>
              <span className="font-medium text-gray-900">28%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full"
                style={{ width: "28%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Name Mismatch</span>
              <span className="font-medium text-gray-900">15%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full"
                style={{ width: "15%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
