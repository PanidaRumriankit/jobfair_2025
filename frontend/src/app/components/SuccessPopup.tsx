"use client";

import Image from "next/image";
import checked from "../../../public/checked.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import "../../../i18n";

interface SuccessPopupProps {
  isOpen: boolean;
  ssid?: string;
  onClose: () => void;
}

export default function SuccessPopup({ isOpen, ssid, onClose }: SuccessPopupProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2 text-green-600">
            {t("success")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex items-center justify-center">
          SSID: {ssid ?? "N/A"}
        </DialogDescription>
        <DialogFooter>
          <Image src={checked} alt="Success" className="w-16 h-16 mx-auto" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
