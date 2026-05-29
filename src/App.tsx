import { useEffect } from 'react';
import { useFrameLoader } from './hooks/useFrameLoader';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollCanvas } from './components/ScrollCanvas';
import { Demo } from './components/Demo';
import { SectionNav } from './components/SectionNav';

export default function App() {
  const { images, ready, loaded, total, progress } = useFrameLoader();

  useEffect(() => {
    if (ready) window.scrollTo(0, 0);
  }, [ready]);

  return (
    <>
      <LoadingScreen
        progress={progress}
        loaded={loaded}
        total={total}
        hidden={ready}
      />
      <ScrollCanvas images={images} ready={ready} />
      {ready && (
        <>
          <Demo />
          <SectionNav />
        </>
      )}
    </>
  );
}
