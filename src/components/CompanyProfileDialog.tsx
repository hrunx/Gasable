import React from 'react';
import { X } from 'lucide-react';

interface CompanyProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CompanyProfileDialog: React.FC<CompanyProfileDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Complete Company Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          // TODO: Implement form submission
          onSubmit({});
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Company Registration Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter registration number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                VAT Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter VAT number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter company email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter company phone"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfileDialog;