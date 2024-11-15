import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
// components
import MapLocation from 'client/components/app/MapLocation';
import {
  Button,
  DatePicker,
  Form,
  FormType,
  Input,
  InputTag,
  TimePicker,
} from 'client/components/ui';
// helpers
import { debounce } from 'client/helpers';
// hooks
import useVW from 'client/hooks/useVW';
// interfaces
import {
  EventBasicInfoType,
  EventLocationType,
  EventTagType,
} from 'interfaces';
// services
import {
  postEventBasicInfo,
  putEventBasicInfo,
} from 'client/services/event.service';
// styles
import { breakPointsPX } from 'client/styles/variables';

interface FormValues {
  title: string;
  venue_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
}

interface AddressFormValues {
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  name?: string;
  postalCode: string;
  route: string;
  state: string;
}

interface Props {
  eventData?: EventBasicInfoType & {
    event_location: EventLocationType;
    event_tag: EventTagType[];
  };
  parentScrollToSelector?: string;
}

export default function BasicInfoForm({
  eventData,
  parentScrollToSelector,
}: Props) {
  const router = useRouter();
  const vw = useVW();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [addressError, setAddressError] = useState<boolean>(false);
  // data
  const [form, setForm] = useState<FormType | undefined>();
  const [tags, setTags] = useState<string[]>(
    eventData?.event_tag.map(({ name }) => name) || []
  );
  const [address, setAddress] = useState<AddressFormValues | undefined>(
    eventData && {
      city: eventData.event_location.city,
      country: eventData.event_location.country,
      lat: +eventData.event_location.latitude,
      lng: +eventData.event_location.longitude,
      name: eventData.event_location.venue_name,
      postalCode: eventData.event_location.postal_code,
      route: eventData.event_location.address_1,
      state: eventData.event_location.state || '',
    }
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!address || !form) return;

    setAddressError(false);
    const addressFormatted = {
      venue_name: address.name || '',
      address_1: address.route,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
    };

    for (const [key, value] of Object.entries(addressFormatted)) {
      form.setFieldValue(key, value);
    }
  }, [isLoading, address, form]);

  const handleAddress = useCallback(setAddress, [setAddress]);

  const handleFinish = async (values: FormValues) => {
    setIsSending(true);
    if (
      address === undefined ||
      address.lat === undefined ||
      address.lng === undefined
    ) {
      setAddressError(true);
      setIsSending(false);
      return;
    }
    setAddressError(false);

    const data = {
      title: values.title,
      tags,
      location: {
        venue_name: values.venue_name,
        address_1: values.address_1,
        address_2: values.address_2,
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
        country: values.country,
        latitude: address.lat,
        longitude: address.lng,
      },
      date_start: values.date_start,
      date_end: values.date_end,
      time_start: values.time_start,
      time_end: values.time_end,
    };

    try {
      if (eventData) {
        const res = await putEventBasicInfo({ data, eventId: eventData.id });
        toast.success(res.data.message);
        setIsSending(false);
      } else {
        const res = await postEventBasicInfo(data);
        toast.success(res.data.message);
        setTimeout(() => {
          router.push(`/manage/events/${res.data.insertId}/details`);
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');

      setTimeout(() => {
        router.replace('/dashboard/events');
      }, 3000);
    }
  };

  return (
    <Form
      initialValues={
        eventData && {
          title: eventData.title,
          venue_name: eventData.event_location.venue_name,
          address_1: eventData.event_location.address_1,
          address_2: eventData.event_location.address_2 || '',
          city: eventData.event_location.city,
          state: eventData.event_location.state || '',
          postal_code: eventData.event_location.postal_code,
          country: eventData.event_location.country,
          date_start: eventData.date_start.split('T')[0],
          time_start: eventData.time_start,
          date_end: eventData.date_end.split('T')[0],
          time_end: eventData.time_end,
        }
      }
      extraOffsetTop={80}
      parentScrollToSelector={parentScrollToSelector}
      onFinish={debounce(handleFinish, 800)}
      onForm={setForm}
    >
      <div className="row hg-16">
        <div className="col-12 row hg-8">
          <div className="col-12">
            {(router.asPath.includes('/create-event') ||
              vw >= breakPointsPX.md) && <h1>Basic info</h1>}
            <p>
              Name your event and tell event-goers why they should come. Add
              details that highlight what makes it unique.
            </p>
          </div>
          <div className="col-12">
            <Form.Item
              label="Event title"
              name="title"
              rules={{
                required: true,
                max: 75,
              }}
            >
              <Input />
            </Form.Item>
          </div>
        </div>

        <div className="col-12 row hg-8">
          <div className="col-12">
            <h4>Tags</h4>
            <p>
              Improve discoverability of your event by adding tags relevant to
              the subject matter.
            </p>
          </div>
          <div className="col-12">
            <InputTag
              disabled={tags.length >= 5}
              maxLength={25}
              maxTags={5}
              placeholder="Add search keywords to your event"
              showCount
              showTagsCount
              tagsValue={tags}
              onTags={(tags) => setTags(tags)}
            />
          </div>
        </div>

        <div className="col-12 row hg-8">
          <div className="col-12">
            <h4>Location</h4>
            <p>
              Help people in the area discover your event and let attendees know
              where to show up.
            </p>
          </div>
          <div className="col-12" style={{ marginBottom: '1rem' }}>
            <MapLocation
              addressError={addressError}
              position={
                eventData && {
                  lat: +eventData.event_location.latitude,
                  lng: +eventData.event_location.longitude,
                }
              }
              onAddress={handleAddress}
            />
          </div>
          {address !== undefined && (
            <div className="col-12 row hg-8 vg-8">
              <div className="col-12">
                <Form.Item
                  label="Venue name"
                  name="venue_name"
                  rules={{
                    required: true,
                    max: 500,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-12">
                <h4>Street Address</h4>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  label="Address 1"
                  name="address_1"
                  rules={{
                    required: true,
                    max: 100,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  label="Address 2"
                  name="address_2"
                  rules={{
                    max: 120,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  label="City"
                  name="city"
                  rules={{
                    required: true,
                    max: 50,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-6 col-md-3">
                <Form.Item label="State" name="state" rules={{ max: 30 }}>
                  <Input />
                </Form.Item>
              </div>
              <div className="col-6 col-md-3">
                <Form.Item
                  label="Postal code"
                  name="postal_code"
                  rules={{
                    required: true,
                    max: 30,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  label="Country"
                  name="country"
                  rules={{
                    required: true,
                    max: 30,
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 row hg-8">
          <div className="col-12">
            <h4>Date and Time</h4>
            <p>
              Tell event-goers when your event starts and ends so they can make
              plans to attend.
            </p>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-6">
              <Form.Item
                label="Event starts"
                name="date_start"
                rules={{
                  required: true,
                }}
              >
                <DatePicker />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-6">
              <Form.Item
                label="Start time"
                name="time_start"
                rules={{
                  required: true,
                }}
              >
                <TimePicker />
              </Form.Item>
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-12 col-sm-6">
              <Form.Item
                label="Event ends"
                name="date_end"
                rules={{
                  required: true,
                  validator(value, formValues: FormValues) {
                    if (
                      formValues.date_start &&
                      formValues.time_start &&
                      formValues.time_end
                    ) {
                      const startDate = new Date(
                        `${formValues.date_start}T${formValues.time_start}`
                      );
                      const endDate = new Date(
                        `${value}T${formValues.time_end}`
                      );

                      if (startDate >= endDate) {
                        return {
                          isValid: false,
                          message:
                            'Start date can not be greater than or equal to End date',
                        };
                      }

                      const nowDate = new Date();
                      if (nowDate >= endDate) {
                        return {
                          isValid: false,
                          message: 'End date cannot be in the past',
                        };
                      }
                    }
                    return {
                      isValid: true,
                    };
                  },
                }}
              >
                <DatePicker />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-6">
              <Form.Item
                label="End time"
                name="time_end"
                rules={{
                  required: true,
                }}
              >
                <TimePicker />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="col-12">
          <Button
            block
            disabled={isSending}
            htmlType="submit"
            style={{ marginTop: '1rem' }}
            type="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}
