import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { X, Upload, FileText, CheckCircle, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';

interface CsvUploadModalProps {
  onClose: () => void;
  onUpload: (leads: any[]) => Promise<void>;
}

export default function CsvUploadModal({ onClose, onUpload }: CsvUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const leads = results.data.map((row: any) => {
            const getField = (row: any, keys: string[]) => {
              for (const key of keys) {
                const foundKey = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, ''));
                if (foundKey) return row[foundKey];
              }
              return '';
            };

            return {
              first_name: getField(row, ['first_name', 'firstName', 'givenname', 'name']),
              last_name: getField(row, ['last_name', 'lastName', 'surname', 'familyname']),
              email: getField(row, ['email', 'emailaddress', 'mail']),
              phone: getField(row, ['phone', 'phonenumber', 'mobile', 'cell', 'contact']),
              company: getField(row, ['company', 'organization', 'business', 'employer'])
            };
          }).filter((lead: any) => lead.email);

          if (leads.length === 0) {
            throw new Error('No valid leads found in CSV. Please ensure an "email" column exists.');
          }

          const response = await onUpload(leads);
          setResult(response);
        } catch (err: any) {
          setError(err.message || 'Failed to process CSV file.');
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-apple-500/20 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300">
      <div className={`bg-white p-8 md:p-10 rounded-apple-2xl border border-apple-100 w-full max-w-lg shadow-apple-medium relative overflow-hidden transition-all duration-500 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-apple-200 hover:text-apple-400 transition-colors bg-apple-50 p-2 rounded-full"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                <Upload className="text-primary" size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-apple-500 tracking-tight">Import Leads</h2>
                <p className="text-[10px] font-bold text-apple-200 uppercase tracking-widest">Bulk CSV Data Ingestion</p>
            </div>
        </div>

        {!result ? (
          <>
            <div className="mb-6">
              <div className="bg-apple-50/50 p-5 rounded-xl border border-apple-100 flex items-start space-x-4">
                <FileText size={20} className="text-primary mt-0.5" />
                <p className="text-xs text-apple-400 font-medium leading-relaxed">
                  Upload your <code className="text-primary font-bold">.CSV</code> records. 
                  The system requires at least an <strong className="text-apple-500">email</strong> column for mapping.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-semibold flex items-center gap-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="mb-8 group">
              <label className="block text-[10px] font-bold text-apple-300 uppercase tracking-wider mb-3 ml-1">CSV File</label>
              <div className="relative">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                />
                <label 
                    htmlFor="csv-upload"
                    className={`w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed rounded-apple-xl cursor-pointer transition-all duration-300 ${file ? 'border-primary/40 bg-primary/5' : 'border-apple-100 bg-apple-50/30 hover:border-apple-200 hover:bg-apple-50'}`}
                >
                    <Upload className={`mb-3 transition-colors ${file ? 'text-primary' : 'text-apple-200'}`} size={28} />
                    <span className={`text-sm font-bold truncate max-w-xs transition-colors ${file ? 'text-primary' : 'text-apple-300'}`}>
                        {file ? file.name : 'Choose a file or drag it here'}
                    </span>
                    {!file && <span className="text-[9px] font-bold text-apple-200 uppercase tracking-widest mt-1">UTF-8 Encoded CSV</span>}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-apple-xl text-apple-300 hover:text-apple-500 hover:bg-apple-50 transition-all font-bold text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-[2] py-3 bg-primary text-white rounded-apple-xl hover:bg-primary-dark transition-all shadow-apple-soft disabled:opacity-50 font-bold text-sm tracking-tight active:scale-95"
              >
                {loading ? 'Processing...' : 'Upload & Import'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 p-6 rounded-apple-xl shadow-apple-soft">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle size={24} />
                <h3 className="text-xl font-bold text-apple-500 tracking-tight">Import Complete</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 p-4 rounded-xl border border-emerald-100/50">
                    <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest block mb-1">New Leads</span>
                    <strong className="text-3xl text-emerald-700 font-bold tracking-tighter">{result.successful}</strong>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-red-100/50">
                    <span className="text-[10px] font-bold text-red-700/60 uppercase tracking-widest block mb-1">Failed</span>
                    <strong className="text-3xl text-red-500 font-bold tracking-tighter">{result.failed}</strong>
                  </div>
              </div>
            </div>
            
            {result.errors && result.errors.length > 0 && (
              <div className="mt-6 bg-apple-50 rounded-xl border border-apple-100 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-apple-300">Errors Detected:</h4>
                </div>
                <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="text-[11px] text-apple-400 list-none space-y-2 font-medium">
                    {result.errors.map((err: any, idx: number) => (
                        <li key={idx} className="bg-white p-2.5 rounded-lg border border-apple-100 flex items-center gap-2">
                          <span className="text-apple-200 font-bold text-[9px] w-12 shrink-0">Row {err.row}</span>
                          <span className="truncate flex-1 font-semibold">{err.email}</span>
                          <span className="text-red-400 text-[10px]">{err.error}</span>
                        </li>
                    ))}
                    </ul>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-white border border-apple-100 text-apple-500 rounded-apple-xl hover:bg-apple-50 transition-all font-bold text-sm tracking-tight shadow-apple-soft active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
