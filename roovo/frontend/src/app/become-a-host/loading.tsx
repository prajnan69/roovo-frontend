"use client";

import { Spinner } from '@/components/ui/shadcn-io/spinner';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Spinner size={48} />
    </div>
  );
};

export default Loading;
