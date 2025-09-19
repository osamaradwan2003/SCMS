import React from 'react';
import { Table, Grid, Card } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';

const { useBreakpoint } = Grid;

interface ResponsiveTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnsType<T>;
  mobileColumns?: ColumnsType<T>;
  cardView?: boolean;
  cardRender?: (record: T) => React.ReactNode;
}

function ResponsiveTable<T = any>({
  columns,
  mobileColumns,
  cardView = false,
  cardRender,
  ...tableProps
}: ResponsiveTableProps<T>) {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;

  // Use mobile columns if provided, otherwise filter important columns
  const getResponsiveColumns = (): ColumnsType<T> => {
    if (mobileColumns && isMobile) {
      return mobileColumns;
    }

    if (isMobile) {
      // On mobile, show only the first 3 columns and actions column
      return columns.filter((col, index) => {
        if (col.key === 'actions') return true;
        if ('dataIndex' in col && col.dataIndex === 'actions') return true;
        return index < 3;
      });
    }

    return columns;
  };

  // Card view for mobile
  if (cardView && isMobile && cardRender) {
    return (
      <div className="responsive-card-list">
        {(tableProps.dataSource || []).map((record, index) => (
          <Card key={('id' in record ? record.id as string : null) || index} size="small" style={{ marginBottom: 8 }}>
            {cardRender(record)}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Table
      {...tableProps}
      columns={getResponsiveColumns()}
      scroll={{ 
        x: isMobile ? 'max-content' : undefined,
        ...tableProps.scroll 
      }}
      size={isMobile ? 'small' : tableProps.size}
      pagination={
        tableProps.pagination
          ? {
              ...tableProps.pagination,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              simple: isMobile,
              size: isMobile ? 'small' : 'default',
            }
          : false
      }
    />
  );
}

export default ResponsiveTable;
