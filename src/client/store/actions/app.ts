import { store } from 'client/store';
import { appSlice } from 'client/store/reducers/app';

export const appShowDashboardOptions = ({
  isShowOptions,
}: {
  isShowOptions: boolean;
}) => {
  store.dispatch(appSlice.actions.showDashboardOptions(isShowOptions));
};

export const appPublishEvent = ({ canPublish }: { canPublish: boolean }) => {
  store.dispatch(appSlice.actions.publishEvent(canPublish));
};
