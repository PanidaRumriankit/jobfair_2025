'use client'

import Image from 'next/image'
import cross from '../../../public/cross.png'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from 'react-i18next';
import "../../../i18n";

export function ErrorPopup() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              {t('error')}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Image src={cross} alt="Error" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}