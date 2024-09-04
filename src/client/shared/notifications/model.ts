import { createEvent, createStore, sample } from "effector";
import { delay } from "patronum";

export type Notification = {
  type: "error" | "warning" | "success";
  message: string;
  title: string;
};

export const $notifications = createStore<Array<Notification>>([]);

export const notify = createEvent<Notification>();

const notificationExpired = createEvent();

sample({
  clock: notify,
  source: $notifications,
  fn(notifications, newNotification) {
    return [...notifications, newNotification];
  },
  target: $notifications,
});

sample({
  clock: delay(notify, 2000),
  target: notificationExpired,
});

sample({
  clock: notificationExpired,
  source: $notifications,
  fn(notifications) {
    return notifications.slice(1);
  },
  target: $notifications,
});
