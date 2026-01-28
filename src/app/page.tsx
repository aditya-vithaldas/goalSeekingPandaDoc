"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { companies } from "@/data/mock-data";
import { useContractFlow } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Search, Building2, ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { startNewContract } = useContractFlow();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies
    .filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 4);

  const handleSelectCompany = (company: (typeof companies)[0]) => {
    startNewContract(company);
    router.push(`/contract/new?company=${company.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Simple header */}
        <h1 className="text-2xl font-semibold text-slate-900 mb-8">
          New Contract
        </h1>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 focus:ring-0"
          />
        </div>

        {/* Company list */}
        <div className="space-y-2">
          {filteredCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleSelectCompany(company)}
              className={cn(
                "w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200",
                "hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{company.name}</p>
                  <p className="text-sm text-slate-500">{company.industry}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No companies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
