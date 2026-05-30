import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import LeadTable from '@/components/LeadTable';
import AddLeadModal from '@/components/AddLeadModal';
import CsvUploadModal from '@/components/CsvUploadModal';
import QualifiedAlert from '@/components/QualifiedAlert';
import { LeadService } from '@/lib/api';
import { Plus, Upload, Search, Database } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const fetchLeads = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await LeadService.getLeads({ search, status });
      setLeads(data);
    } catch (e) {
      console.error("Leads Sync Error:", e);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(true);
    
    // Polling interval: 30 seconds for background sync
    const interval = setInterval(() => fetchLeads(false), 30000);
    return () => clearInterval(interval);
  }, [search, status]);

  const handleSaveLead = async (leadData: any) => {
    await LeadService.createLead(leadData);
    fetchLeads(true);
  };

  const handleUploadCsv = async (leadsData: any[]) => {
    const result = await LeadService.createLeadsBulk(leadsData);
    fetchLeads();
    return result;
  };

  const handleDeleteLead = async (id: number) => {
    try {
        await LeadService.deleteLead(id);
        fetchLeads();
    } catch (e) {
        console.error(e);
        alert("Failed to delete lead. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-apple-500 tracking-tight">Leads</h1>
          <p className="text-apple-300 mt-1.5 text-sm font-medium">Manage and monitor your prospective customers.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={() => setShowCsvModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 bg-white border border-apple-100 rounded-apple-xl text-apple-400 hover:bg-apple-50 hover:text-apple-500 transition-all shadow-apple-soft font-bold text-xs uppercase tracking-wider group"
          >
            <Upload className="w-4 h-4 mr-2.5 transition-transform group-hover:-translate-y-0.5" />
            Import CSV
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 bg-primary text-white rounded-apple-xl hover:bg-primary-dark transition-all shadow-apple-soft font-bold text-xs uppercase tracking-wider active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {!loading && <QualifiedAlert leads={leads} />}

      <div className="relative">
        {loading ? (
          <div className="bg-white rounded-apple-2xl border border-apple-100 p-20 shadow-apple-soft flex flex-col justify-center items-center h-[500px]">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 mb-6 animate-pulse">
              <Database className="text-primary animate-bounce" size={24} />
            </div>
            <p className="text-apple-200 font-bold uppercase tracking-widest text-[10px]">Synchronizing Leads...</p>
          </div>
        ) : (
          <LeadTable 
            leads={leads}
            onSearch={setSearch}
            onFilter={setStatus}
            onDelete={handleDeleteLead}
          />
        )}
      </div>

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} onSave={handleSaveLead} />}
      {showCsvModal && <CsvUploadModal onClose={() => setShowCsvModal(false)} onUpload={handleUploadCsv} />}
    </Layout>
  );
}
