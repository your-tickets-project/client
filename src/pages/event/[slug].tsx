/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// components
import PublicLayout from 'client/components/Layouts/PublicLayout';
import ShowEvent from 'client/components/app/ShowEvent';
import Loader from 'client/components/app/Loader';
// interfaces
import { EventType } from 'interfaces';
// services
import { getEventBySlug } from 'client/services/event.service';

export default function EventPage() {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [event, setEvent] = useState<
    EventType & { ticket_smallest_price: number }
  >();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { slug } = router.query;

      try {
        const res = await getEventBySlug({ slug: slug as string });
        const ticket_smallest_price = res.data.event_ticket_info.sort(
          (a, b) => a.price - b.price
        )[0].price;
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

  return (
    <PublicLayout>
      <ShowEvent event={event} />
    </PublicLayout>
  );
}
