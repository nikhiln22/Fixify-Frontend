import React, { useState } from "react";
import { Plus, X, Camera, FileImage } from "lucide-react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

interface TechnicianCertificatesSectionProps {
  certificates?: string[];
  onCertificatesUpdate: (files: File[]) => Promise<void>;
  isLoading: boolean;
  isEditable: boolean;
}

export const TechnicianCertificatesSection: React.FC<
  TechnicianCertificatesSectionProps
> = ({
  certificates = [],
  onCertificatesUpdate,
  isLoading,
  isEditable = true,
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );
  const [isAddingCertificates, setIsAddingCertificates] = useState(false);
  const [newCertificates, setNewCertificates] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} is not a supported image format.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(validateFile);
      setNewCertificates((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(validateFile);
      setNewCertificates((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeCertificateFile = (index: number) => {
    setNewCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (newCertificates.length === 0) {
      setIsAddingCertificates(false);
      return;
    }

    try {
      await onCertificatesUpdate(newCertificates);
      setNewCertificates([]);
      setIsAddingCertificates(false);
    } catch (error) {
      console.error("Error uploading certificates:", error);
    }
  };

  const handleCancel = () => {
    setIsAddingCertificates(false);
    setNewCertificates([]);
  };

  const getTotalFileSize = () => {
    return newCertificates.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-md">
        <div className="p-8 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Certificates
            </h2>
          </div>
          {isEditable && (
            <button
              onClick={() => setIsAddingCertificates(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Certificates
            </button>
          )}
        </div>

        <div className="p-8">
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <div className="bg-white px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 truncate">
                      Certificate {index + 1}
                    </h4>
                  </div>
                  <div className="p-4 h-40 flex items-center justify-center bg-gray-50">
                    <img
                      src={cert}
                      alt={`Certificate ${index + 1}`}
                      className="max-h-full max-w-full object-contain rounded transition-transform hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/150/100";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No certificates uploaded yet
              </h3>
              <p className="text-gray-500 mb-6">
                {isEditable
                  ? "Add your professional certificates to build credibility"
                  : "No certificates available"}
              </p>
              {isEditable && (
                <button
                  onClick={() => setIsAddingCertificates(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Upload Your First Certificate
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        title="Certificate Preview"
        cancelText="Close"
        className="max-w-4xl"
      >
        {selectedCertificate && (
          <div className="max-h-[70vh] overflow-auto">
            <img
              src={selectedCertificate}
              alt="Certificate"
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/800/600";
              }}
            />
          </div>
        )}
      </Modal>

      {isEditable && (
        <Modal
          isOpen={isAddingCertificates}
          onClose={handleCancel}
          title="Add New Certificates"
          className="max-w-2xl"
        >
          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
            >
              <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop certificate images here
              </h3>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="certificate-upload"
              />
              <label
                htmlFor="certificate-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-3">
                Supported formats: JPEG, PNG, WebP • Max size: 5MB per file
              </p>
            </div>

            {newCertificates.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    Selected Files ({newCertificates.length})
                  </h4>
                  <span className="text-sm text-gray-500">
                    Total: {formatFileSize(getTotalFileSize())}
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {newCertificates.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileImage className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-700 block truncate max-w-48">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCertificateFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isLoading || newCertificates.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex-1"
              >
                {isLoading
                  ? "Uploading..."
                  : `Upload ${newCertificates.length} Certificate${newCertificates.length !== 1 ? "s" : ""}`}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-6 py-2"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
