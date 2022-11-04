import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {};

export const onSuccessAlert = message => Notify.success(message, options);

export const onErrorAlert = message => Notify.error(message, options);
