import { useAutoUpdater } from '@/hooks/useAutoUpdater';

export function UpdateBanner() {
  const { status, check, download, install } = useAutoUpdater();

  if (status.state === 'available') {
    return (
      <div className='fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow'>
        <div>New version available</div>
        <button
          onClick={download}
          className='mt-2 bg-white text-blue-600 px-3 py-1 rounded'
        >
          Download
        </button>
      </div>
    );
  }

  if (status.state === 'downloading') {
    return (
      <div className='fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow'>
        Downloading… {status.progress.percent?.toFixed(0)}%
      </div>
    );
  }

  if (status.state === 'downloaded') {
    return (
      <div className='fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-xl shadow'>
        Update ready. Restart now?
        <button
          onClick={install}
          className='ml-3 bg-white text-green-700 px-3 py-1 rounded'
        >
          Restart
        </button>
      </div>
    );
  }

  if (status.state === 'error') {
    return (
      <div className='fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-xl shadow'>
        Update error: {status.message}
        <button
          onClick={check}
          className='ml-3 bg-white text-red-700 px-3 py-1 rounded'
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
