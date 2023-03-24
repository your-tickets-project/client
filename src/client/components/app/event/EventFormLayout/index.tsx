import React from 'react';
// components
import EventStepsMenu from 'client/components/app/event/EventStepsMenu';
// styles
import { breakPoints } from 'client/styles/variables';

interface Props {
  activeStep: 'basic-info' | 'details' | 'tickets' | 'preview-publish';
  children: React.ReactNode;
  eventId: number | string;
}

export default function EventFormLayout({
  activeStep,
  children,
  eventId,
}: Props) {
  return (
    <>
      <div className="event-container row">
        <div className="menu-container col-12 col-md-3">
          <EventStepsMenu activeStep={activeStep} eventId={eventId} />
        </div>
        <section className="col-12 col-md-9" id="event-form-layout">
          <div className="container">{children}</div>
        </section>
      </div>
      <style jsx>{`
        section {
          height: 100%;
          overflow: auto;
          padding-top: 2rem;
        }

        @media (min-width: ${breakPoints.md}) {
          .event-container {
            height: 100%;
          }

          section {
            flex: 1;
          }

          .menu-container {
            max-width: 255px;
          }
        }
      `}</style>
    </>
  );
}
