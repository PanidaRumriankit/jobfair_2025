'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import "../../../i18n";

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionTimeout({ isOpen, onClose }: ErrorPopupProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-center items-center [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2 text-destructive">
            {t('timeout')}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => { router.push('/'); onClose(); }}>
            {t('return')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
