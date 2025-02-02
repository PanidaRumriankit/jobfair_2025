'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import "../../../i18n";

export function ErrorPopup() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              {t('timeout')}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/')}>{t('return')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}