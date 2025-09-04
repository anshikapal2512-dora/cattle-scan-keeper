import { useState, useEffect } from 'react';
import { Users, Search, Calendar, TrendingUp, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, type AnimalRecord } from '@/lib/database';
import { format } from 'date-fns';

export function AnimalRecords() {
  const [records, setRecords] = useState<AnimalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const allRecords = await db.animals.orderBy('detectedAt').reverse().toArray();
      setRecords(allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: records.length,
    avgConfidence: records.length > 0 
      ? Math.round(records.reduce((sum, r) => sum + r.confidence, 0) / records.length)
      : 0,
    breeds: new Set(records.map(r => r.breed)).size
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-earth rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgConfidence}%</p>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.breeds}</p>
              <p className="text-sm text-muted-foreground">Breeds Detected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by breed or species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No records found</h3>
          <p className="text-muted-foreground">
            {records.length === 0 
              ? 'Start by analyzing your first animal image'
              : 'No records match your search criteria'
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="p-4 hover:shadow-soft transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={record.imageUrl}
                    alt={`${record.breed} ${record.species}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{record.breed}</h3>
                      <p className="text-sm text-muted-foreground">{record.species}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={record.confidence >= 80 ? "default" : "secondary"}>
                        {record.confidence}% confidence
                      </Badge>
                      {!record.synced && (
                        <Badge variant="outline">Offline</Badge>
                      )}
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Length</p>
                      <p className="font-medium text-foreground">{record.measurements.bodyLength} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Height</p>
                      <p className="font-medium text-foreground">{record.measurements.heightAtWithers} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Chest Width</p>
                      <p className="font-medium text-foreground">{record.measurements.chestWidth} cm</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(record.detectedAt, 'MMM dd, yyyy • HH:mm')}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}