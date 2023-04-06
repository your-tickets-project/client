import { render, screen } from '@testing-library/react';
import { Table } from '.';

describe('when <Table/> is mounted', () => {
  it('should render with columns and data source', () => {
    const columns = [
      { key: 1, dataIndex: 'name', title: 'Name' },
      { key: 2, dataIndex: 'age', title: 'Age' },
      { key: 3, dataIndex: 'gender', title: 'Gender' },
    ];
    const dataSource = [
      { key: 1, name: 'John', age: 30, gender: 'Male' },
      { key: 2, name: 'Jane', age: 25, gender: 'Female' },
      { key: 3, name: 'Bob', age: 40, gender: 'Male' },
    ];
    render(<Table columns={columns} dataSource={dataSource} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getAllByRole('cell')).toHaveLength(9);
  });

  it('should render with custom cell rendering function', () => {
    const columns = [
      { key: 1, dataIndex: 'name', title: 'Name' },
      {
        key: 2,
        dataIndex: 'age',
        title: 'Age',
        render: (value: number) => <span>{value} years old</span>,
      },
      { key: 3, dataIndex: 'gender', title: 'Gender' },
    ];
    const dataSource = [
      { key: 1, name: 'John', age: 30, gender: 'Male' },
      { key: 2, name: 'Jane', age: 25, gender: 'Female' },
      { key: 3, name: 'Bob', age: 40, gender: 'Male' },
    ];
    render(<Table columns={columns} dataSource={dataSource} />);
    const $age1 = screen.getAllByRole('cell')[1];
    const $age2 = screen.getAllByRole('cell')[4];
    const $age3 = screen.getAllByRole('cell')[7];
    expect($age1).toHaveTextContent('30 years old');
    expect($age2).toHaveTextContent('25 years old');
    expect($age3).toHaveTextContent('40 years old');
  });

  it('should render with empty columns or data source array', () => {
    render(<Table columns={[]} dataSource={[]} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryAllByRole('columnheader')).toHaveLength(0);
    expect(screen.queryAllByRole('cell')).toHaveLength(0);
  });

  it('should render with optional css style object', () => {
    const columns = [
      { key: 1, title: 'Name', dataIndex: 'name' },
      { key: 2, title: 'Age', dataIndex: 'age' },
      { key: 3, title: 'Gender', dataIndex: 'gender' },
    ];
    const dataSource = [
      { key: 1, name: 'John', age: 25, gender: 'Male' },
      { key: 2, name: 'Jane', age: 30, gender: 'Female' },
    ];
    const style = { backgroundColor: 'red' };
    render(<Table columns={columns} dataSource={dataSource} style={style} />);
    expect(screen.getByRole('table').getAttribute('style')).toBe(
      'background-color: red;'
    );
  });
});
