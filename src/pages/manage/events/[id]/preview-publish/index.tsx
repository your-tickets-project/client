import React from 'react';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import EventFormLayout from 'client/components/app/event/EventFormLayout';

export default function PreviewPublishPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <EventFormLayout>
          <div className="container">
            <div className="row hg-48">
              <h1>Publish Your Event</h1>
            </div>
          </div>
        </EventFormLayout>
      </DashboardLayout>
    </PrivateRoute>
  );
}
