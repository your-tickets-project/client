/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import PublicLayout from 'client/components/Layouts/PublicLayout';
import ShowEvent from 'client/components/app/ShowEvent';
import Loader from 'client/components/app/Loader';
// interfaces
import {
  EventBasicInfoType,
  EventDetailType,
  EventLocationType,
  EventTagType,
  EventTicketInfoType,
  NullablePartial,
} from 'interfaces';
// services
import { getEventPreview } from 'client/services/event.service';

export default function PreviewPage() {
  return (
    <PrivateRoute>
      <PublicLayout>
        <ShowEventWrapper />
      </PublicLayout>
    </PrivateRoute>
  );
}

const ShowEventWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [event, setEvent] = useState<
    EventBasicInfoType & {
      event_location: EventLocationType;
      event_detail: NullablePartial<EventDetailType>;
      event_ticket_info: EventTicketInfoType[];
      event_tag: EventTagType[];
    } & { ticket_smallest_price: number }
  >();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getEventPreview({ eventId: id as string });
        const ticket_smallest_price =
          res.data.event_ticket_info.sort((a, b) => a.price - b.price)[0]
            ?.price || 0;
        setEvent({
          ...res.data,
          ticket_smallest_price,
        });
      } catch (error: any) {
        router.replace('/');
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  if (!event) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
        }}
      >
        <Loader />
      </div>
    );
  }

  return <ShowEvent event={event} isPreview />;
};
