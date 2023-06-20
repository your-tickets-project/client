import React from 'react';
import { Pagination } from '../index';

interface Props {
  columns: {
    key: string | number;
    dataIndex: string;
    title: React.ReactNode;
    render?: (value: any, record: any) => React.ReactNode;
  }[];
  dataSource: any[];
  pagination?: {
    current?: number;
    defaultPageSize?: number;
    showPageSize?: boolean;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
  } | null;
  style?: React.CSSProperties;
}

export const Table = ({ columns, dataSource, pagination, style }: Props) => {
  return (
    <>
      <div className="ui-table">
        <table className="ui-table_table" style={style}>
          <thead className="ui-table_head">
            <tr>
              {columns.map(({ key, title }) => (
                <th key={key} className="ui-table_cell">
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className="ui-table_body"
            style={
              dataSource.length
                ? undefined
                : { height: '200px', position: 'relative' }
            }
          >
            {dataSource.length ? (
              dataSource.map((data) => (
                <tr key={data.key}>
                  {columns.map(({ key, dataIndex, render }) => (
                    <td key={key} className="ui-table_cell">
                      {render
                        ? // @ts-ignore
                          render(data[dataIndex], data)
                        : // @ts-ignore
                          data[dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="ui-table_empty-container">
                <td className="ui-table_empty-icon">
                  <NoDataIcon />
                </td>
                <td className="ui-table_empty-text">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination !== null && (
        <Pagination
          current={pagination?.current}
          defaultPageSize={pagination?.defaultPageSize}
          showPageSize={pagination?.showPageSize}
          total={pagination?.total}
          onChange={pagination?.onChange}
        />
      )}
    </>
  );
};

const NoDataIcon = (props: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(0 1)">
      <ellipse cx={32} cy={33} fill="#000" rx={32} ry={7} />
      <g fillRule="nonzero" stroke="#000">
        <path d="M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
        <path
          fill="#fafafa"
          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
        />
      </g>
    </g>
  </svg>
);
