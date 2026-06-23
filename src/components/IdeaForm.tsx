import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IdeaFormData, IdeaStatus } from '../types/formTypes';

const statusOptions: IdeaStatus[] = [
  'Just an Idea',
  'Researching',
  'Currently Building',
  'Built and Launched',
  'Iterating and Improving',
];

const textToList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);

const listToText = (items?: string[]) => (items || []).join('\n');

const normalizeIdea = (idea: IdeaFormData): IdeaFormData => ({
  ...idea,
  status: idea.status || 'Just an Idea',
  images: idea.images || [],
  featureImage: idea.featureImage || idea.images?.[0] || '',
});

type IdeaFormProps = {
  initialData?: IdeaFormData;
  heading: string;
  subheading?: string;
  submitLabel: string;
  savingLabel?: string;
  saving?: boolean;
  showAdminControls?: boolean;
  onCancel?: () => void;
  onSubmit: (data: IdeaFormData) => Promise<void>;
};

const IdeaForm: React.FC<IdeaFormProps> = ({
  initialData = {},
  heading,
  subheading,
  submitLabel,
  savingLabel = 'Saving...',
  saving = false,
  showAdminControls = false,
  onCancel,
  onSubmit,
}) => {
  const { user } = useAuth();
  const [idea, setIdea] = useState<IdeaFormData>(() => normalizeIdea(initialData));
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const images = useMemo(() => idea.images || [], [idea.images]);

  const updateField = (field: keyof IdeaFormData, value: string | string[] | number) => {
    setIdea(prev => normalizeIdea({ ...prev, [field]: value }));
  };

  const updateImages = (nextImages: string[], nextFeatureImage?: string) => {
    setIdea(prev => {
      const featureImage =
        nextFeatureImage ||
        (prev.featureImage && nextImages.includes(prev.featureImage) ? prev.featureImage : nextImages[0] || '');

      return normalizeIdea({
        ...prev,
        images: nextImages,
        featureImage,
      });
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) return;
    if (!user) {
      toast.error('Please log in before uploading images.');
      return;
    }

    const openSlots = Math.max(0, 3 - images.length);
    const selectedFiles = files.slice(0, openSlots);

    if (!selectedFiles.length) {
      toast.error('You can add up to 3 images.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const storageRef = ref(storage, `ideas/${user.uid}/${Date.now()}_${safeName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        const downloadUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            snapshot => {
              const fileProgress = snapshot.bytesTransferred / snapshot.totalBytes;
              const overallProgress = ((index + fileProgress) / selectedFiles.length) * 100;
              setUploadProgress(Math.round(overallProgress));
            },
            reject,
            async () => {
              resolve(await getDownloadURL(uploadTask.snapshot.ref));
            }
          );
        });

        uploadedUrls.push(downloadUrl);
      }

      updateImages([...images, ...uploadedUrls]);
      toast.success('Image uploaded.');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!idea.title?.trim() || !idea.problem?.trim() || !idea.solution?.trim()) {
      toast.error('Title, problem, and solution are required.');
      return;
    }

    await onSubmit({
      ...normalizeIdea(idea),
      title: idea.title.trim(),
      problem: idea.problem.trim(),
      solution: idea.solution.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-8 text-gray-800 dark:text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{heading}</h1>
        {subheading && (
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">{subheading}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Core idea</h2>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Title</span>
              <input
                value={idea.title || ''}
                onChange={event => updateField('title', event.target.value)}
                placeholder="Name the idea"
                className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Status</span>
                <select
                  value={idea.status || 'Just an Idea'}
                  onChange={event => updateField('status', event.target.value as IdeaStatus)}
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Target audience</span>
                <input
                  value={idea.targetAudience || ''}
                  onChange={event => updateField('targetAudience', event.target.value)}
                  placeholder="Who is this for?"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Problem</span>
              <textarea
                value={idea.problem || ''}
                onChange={event => updateField('problem', event.target.value)}
                rows={5}
                placeholder="What pain, gap, or unmet need does this address?"
                className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Solution</span>
              <textarea
                value={idea.solution || ''}
                onChange={event => updateField('solution', event.target.value)}
                rows={5}
                placeholder="What is the product, service, or system?"
                className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Business context</h2>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Business model</span>
              <textarea
                value={idea.businessModel || ''}
                onChange={event => updateField('businessModel', event.target.value)}
                rows={5}
                placeholder="How could this make money?"
                className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Why now</span>
                <textarea
                  value={idea.whyNow || ''}
                  onChange={event => updateField('whyNow', event.target.value)}
                  rows={4}
                  placeholder="Why is this opportunity timely?"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Team or needed roles</span>
                <textarea
                  value={idea.team || ''}
                  onChange={event => updateField('team', event.target.value)}
                  rows={4}
                  placeholder="Who would need to help build it?"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Links</span>
              <input
                value={idea.links || ''}
                onChange={event => updateField('links', event.target.value)}
                placeholder="Website, prototype, notes, or research"
                className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Tags and structure</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Industries</span>
                <textarea
                  value={listToText(idea.industry)}
                  onChange={event => updateField('industry', textToList(event.target.value))}
                  rows={5}
                  placeholder="Travel&#10;Consumer"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Features</span>
                <textarea
                  value={listToText(idea.features)}
                  onChange={event => updateField('features', textToList(event.target.value))}
                  rows={5}
                  placeholder="Booking&#10;Payments&#10;Notifications"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Tags</span>
                <textarea
                  value={listToText(idea.tags)}
                  onChange={event => updateField('tags', textToList(event.target.value))}
                  rows={5}
                  placeholder="marketplace&#10;travel"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Images</h2>

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 px-4 py-6 text-center hover:border-yellow-400">
              <span className="text-sm font-semibold">Browse to upload</span>
              <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Up to 3 images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading || images.length >= 3}
                className="sr-only"
              />
            </label>

            {uploading && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Uploading {uploadProgress || 0}%
              </div>
            )}

            <label className="block">
              <span className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">
                External image URL
              </span>
              <div className="flex gap-2">
                <input
                  placeholder="https://..."
                  className="min-w-0 flex-1 border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                  onKeyDown={event => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    const value = event.currentTarget.value.trim();
                    if (!value) return;
                    updateImages([...images, value], images.length ? undefined : value);
                    event.currentTarget.value = '';
                  }}
                />
              </div>
            </label>

            <div className="space-y-3">
              {images.length === 0 && (
                <img
                  src="/No Image Available Placeholder.png"
                  alt="No uploaded images"
                  className="h-40 w-full rounded-md object-cover border border-gray-200 dark:border-gray-700"
                />
              )}

              {images.map(url => (
                <div key={url} className="space-y-2">
                  <img
                    src={url}
                    alt="Idea"
                    className={`h-40 w-full rounded-md object-cover border ${
                      idea.featureImage === url
                        ? 'border-yellow-400'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onError={event => {
                      event.currentTarget.src = '/No Image Available Placeholder.png';
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateImages(images, url)}
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold"
                    >
                      {idea.featureImage === url ? 'Feature image' : 'Set feature'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateImages(images.filter(image => image !== url))}
                      className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {showAdminControls && (
            <section className="space-y-3 rounded-md border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
              <h2 className="text-lg font-semibold">Admin ranking</h2>
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Score adjustment</span>
                <input
                  type="number"
                  value={idea.adminScoreAdjustment || 0}
                  onChange={event => updateField('adminScoreAdjustment', Number(event.target.value) || 0)}
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Use this to move beta cards up or down without changing real votes.
              </p>
            </section>
          )}

          <div className="sticky top-24 space-y-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-md bg-yellow-400 px-5 py-3 font-semibold text-white hover:bg-yellow-500 disabled:opacity-60"
            >
              {saving ? savingLabel : submitLabel}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-5 py-3 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
};

export default IdeaForm;
