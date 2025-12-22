import React, { useState } from 'react';
import { useQueue } from '@/hooks/useQueue';
import { QueueItemRow } from './QueueItemRow';
import { Loader2, RefreshCw, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResetDetailScreen } from './ResetDetailScreen';
import { Sheet, SheetContent } from '@/components/ui/sheet'; // shadcn Sheet for drawer

export function ApprovalQueue() {
  const [limit, setLimit] = useState(50);
  const { queue, isLoading, refetch, isRefetching } = useQueue(limit);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Client-side filtering for responsiveness (server filtering available if needed)
  const filteredQueue = queue.filter(item => 
    item.organization_name.toLowerCase().includes(search.toLowerCase()) ||
    item.user_email.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* TOOLBAR */}
      <div className="p-4 border-b bg-white flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search request ID, org, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* QUEUE LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading && !queue.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading pending approvals...</p>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
            <p>No pending requests found</p>
            {search && <p className="text-sm mt-1">Try adjusting your search terms</p>}
          </div>
        ) : (
          filteredQueue.map((item) => (
            <QueueItemRow
              key={item.id}
              item={item}
              onSelect={() => setSelectedId(item.id)}
            />
          ))
        )}
      </div>

      {/* DETAIL DRAWER */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-hidden">
          {selectedId && (
            <ResetDetailScreen 
              requestId={selectedId} 
              onClose={() => setSelectedId(null)} 
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
