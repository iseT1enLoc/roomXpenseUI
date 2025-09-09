import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900 transition-colors"
    >
      <ArrowLeft className="mr-2" /> Quay lại
    </button>
  );
}
