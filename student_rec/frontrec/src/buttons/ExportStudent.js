import { FaDownload } from 'react-icons/fa';

export default function ExportStudent() {
  const handleExport = async () => {
    try {
      const res = await fetch('http://192.168.0.219/student_rec/rec/api/export.php');
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 text-sm rounded-full hover:bg-green-700"
    >
      <FaDownload />
    </button>
  );
}
