import React from 'react';
import Link from 'next/link';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import { Button, Input, Select, Table } from 'client/components/ui';
import { SearchIcon } from 'client/components/icons';

// TODO: test
export default function EventsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <section className="container row hg-16 vg-md-8">
          <h1 className="col-12">Events</h1>
          <div className="col-12 col-md-4">
            <Input
              placeholder="Search events"
              addonBefore={<SearchIcon />}
              style={{ height: '32px' }}
            />
          </div>
          <div className="col-12 col-md-4">
            <Select
              value="all"
              options={[
                { key: 1, label: 'Upcoming Events', value: 'upcoming' },
                { key: 2, label: 'Draft', value: 'draft' },
                { key: 3, label: 'Past Events', value: 'past' },
                { key: 4, label: 'All Events', value: 'all' },
              ]}
            />
          </div>
          <div className="col-12 col-md-4">
            <Link href="/create-event">
              <Button type="primary" block style={{ height: '32px' }}>
                Create event
              </Button>
            </Link>
          </div>
        </section>

        <section className="container">
          <Table
            columns={[
              { key: 1, dataIndex: 'event', title: 'Event' },
              { key: 2, dataIndex: 'sold', title: 'Sold' },
            ]}
            dataSource={[
              { key: 1, event: 'Event info', sold: 'Sold info' },
              { key: 2, event: 'Event info 2', sold: 'Sold info 2' },
            ]}
          />
        </section>
        <style jsx>{`
          section {
            margin-bottom: 2rem;
          }

          section:first-of-type {
            margin-top: 2rem;
          }
        `}</style>
      </DashboardLayout>
    </PrivateRoute>
  );
}
