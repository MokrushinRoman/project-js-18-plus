import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {};

export const onSuccessAlert = message => Notify.success(message, options);

onErrorAlert = message => Notify.error(message, options);

// const MAIN_API_KEY =  create new API

const API_REY = ''; /*put your personal API-key instead of empty string*/
