import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PostProvider } from '@/context/PostContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PostProvider>
        <Component {...pageProps} />
      </PostProvider>
    </AuthProvider>
  );
}
