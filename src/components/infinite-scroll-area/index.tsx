import { Button } from "antd";
import { ReactNode, useEffect, useRef } from "react";

export function InfiniteScrollArea({
  children,
  loadMore,
  loading = false,
  hasNextPage,
}: {
  children: ReactNode | ReactNode[];
  loadMore: () => void;
  loading: boolean;
  hasNextPage: boolean;
}) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loadMore]);

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return <div className="p-3">No results found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">{children}</div>

      <Button type="text" ref={observerTarget} loading={loading} onClick={loadMore} disabled={!hasNextPage}>
        Load more...
      </Button>
    </>
  );
}
