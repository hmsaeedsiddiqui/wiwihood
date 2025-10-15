import { CloudinaryDebug } from '@/components/CloudinaryDebug';

export default function CloudinaryTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Cloudinary Debug Page</h1>
        <CloudinaryDebug />
      </div>
    </div>
  );
}