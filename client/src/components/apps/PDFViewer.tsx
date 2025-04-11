
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function PDFViewer() {
  const [file, setFile] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFile(url);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <Input 
        type="file" 
        accept=".pdf" 
        onChange={onFileChange} 
        className="bg-background"
      />
      {file && (
        <div className="flex-1 overflow-auto">
          <iframe
            src={file}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      )}
    </div>
  );
}
