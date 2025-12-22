import React from 'react';
import { Lock, Clock, AlertTriangle, User, ShieldCheck } from 'lucide-react';
import type { QueueItem } from '@/types/queue';
import { cn } from '@/lib/utils'; // Assumes shadcn utils

interface QueueItemRowProps {
  item: QueueItem;
  onSelect: () => void;
}

export function QueueItemRow({ item, onSelect }: QueueItemRowProps) {
  // Determine status color
  const statusColor = item.status === 'awaiting_second' 
    ? 'border-l-blue-500' 
    : 'border-l-yellow-500';

  // Check actionability based on server flags
  const isCooldownActive = item.cooldown_until && new Date(item.cooldown_until) > new Date();
  const isLocked = item.is_locked || (item.locked_viewers && item.locked_viewers.length > 0);
  const isSelf = item.is_self_approval;

  return (
    <div 
      onClick={onSelect}
      className={cn(
        "group relative flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-gray-300 border-l-4",
        statusColor
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 truncate">
            {item.organization_name}
          </span>
          <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded-full font-mono">
            {item.usage_type}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" /> {item.user_email}
          </span>
          <span>•</span>
          <span className="font-medium text-gray-700">
            {item.reset_amount} credits ({item.reset_percentage}%)
          </span>
        </div>
        
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          <span>Req: {item.requested_by_email}</span>
          <span>•</span>
          <span>{new Date(item.created_at).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
        {/* Primary Status Badge */}
        {item.requires_dual_control ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Dual Control
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
            Standard
          </span>
        )}

        {/* Warning Indicators */}
        <div className="flex items-center gap-2">
          {isSelf && (
            <span className="flex items-center text-xs text-red-600 font-medium" title="Cannot approve own request">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Self
            </span>
          )}
          
          {isCooldownActive && (
            <span className="flex items-center text-xs text-amber-600 font-medium" title="Cooldown active">
              <Clock className="w-3 h-3 mr-1" />
              Wait
            </span>
          )}
          
          {isLocked && (
            <span className="flex items-center text-xs text-blue-600 font-medium animate-pulse" title="Being viewed by another admin">
              <Lock className="w-3 h-3 mr-1" />
              Viewing
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
