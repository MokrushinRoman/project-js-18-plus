import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {};

export const onSuccessAlert = message => Notify.success(message, options);

onErrorAlert = message => Notify.error(message, options);
