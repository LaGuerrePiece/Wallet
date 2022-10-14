export type AndroidNotificationChannels = "activity";

export type NotificationMessageData = {
  channelId: AndroidNotificationChannels;
  title: string;
  description: string;
};
