'use client'

import {
  Dialog,
  DialogContent,
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
            <DialogTitle className="bg-white dark:bg-black rounded-lg p-8 flex flex-col items-center space-y-4 border border-gray-300 dark:border-gray-700">
              <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-black dark:text-white">{t('loading')}</p>
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}