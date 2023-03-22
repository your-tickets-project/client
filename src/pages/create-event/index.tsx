import React from 'react';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import BasicInfoForm from 'client/components/app/event/BasicInfoForm';
// styles
import { breakPoints } from 'client/styles/variables';

export default function CreateEventPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <>
          <div className="container" style={{ marginTop: '1rem' }}>
            <BasicInfoForm parentScrollToSelector="#dashboard-layout" />
          </div>
          <style jsx>{`
            @media (min-width: ${breakPoints.md}) {
              .container {
                width: 70%;
              }
            }

            @media (min-width: ${breakPoints.lg}) {
              .container {
                width: 60%;
              }
            }
          `}</style>
        </>
      </DashboardLayout>
    </PrivateRoute>
  );
}
