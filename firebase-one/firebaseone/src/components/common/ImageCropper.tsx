import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./ImageCropper.css";

interface ImageCropperProps {
  onCroppedImage: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onCroppedImage,
  onCancel,
  aspectRatio = 1,
}) => {
  const [src, setSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      onCroppedImage(croppedImage);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-content">
        {!src ? (
          <div className="upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="file-input"
            />
            <p>Select an image to crop</p>
          </div>
        ) : (
          <>
            <ReactCrop
              crop={crop}
              onChange={(c: Crop) => setCrop(c)}
              onComplete={(c: PixelCrop) => setCompletedCrop(c)}
              aspect={aspectRatio}
            >
              <img
                ref={imgRef}
                src={src}
                alt="Crop me"
                style={{ maxHeight: "70vh" }}
              />
            </ReactCrop>
            <div className="button-group">
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
