
import React, { useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step13_Photos: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>(data.images || []);
  const { user } = useAuth();

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    if (!user) return;

    setUploading(true);
    const newProgress: number[] = [];
    const newURLs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `ideas/${user.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          newProgress[i] = Math.round(percent);
          setProgress([...newProgress]);
        },
        (error) => {
          console.error('Upload failed', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          newURLs.push(downloadURL);
          if (newURLs.length === files.length) {
            setImageURLs(newURLs);
            onNext({ images: newURLs, featureImage: newURLs[0] });
            setUploading(false);
          }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Add Images (up to 3)</h2>

      <input type="file" accept="image/*" multiple onChange={handleFilesChange} disabled={uploading || imageURLs.length >= 3} />

      {uploading && (
        <div>
          {progress.map((p, i) => (
            <div key={i} className="text-sm text-gray-600 dark:text-gray-300">
              Upload {i + 1}: {p}%
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        {imageURLs.map((url, idx) => (
          <img key={idx} src={url} alt={`Uploaded ${idx}`} className="w-full h-24 object-cover rounded-md" />
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">Back</button>
        <button
          onClick={() => onNext({ images: imageURLs, featureImage: imageURLs[0] })}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full shadow"
          disabled={uploading}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step13_Photos;
