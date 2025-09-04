import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.09f859239bd6430c93949de5e4036bdc',
  appName: 'cattle-scan-keeper',
  webDir: 'dist',
  server: {
    url: 'https://09f85923-9bd6-430c-9394-9de5e4036bdc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;