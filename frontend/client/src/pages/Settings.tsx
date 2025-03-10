import { useState } from "react";
import Header from "../components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

type TrainingFile = {
  file: File;
  type: 'wordboard' | 'conversation' | 'usecase' | 'other';
  trainingMode: 'hybrid' | 'wordboard' | 'generative';
};

export default function Settings() {
  const [modelType, setModelType] = useState("gpt-4");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<TrainingFile['type']>('wordboard');
  const [trainingMode, setTrainingMode] = useState<TrainingFile['trainingMode']>('hybrid');
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([]);
  const [enableMcp, setEnableMcp] = useState(false);
  const [mcpEndpoint, setMcpEndpoint] = useState("");
  const [mcpApiKey, setMcpApiKey] = useState("");
  const [mcpProtocol, setMcpProtocol] = useState<'goose' | 'standard'>('standard');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile(file);
    }
  };

  const handleAddFile = () => {
    if (!currentFile) return;

    setTrainingFiles(prev => [...prev, {
      file: currentFile,
      type: fileType,
      trainingMode: trainingMode
    }]);

    setCurrentFile(null);
    const input = document.getElementById('doc-upload') as HTMLInputElement;
    if (input) input.value = '';

    toast({
      title: "Document Added",
      description: "Would you like to add another document for training?",
      action: (
        <Button variant="outline" onClick={() => {
          document.getElementById('doc-upload')?.click();
        }}>
          Add Another
        </Button>
      ),
    });
  };

  const removeTrainingFile = (index: number) => {
    setTrainingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Header title="Settings" />

      <div className="grid gap-6">
        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              Train Alley
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-[#111318] p-4 rounded-lg border border-brand-silver/20">
                  <h3 className="font-bold text-brand-silver mb-2">📚 How to Train Alley:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-sm font-medium text-brand-silver">Upload your Word Board templates (.wordboard.html)</li>
                    <li className="text-sm font-medium text-brand-silver">Add past successful conversations (.csv, .json)</li>
                    <li className="text-sm font-medium text-brand-silver">Include use case documents (.pdf, .html)</li>
                    <li className="text-sm font-medium text-brand-silver">Tag each document with its purpose</li>
                    <li className="text-sm font-medium text-brand-silver">Choose how Alley should learn from each document</li>
                  </ul>
                </div>

                <div className="bg-[#111318] relative overflow-hidden rounded-lg p-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
                  <div className="relative">
                    <Label>1. Choose a Document</Label>
                    <div className="mt-2">
                      <Input
                        id="doc-upload"
                        type="file"
                        accept=".txt,.json,.csv,.html,.pdf,.wordboard.html"
                        onChange={handleFileChange}
                        className="bg-[#111318] border-brand-silver/20 text-brand-silver hover:border-brand-accent/50 transition-colors"
                      />
                    </div>

                    {currentFile && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label>2. What type of document is this?</Label>
                          <div className="mt-2">
                            <Select
                              value={fileType}
                              onValueChange={(value: TrainingFile['type']) => setFileType(value)}
                            >
                              <SelectTrigger className="bg-[#111318] border-brand-silver/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wordboard">Word Board Template</SelectItem>
                                <SelectItem value="conversation">Past Conversations</SelectItem>
                                <SelectItem value="usecase">Use Case Document</SelectItem>
                                <SelectItem value="other">Other Training Material</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>3. How should Alley learn from this?</Label>
                          <div className="mt-2 bg-[#111318] border border-brand-silver/20 rounded-lg p-3">
                            <RadioGroup
                              value={trainingMode}
                              onValueChange={(value: TrainingFile['trainingMode']) => setTrainingMode(value)}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hybrid" id="hybrid" />
                                <Label htmlFor="hybrid">Smart Learning (Word Board + AI)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="wordboard" id="wordboard" />
                                <Label htmlFor="wordboard">Exact Responses Only</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="generative" id="generative" />
                                <Label htmlFor="generative">AI Learning Only</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <Button
                          onClick={handleAddFile}
                          className="w-full bg-gradient-to-r from-brand-accent to-brand-purple hover:opacity-90 transition-opacity"
                        >
                          Add Document
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {trainingFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Documents:</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {trainingFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">{file.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Type: {file.type} • Learning: {file.trainingMode}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTrainingFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      console.log('Saving training setup:', trainingFiles);
                      toast({
                        title: "Training Setup Saved",
                        description: "Your documents have been saved. You can start training when ready.",
                      });
                    }}
                  >
                    Save Setup
                  </Button>

                  <Button
                    className="flex-1"
                    disabled={trainingFiles.length === 0}
                    onClick={() => {
                      console.log('Starting training with:', trainingFiles);
                      toast({
                        title: "Training Started",
                        description: "Alley is now learning from your documents.",
                      });
                    }}
                  >
                    Start Training
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              AI Configuration
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input type="password" placeholder="Enter your OpenAI API key" />
              </div>
              <div className="space-y-2">
                <Label>AI Model Selection</Label>
                <RadioGroup value={modelType} onValueChange={setModelType} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gpt-4" id="gpt-4" />
                    <Label htmlFor="gpt-4">GPT-4</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gpt-3.5-turbo" id="gpt-3.5" />
                    <Label htmlFor="gpt-3.5">GPT-3.5 Turbo</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Model Temperature</Label>
                <Input type="number" placeholder="0.7" min="0" max="2" step="0.1" />
                <p className="text-sm text-muted-foreground">
                  Controls randomness in responses (0 = deterministic, 2 = most random)
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              Model Context Protocol (MCP)
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable MCP</Label>
                  <p className="text-sm text-muted-foreground">
                    Access external resources when encountering untrained topics
                  </p>
                </div>
                <Switch
                  checked={enableMcp}
                  onCheckedChange={setEnableMcp}
                />
              </div>

              {enableMcp && (
                <>
                  <div className="space-y-2">
                    <Label>MCP Endpoint</Label>
                    <Input
                      type="url"
                      placeholder="Enter your MCP endpoint URL"
                      value={mcpEndpoint}
                      onChange={(e) => setMcpEndpoint(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>MCP API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your MCP API key"
                      value={mcpApiKey}
                      onChange={(e) => setMcpApiKey(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Protocol Type</Label>
                    <Select
                      value={mcpProtocol}
                      onValueChange={(value: 'goose' | 'standard') => setMcpProtocol(value)}
                    >
                      <SelectTrigger className="bg-[#111318] border-brand-silver/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goose">Goose Protocol</SelectItem>
                        <SelectItem value="standard">Standard Protocol</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose the MCP protocol implementation to use
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              Additional API Configurations
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Custom API Endpoint</Label>
                <Input placeholder="Enter your custom API endpoint" />
              </div>
              <div className="space-y-2">
                <Label>API Authentication Token</Label>
                <Input type="password" placeholder="Enter your API authentication token" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging for troubleshooting
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="Enter your webhook URL for notifications" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              n8n Workflow Integration
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>n8n Instance URL</Label>
                <Input
                  type="url"
                  placeholder="Enter your n8n instance URL (e.g., https://your-n8n-instance.com)"
                />
              </div>
              <div className="space-y-2">
                <Label>n8n API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your n8n API key"
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URLs</Label>
                <Textarea
                  placeholder="Enter webhook URLs for your n8n workflows (one per line)"
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  These webhook URLs will be used to trigger n8n workflows
                </p>
              </div>
              <div className="space-y-2">
                <Label>Default Workflow ID</Label>
                <Input
                  placeholder="Enter the default workflow ID"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable n8n Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Activate n8n workflow integration
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-card border-border/20 p-6">
          <div className="absolute inset-0 bg-gradient-glow opacity-5" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              MAKE Integration
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>MAKE API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your MAKE API key"
                  className="bg-[#111318] border-brand-silver/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Organization ID</Label>
                <Input
                  placeholder="Enter your MAKE organization ID"
                  className="bg-[#111318] border-brand-silver/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Scenario ID</Label>
                <Input
                  placeholder="Enter the default scenario ID"
                  className="bg-[#111318] border-brand-silver/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URLs</Label>
                <Textarea
                  placeholder="Enter webhook URLs for your MAKE scenarios (one per line)"
                  className="min-h-[100px] bg-[#111318] border-brand-silver/20"
                />
                <p className="text-sm text-muted-foreground">
                  These webhook URLs will be used to trigger MAKE scenarios
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable MAKE Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Activate MAKE workflow integration for advanced automation
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}