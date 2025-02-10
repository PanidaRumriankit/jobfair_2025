'use client';

import Image from 'next/image';
import cross from '../../../public/cross.png';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import "../../../i18n";

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function ErrorPopup({ message, onClose, isOpen }: ErrorPopupProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          
          <DialogTitle className="flex flex-col items-center justify-center gap-2 text-destructive">
          <Image src={cross} alt="Error" width={50} height={50} />
            {t('error')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-destructive">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
