import { Button } from "antd";
import { ReactNode, useEffect, useRef } from "react";

/**
 * An infinite scroll area that calls `loadMore()` when the user scrolls to the bottom.
 * Helps build easy infinite scroll areas for paginated data.
 */
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

  // implement infinite loading.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loadMore]);

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return <div className="p-3">No results found.</div>;
  }
  return (
    <>
      <div className="grid">{children}</div>

      <Button ref={observerTarget} loading={loading} onClick={loadMore} disabled={!hasNextPage}>
        Load more...
      </Button>
    </>
  );
}
