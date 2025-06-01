import React, { useState, useRef, useEffect } from "react";
import { Edit, Save, X, Upload } from "lucide-react";
import Button from "../common/Button";
import { ProfileCardProps, ProfileData } from "../../types/component.types";

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  phone,
  image,
  role,
  Designation,
  yearsOfExperience,
  isEditable = true,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<ProfileData>({
    name,
    phone,
    image,
    Designation,
    yearsOfExperience,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditData({
        name,
        phone,
        image,
        Designation,
        yearsOfExperience,
      });
    }
  }, [name, phone, image, Designation, yearsOfExperience, isEditing]);

  const currentPhoto = isEditing 
    ? (imageRemoved ? null : editData.image) 
    : image;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      name,
      phone,
      image,
      Designation,
      yearsOfExperience,
    });
    setSelectedFile(null);
    setImageRemoved(false); 
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name,
      phone,
      image,
      Designation,
      yearsOfExperience,
    });
    setSelectedFile(null);
    setImageRemoved(false); 
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | number
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageRemoved(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setEditData((prev) => ({
      ...prev,
      image: undefined,
    }));
    setSelectedFile(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveClick = async () => {
    if (onSave && !isSaving) {
      console.log("=== DEBUGGING handleSaveClick ===");
      console.log("editData:", editData);
      console.log("selectedFile:", selectedFile);
      console.log("imageRemoved:", imageRemoved);

      setIsSaving(true);

      const formData = new FormData();

      formData.append("username", editData.name || "");
      formData.append("phone", editData.phone?.toString() || "");

      if (selectedFile && selectedFile instanceof File) {
        formData.append("image", selectedFile);
      } else if (imageRemoved) {
        formData.append("removeImage", "true");
      }

      if (role === "technician") {
        formData.append("designation", editData.Designation || "");
        formData.append(
          "yearsOfExperience",
          editData.yearsOfExperience?.toString() || "0"
        );
      }

      try {
        await onSave(formData);
        
        setIsEditing(false);
        setImageRemoved(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden w-full">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 mr-8 relative">
            <div
              className={`w-40 h-48 rounded-xl border border-gray-200 ${
                isEditing && isEditable
                  ? "cursor-pointer hover:border-blue-400"
                  : ""
              }`}
              onClick={isEditing && isEditable ? triggerFileInput : undefined}
            >
              {currentPhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={currentPhoto}
                    alt={`${name}'s profile`}
                    className="w-full h-full rounded-xl object-cover"
                  />
                  {isEditing && isEditable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhotoRemove();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-2">
                    <Upload className="w-8 h-8 text-gray-500" />
                  </div>
                  {isEditing && isEditable && (
                    <p className="text-sm text-gray-500 text-center px-2">
                      Click to upload photo
                    </p>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              {isEditing ? (
                <div className="flex-grow mr-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-semibold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Enter name"
                    disabled={isSaving}
                  />
                </div>
              ) : (
                <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
              )}

              {isEditable && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleSaveClick}
                        className="px-4 py-2 flex items-center gap-2"
                        disabled={isSaving}
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
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleEditClick}
                      className="px-4 py-2 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-base w-32">Email:</span>
                <span className="text-gray-800 text-base font-medium">
                  {email}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 text-base w-32">Phone no:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="text-gray-800 text-base font-medium bg-transparent border-b border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Enter phone number"
                    disabled={isSaving}
                  />
                ) : (
                  <span className="text-gray-800 text-base font-medium">
                    {phone}
                  </span>
                )}
              </div>

              {role === "technician" && (
                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">
                    Experience:
                  </span>
                  {isEditing ? (
                    <div className="flex-grow">
                      <input
                        type="number"
                        value={editData.yearsOfExperience || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "yearsOfExperience",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="text-gray-800 text-base font-medium bg-transparent border-b border-gray-300 focus:border-black focus:outline-none w-20"
                        placeholder="0"
                        min="0"
                        max="50"
                        disabled={isSaving}
                      />
                      <span className="text-gray-800 text-base font-medium ml-2">
                        years
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-800 text-base font-medium">
                      {yearsOfExperience || 0} years
                    </span>
                  )}
                </div>
              )}

              {role === "technician" && (
                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">
                    Designation:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.Designation || ""}
                      onChange={(e) =>
                        handleInputChange("Designation", e.target.value)
                      }
                      className="text-gray-800 text-base font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Enter designation"
                      disabled={isSaving}
                    />
                  ) : (
                    <span className="text-gray-800 text-base font-medium">
                      {Designation || "Not specified"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;