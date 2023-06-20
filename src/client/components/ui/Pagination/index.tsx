import React, { useEffect, useState } from 'react';
import { Button, Select } from '..';

interface Props {
  current?: number;
  defaultPageSize?: number;
  showPageSize?: boolean;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

// eslint-disable-next-line no-unused-vars
enum CONST {
  // eslint-disable-next-line no-unused-vars
  MINIMUM_NUMBER = 2,
  // eslint-disable-next-line no-unused-vars
  MAXIMUM_NUMBER = 5,
}

export const Pagination = ({
  current = 1,
  defaultPageSize = 10,
  showPageSize = true,
  total = 1,
  onChange,
}: Props) => {
  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [currentPage, setCurrentPage] = useState(current);
  const [pages, setPages] = useState(
    Math.ceil(Math.abs(total) / defaultPageSize)
  );
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [items, setItems] = useState<number[]>();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    onChange?.(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, currentPage, pageSize]);

  useEffect(() => {
    if (isLoading) return;

    const itemsArr: number[] = [];
    const minusOne = currentPage - 1;
    const plusOne = currentPage + 1;

    for (let i = 0; i < CONST.MAXIMUM_NUMBER; i++) {
      if (i === 1 && minusOne > 1) itemsArr.push(minusOne);
      if (i === 2 && currentPage > 1 && currentPage < pages)
        itemsArr.push(currentPage);
      if (i === 3 && plusOne < pages) itemsArr.push(plusOne);
    }

    setItems(itemsArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, currentPage, pageSize]);

  return (
    <ul className="ui-pagination">
      <li className="ui-pagination_item" title="Previous page">
        <Button
          block
          style={{ fontWeight: 'normal', height: '100%' }}
          disabled={currentPage === 1}
          onClick={
            currentPage === 1
              ? undefined
              : () => {
                  setCurrentPage((state) => state - 1);
                }
          }
        >
          <div className="ui-pagination_arrow_icon-container">
            <ChevronLeftArrow />
          </div>
        </Button>
      </li>
      <li className="ui-pagination_item" title="1">
        <Button
          block
          style={{ fontWeight: 'normal', height: '100%' }}
          active={currentPage === 1}
          onClick={() => {
            setCurrentPage(1);
          }}
        >
          1
        </Button>
      </li>
      {currentPage > CONST.MAXIMUM_NUMBER && (
        <li className="ui-pagination_item" title="Previous 5 pages">
          <Button
            block
            style={{ fontWeight: 'normal', height: '100%' }}
            onClick={() =>
              setCurrentPage((state) => state - CONST.MAXIMUM_NUMBER)
            }
          >
            <div className="ui-pagination_arrow_icon-container">
              <ChevronDoubleLeftArrow />
            </div>
          </Button>
        </li>
      )}

      {items?.map((n) => (
        <li key={n} className="ui-pagination_item" title={`${n}`}>
          <Button
            block
            style={{ fontWeight: 'normal', height: '100%' }}
            active={currentPage === n}
            onClick={() => {
              setCurrentPage(n);
            }}
          >
            {n}
          </Button>
        </li>
      ))}

      {pages > CONST.MAXIMUM_NUMBER &&
        currentPage <= pages - CONST.MAXIMUM_NUMBER && (
          <li className="ui-pagination_item" title="Next 5 pages">
            <Button
              block
              style={{ fontWeight: 'normal', height: '100%' }}
              onClick={() =>
                setCurrentPage((state) => state + CONST.MAXIMUM_NUMBER)
              }
            >
              <div className="ui-pagination_arrow_icon-container">
                <ChevronDoubleRightArrow />
              </div>
            </Button>
          </li>
        )}
      {pages >= CONST.MINIMUM_NUMBER && (
        <li className="ui-pagination_item" title={`${pages}`}>
          <Button
            block
            style={{ fontWeight: 'normal', height: '100%' }}
            active={currentPage === pages}
            onClick={() => {
              setCurrentPage(pages);
            }}
          >
            {pages}
          </Button>
        </li>
      )}
      <li className="ui-pagination_item" title="Next page">
        <Button
          block
          style={{ fontWeight: 'normal', height: '100%' }}
          disabled={currentPage >= pages}
          onClick={
            currentPage >= pages
              ? undefined
              : () => {
                  setCurrentPage((state) => state + 1);
                }
          }
        >
          <div className="ui-pagination_arrow_icon-container">
            <ChevronRightArrow />
          </div>
        </Button>
      </li>

      {showPageSize && (
        <li className="ui-pagination_item">
          <Select
            value={defaultPageSize}
            options={[
              { key: 1, label: '10 / page', value: 10 },
              { key: 2, label: '20 / page', value: 20 },
              { key: 3, label: '50 / page', value: 50 },
              { key: 4, label: '100 / page', value: 100 },
            ]}
            onChange={(e) => {
              const { value } = e.target;
              const totalPages = Math.ceil(Math.abs(total) / +value);
              setPageSize(+value);
              setPages(totalPages);
              setCurrentPage((state) =>
                state > totalPages ? totalPages : state
              );
            }}
          />
        </li>
      )}
    </ul>
  );
};

interface IconProps {
  fill?: string;
}

const ChevronLeftArrow = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDoubleLeftArrow = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm6 0a.75.75 0 010 1.06L12.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightArrow = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDoubleRightArrow = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
