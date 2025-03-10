import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.txt')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid .txt file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
    }
    setIsUploading(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Upload Configuration</h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">
            Upload Triggers and Responses File
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".txt"
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Configuration"}
        </Button>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Upload History</h3>
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">this012.txt</div>
                  <div className="text-sm text-muted-foreground">
                    Uploaded: 3/3/2025, 1:10:41 AM
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  Processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
