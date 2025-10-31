"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  key: string;
}

const TableFilter = ({ filters }: { filters: FilterOption[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(key) === value) {
      // If already selected, remove filter
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page"); // Reset to page 1 when filtering
    router.push(`${pathname}?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    filters.forEach((filter) => params.delete(filter.key));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setShowFilters(false);
  };

  // Count unique filter keys that are active
  const activeFilterKeys = new Set(
    filters.map((f) => f.key).filter((key) => searchParams.get(key))
  );
  const activeFilterCount = activeFilterKeys.size;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow relative"
      >
        <Image src="/filter.png" alt="Filter" width={14} height={14} />
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-4 z-20 min-w-[200px] max-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filters.map((filter) => (
                <button
                  key={`${filter.key}-${filter.value}`}
                  onClick={() => handleFilter(filter.key, filter.value)}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                    searchParams.get(filter.key) === filter.value
                      ? "bg-lamaSkyLight text-lamaSky font-medium"
                      : ""
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableFilter;
