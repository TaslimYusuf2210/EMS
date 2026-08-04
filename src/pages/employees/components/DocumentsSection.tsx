import { useState, useRef } from 'react';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { toast } from 'sonner';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee, Document } from '../../../types/dashboard/employee';
import { useAddDocument } from '@/hooks/useMutation/useAddDocument';
import { useDeleteDocument } from '@/hooks/useMutation/useDeleteDocument';
import { uploadToCloudinary } from '../../../services/cloudinary';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

/** Download a document via the backend proxy (sends auth token) */
async function downloadDocument(
  docId: string,
  filename: string,
  employeeId: string,
) {

  const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');

  const url = `${API_BASE}/employees/${employeeId}/documents/${docId}/download`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server returned ${res.status}: ${text}`);
    }

    const blob = await res.blob();

    if (blob.size === 0) throw new Error('Received empty file from server');

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    toast.error('Unable to download this file. The document storage may be temporarily unavailable.');
  }
}

interface DocumentsSectionProps {
  documents: Employee['Documents'];
  employeeId: string;
}

const DOCUMENT_TYPES: Document['type'][] = [
  'Resume',
  'Employment Letter',
  'Certificates',
  'Other Documents',
];

export function DocumentsSection({ documents, employeeId }: DocumentsSectionProps) {
  const { mutateAsync: addDocument, isPending: isAdding } = useAddDocument(employeeId);
  const { mutateAsync: deleteDocument } = useDeleteDocument(employeeId);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    file: null as File | null,
    name: '',
    type: 'Resume' as Document['type'],
  });

  const documentsList = documents ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setForm((prev) => ({
        ...prev,
        file,
        name: file.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.name) return;

    setUploading(true);
    try {
      const fileUrl = await uploadToCloudinary(form.file);
      const payload = { name: form.name, type: form.type, fileUrl };
      await addDocument(payload);
      setForm({ file: null, name: '', type: 'Resume' });
      setShowDialog(false);
    } catch (err: any) {
      // Only fires for Cloudinary errors — the hook's onError handles backend failures
      // If both fail, you'll see two toasts, which is fine
      toast.error(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    setDeleteLoadingId(docId);
    try {
      await deleteDocument(docId);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const isBusy = uploading || isAdding;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Documents Roster</h3>
        <button
          onClick={() => {
            setForm({ file: null, name: '', type: 'Resume' });
            setShowDialog(true);
          }}
          className="px-3 py-1.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Document
        </button>
      </div>

      <Dialog open={showDialog} onClose={() => { setShowDialog(false); setUploading(false); }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">Upload Document</h3>
          <div className="space-y-4">
            {/* File picker */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#ccd5ae] transition-colors"
              >
                {form.file ? (
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{form.file.name}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">{(form.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 mx-auto text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-neutral-500 mt-2">Click to select a file</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Document name */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Document Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Contract_Signed.pdf"
                className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]"
              />
            </div>

            {/* Document type */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as Document['type'] }))}
                className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => { setShowDialog(false); setUploading(false); }} className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={isBusy || !form.file}
              className="px-4 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {uploading ? (
                <><Hourglass size={14} /> Uploading...</>
              ) : isAdding ? (
                <><Hourglass size={14} /> Saving...</>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </form>
      </Dialog>

      {documentsList.length === 0 ? (
        <div className="text-center text-neutral-400 text-xs py-6">No documents uploaded.</div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {documentsList.map((doc) => (
            <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-neutral-900">{doc.name}</h5>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Type: {doc.type} | Uploaded: {doc.uploadDate}</span>
              </div>
              <div className="flex gap-2">
                {doc.fileUrl && (
                  <button
                    onClick={() => downloadDocument(doc.id, doc.name, employeeId)}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold rounded-lg text-neutral-700 transition-all cursor-pointer"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleteLoadingId === doc.id}
                  className="px-2 py-1 bg-red-50 hover:bg-red-100 text-[10px] font-bold rounded-lg text-red-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleteLoadingId === doc.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
