import { HashRouter, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ScrollToTop } from './components/common/ScrollToTop';
import Routes from './routes/Routes';
import PageMeta from './components/common/PageMeta';
// import { useDeployVersionCheck } from './hooks/useDeployVersionCheck';
import { useServiceWorkerUpdater } from './sw-update-listener';
import { UpdateBanner } from './components/common/DesktopUpdateBanner';

const isDesktop =
  typeof window !== 'undefined' && !!(window as any).electronAPI;
const Router: any = isDesktop ? HashRouter : BrowserRouter;

export default function App() {
  useServiceWorkerUpdater();

  return (
    <>
      <PageMeta title='Quản lý nhân sự' description='Quản lý nhân sự' />
      <Router>
        <ScrollToTop />
        <Routes />
      </Router>
      <ToastContainer
        className='global-toast !z-[999999]'
        position='top-right'
        limit={1}
        hideProgressBar
        newestOnTop
        pauseOnHover
        autoClose={false}
        closeOnClick={false}
      />
      <UpdateBanner />
    </>
  );
}
