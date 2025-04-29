
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.habits.app',
  appName: 'badge-habit-tracker-flow',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://93ba9121-0b6f-4367-8fe5-40400261bbe5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
};

export default config;
