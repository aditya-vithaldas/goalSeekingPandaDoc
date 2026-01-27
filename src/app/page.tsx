"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { companies } from "@/data/mock-data";
import { CompanyCard } from "@/components/company/company-card";
import { Button, SearchInput, Card, Badge, StatGrid } from "@/components/ui";
import { useContractFlow } from "@/lib/store";
import {
  Plus,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
  Filter,
  LayoutGrid,
  List,
  Zap,
  Target,
  Shield,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { startNewContract } = useContractFlow();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      !selectedIndustry || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(companies.map((c) => c.industry)));

  const totalContracts = companies.reduce((sum, c) => sum + c.totalContracts, 0);
  const totalRevenue = companies.reduce((sum, c) => sum + c.totalRevenue, 0);
  const activeContracts = companies.reduce(
    (sum, c) => sum + c.activeContracts,
    0
  );

  const handleSelectCompany = (company: (typeof companies)[0]) => {
    startNewContract(company);
    router.push(`/contract/new?company=${company.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-accent-purple rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ContractFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                Templates
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                Analytics
              </Button>
            </div>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl">
            <Badge variant="purple" size="lg" className="mb-6">
              <Zap className="w-4 h-4" />
              Goal-Centered Contract Design
            </Badge>
            <h1 className="text-display-lg font-bold text-white mb-6">
              Create intelligent contracts that{" "}
              <span className="text-gradient">align with your goals</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Start with a goal, analyze risks, leverage historical insights, and
              generate contracts that actually make sense for your business
              relationships.
            </p>

            {/* Quick stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {companies.length}
                  </p>
                  <p className="text-sm text-slate-400">Companies</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalContracts}
                  </p>
                  <p className="text-sm text-slate-400">Contracts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-accent-yellow" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${(totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-slate-400">Total Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-display-sm font-bold text-slate-900">
              Select a Company
            </h2>
            <p className="text-lg text-slate-500 mt-2">
              Choose a company to start creating a goal-driven contract
            </p>
          </div>
          <Button>
            <Plus className="w-5 h-5" />
            Add Company
          </Button>
        </div>

        {/* Filters and search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search companies..."
              value={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={selectedIndustry === null ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedIndustry(null)}
            >
              All
            </Button>
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Company grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              variant={viewMode === "grid" ? "detailed" : "default"}
              onClick={() => handleSelectCompany(company)}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No companies found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}

        {/* Features section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-bold text-slate-900">
              How it works
            </h2>
            <p className="text-lg text-slate-500 mt-2">
              A smarter approach to contract creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Define Your Goal
              </h3>
              <p className="text-slate-500">
                Start with what you want to achieve. Upload a proposal or describe
                your objective in plain language.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 bg-accent-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Intelligent Analysis
              </h3>
              <p className="text-slate-500">
                Analyze risk profiles, review historical insights, and assess
                competitive landscape automatically.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 bg-accent-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-accent-green" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Smart Templates
              </h3>
              <p className="text-slate-500">
                Get template recommendations based on your specific context, or
                start from scratch with AI assistance.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
