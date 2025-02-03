'use client'

import Image from 'next/image'
import checked from '../../../public/checked.png'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from 'react-i18next';
import "../../../i18n";

export default function ErrorPopup() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              {t('success')}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            SSID: 123456789
          </DialogDescription>
          <DialogFooter>
            <Image src={checked} alt="Success" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}