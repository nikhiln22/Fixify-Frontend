import React, { useState, useEffect } from "react";
import { Edit2, Save, X } from "lucide-react";
import Button from "../../components/common/Button";

interface TechnicianAboutSectionProps {
  initialAbout?: string;
  onSave: (aboutText: string) => Promise<void>;
  isLoading: boolean;
}

export const TechnicianAboutSection: React.FC<TechnicianAboutSectionProps> = ({
  initialAbout = "",
  onSave,
  isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(initialAbout);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setAboutText(initialAbout);
  }, [initialAbout]);

  const handleEditClick = () => {
    setIsEditing(true);
    setAboutText(initialAbout);
  };

  const handleSaveClick = async () => {
    if (!isSaving && aboutText.trim().length > 0) {
      setIsSaving(true);
      try {
        await onSave(aboutText);
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving about section:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAboutText(initialAbout);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
        
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handleSaveClick}
              className="px-4 py-2 flex items-center gap-2"
              disabled={isSaving || aboutText.trim().length === 0}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="px-4 py-2 flex items-center gap-2"
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="px-4 py-2 flex items-center gap-2"
            disabled={isLoading}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {isEditing ? (
          <>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 leading-relaxed text-base"
              rows={8}
              placeholder="Tell us about yourself, your experience, and expertise..."
              maxLength={1000}
              disabled={isSaving}
            />
          </>
        ) : (
          <>
            <div 
              className="min-h-[120px] cursor-pointer group"
              onClick={handleEditClick}
            >
              <p className="text-gray-700 leading-relaxed text-base group-hover:text-gray-800 transition-colors">
                {initialAbout || (
                  <span className="text-gray-500 italic">
                    No information provided yet. Click here or use the edit button to add your professional background and expertise.
                  </span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};