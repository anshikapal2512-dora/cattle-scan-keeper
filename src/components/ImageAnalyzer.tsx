import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { analyzeImage, initializeAnalyzer, type AnalysisResult } from '@/lib/ai-analyzer';
import { db, type AnimalRecord } from '@/lib/database';
import { toast } from 'sonner';

export function ImageAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setImagePreview(imageUrl);
      
      // Create image element for analysis
      const img = new Image();
      img.onload = async () => {
        if (imageRef.current) {
          imageRef.current.src = imageUrl;
          await performAnalysis(img, imageUrl);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const performAnalysis = async (imageElement: HTMLImageElement, imageUrl: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Initialize AI models if needed
      await initializeAnalyzer();
      
      // Perform analysis
      const analysisResult = await analyzeImage(imageElement);
      setResult(analysisResult);

      // Save to database
      const record: AnimalRecord = {
        imageUrl,
        breed: analysisResult.breed,
        species: analysisResult.species,
        confidence: analysisResult.confidence,
        measurements: analysisResult.measurements,
        detectedAt: new Date(),
        synced: false
      };

      await db.animals.add(record);
      toast.success('Analysis complete! Animal record saved.');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Upload Animal Image</h3>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground">Click to upload an image or drag and drop</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG files</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                ref={imageRef}
                src={imagePreview}
                alt="Animal to analyze"
                className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-soft"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-foreground">Analyzing animal...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Button 
            onClick={triggerFileInput} 
            variant="default"
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card className="p-6 border-primary/20 shadow-glow">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Analysis Complete</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Animal Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Animal Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Species:</span>
                    <span className="font-medium text-foreground">{result.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breed:</span>
                    <span className="font-medium text-foreground">{result.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium text-primary">{result.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Body Measurements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Body Length:</span>
                    <span className="font-medium text-foreground">{result.measurements.bodyLength} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height at Withers:</span>
                    <span className="font-medium text-foreground">{result.measurements.heightAtWithers} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chest Width:</span>
                    <span className="font-medium text-foreground">{result.measurements.chestWidth} cm</span>
                  </div>
                </div>
              </div>
            </div>

            {result.confidence < 70 && (
              <div className="flex items-start space-x-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Lower confidence detected</p>
                  <p className="text-muted-foreground">Consider taking a clearer image with better lighting for more accurate results.</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}