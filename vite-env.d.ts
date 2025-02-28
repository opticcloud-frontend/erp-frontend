/// <reference types="vite/client" />

interface ImportMetaEnv {
   VITE_API_URL: string;
   NODE_ENV: 'development' | 'production' | 'test';
 }
 
 interface ImportMeta {
   readonly env: ImportMetaEnv;
 }
 