import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageAnalyzer } from '@/components/ImageAnalyzer';
import { AnimalRecords } from '@/components/AnimalRecords';
import { Scan, Archive, Leaf } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">LivestockAI</h1>
              <p className="text-sm text-muted-foreground">Smart Animal Analysis & Management</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="analyze" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze" className="flex items-center space-x-2">
                <Scan className="w-4 h-4" />
                <span>Analyze Animal</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center space-x-2">
                <Archive className="w-4 h-4" />
                <span>View Records</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-foreground">AI-Powered Animal Analysis</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload a photo to instantly identify animal breeds, measure body dimensions, 
                  and store records for your livestock management.
                </p>
              </div>
              <ImageAnalyzer />
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-foreground">Animal Records</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Browse and manage your analyzed animals. All data is stored offline 
                  and ready for sync when connected.
                </p>
              </div>
              <AnimalRecords />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 LivestockAI • Precision Agriculture Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;