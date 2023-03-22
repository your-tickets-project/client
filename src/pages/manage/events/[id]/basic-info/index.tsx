import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toaster from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import EventFormLayout from 'client/components/app/event/EventFormLayout';
import BasicInfoForm from 'client/components/app/event/BasicInfoForm';
// interfaces
import {
  EventBasicInfoType,
  EventLocationType,
  EventTagType,
} from 'interfaces';
// services
import { getEventBasicInfo } from 'client/services/event.service';

export default function BasicInfoPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <BasicInfoFormWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const BasicInfoFormWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [eventBasicInfo, setEventBasicInfo] = useState<
    | (EventBasicInfoType & {
        event_location: EventLocationType;
        event_tag: EventTagType[];
      })
    | undefined
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
        const res = await getEventBasicInfo({ eventId: id as string });
        setEventBasicInfo(res.data);
      } catch (error: any) {
        toaster.error(
          error?.response?.data?.message || 'Internal server error.'
        );

        setTimeout(() => {
          router.replace('/dashboard/events');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  if (!eventBasicInfo) return null;

  return (
    <EventFormLayout activeStep="basic-info" eventId={eventBasicInfo.id}>
      <BasicInfoForm
        eventData={eventBasicInfo}
        parentScrollToSelector="#event-form-layout"
      />
    </EventFormLayout>
  );
};
