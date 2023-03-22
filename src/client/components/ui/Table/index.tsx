import React from 'react';

interface Props {
  columns: {
    key: string | number;
    dataIndex: string;
    title: React.ReactNode;
  }[];
  dataSource: any[];
}

// TODO: test
export const Table = ({ columns, dataSource }: Props) => {
  return (
    <table className="ui-table">
      <thead>
        <tr>
          {columns.map(({ key, title }) => (
            <th key={key} className="ui-table_cell">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((data) => (
          <tr key={data.key}>
            {columns.map(({ key, dataIndex }) => (
              <td key={key} className="ui-table_cell">
                {data[dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
