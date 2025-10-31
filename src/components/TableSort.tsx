"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SortOption {
  label: string;
  value: string;
}

const TableSort = ({ sortOptions }: { sortOptions: SortOption[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSort, setShowSort] = useState(false);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get("sort");

    if (currentSort === value) {
      // Toggle between asc and desc
      const currentOrder = params.get("order") || "asc";
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", value);
      params.set("order", "asc");
    }

    params.delete("page"); // Reset to page 1 when sorting
    router.push(`${pathname}?${params.toString()}`);
    setShowSort(false);
  };

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order") || "asc";

  return (
    <div className="relative">
      <button
        onClick={() => setShowSort(!showSort)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
      >
        <Image src="/sort.png" alt="Sort" width={14} height={14} />
      </button>

      {showSort && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSort(false)}
          />
          <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-4 z-20 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 flex items-center justify-between ${
                    currentSort === option.value
                      ? "bg-lamaSkyLight text-lamaSky font-medium"
                      : ""
                  }`}
                >
                  <span>{option.label}</span>
                  {currentSort === option.value && (
                    <span className="text-xs">
                      {currentOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableSort;
