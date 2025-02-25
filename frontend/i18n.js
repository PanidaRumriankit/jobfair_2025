import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          loading: 'Loading...',
          login: 'Log in to scan QR code',
          username: 'Username',
          exusername: 'Ex. wtxqn, jtwed, etc.',
          password: 'Password',
          expassword: 'Ex. 123456, 45678, etc.',
          button: 'Log in',
          logoutbutton: 'Log out',
          timeout: 'Session Timeout',
          success: 'Success',
          error: 'Please try again',
          return: 'Return to Log in page',
        },
      },
      th: {
        translation: {
          login: 'เข้าใช้งานระบบสแกน QR Code',
          loading: 'กำลังโหลด...',
          username: 'ชื่อบัญชีผู้ใช้งาน',
          exusername: 'เช่น wtxqn, jtwed, เป็นต้น',
          password: 'รหัสผ่าน',
          expassword: 'เช่น 123456, 45678, เป็นต้น',
          button: 'เข้าสู่ระบบ',
          logoutbutton: 'ออกจากระบบ',
          timeout: 'หมดเวลาการใช้งาน',
          success: 'สแกนสำเร็จ',
          error: 'กรุณาลองใหม่อีกครั้ง',
          return: 'กลับสู่หน้าเข้าสู่ระบบ',
        },
      },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
