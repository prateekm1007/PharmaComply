import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AlertAcknowledgeModalProps {
  alertId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { resolutionType: string; notes: string }) => Promise<void>;
}

export function AlertAcknowledgeModal({
  alertId,
  isOpen,
  onClose,
  onConfirm
}: AlertAcknowledgeModalProps) {
  const [resolutionType, setResolutionType] = useState('resolved_legitimate');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alertId) return;
    setIsSubmitting(true);
    try {
      await onConfirm({ resolutionType, notes });
      onClose();
      setNotes(''); // Reset form
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = notes.trim().length >= 20;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Acknowledge Security Alert</DialogTitle>
          <DialogDescription>
            Confirm resolution for Alert #{alertId?.substring(0, 8)}...
            This action is logged permanently.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label>Resolution Type</Label>
            <RadioGroup value={resolutionType} onValueChange={setResolutionType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false_positive" id="r1" />
                <Label htmlFor="r1">False Positive (System Error)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resolved_legitimate" id="r2" />
                <Label htmlFor="r2">Resolved - Legitimate Activity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resolved_action_taken" id="r3" />
                <Label htmlFor="r3">Resolved - Action Taken</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="escalated_external" id="r4" />
                <Label htmlFor="r4">Escalated Externally</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Investigation Notes (Min 20 chars)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your findings..."
              className={!isValid && notes.length > 0 ? "border-red-300" : ""}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length} / 20 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Confirm Resolution'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
