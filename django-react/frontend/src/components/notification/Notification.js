// frontend/src/components/Notification.js

    import {toast} from 'react-toastify';
    import {NOTIFY} from '../Enums.ts';
    import 'react-toastify/dist/ReactToastify.css';
    import './Notification.css'

    // function which shows specific notification, depending on given NOTIFY enum
     function ShowNotification(notifyEnum, theme) {
        switch(notifyEnum){
          case NOTIFY.CHANGE_THEME:
            toast("Theme has been changed and saved.", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.CHANGE_COLOR:
            toast("Color has been changed and saved.", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;

          case NOTIFY.SUCCESS_LOGIN:
            toast("You logged in. Have a nice use!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.SUCCESS_REGISTER:
            toast("You registered a new account and will be redirected to login page. Log in to use this website!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.SUCCESS_LOGOUT:
            toast("You logged out, have a nice day!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;

          case NOTIFY.ERROR:
              toast("Something went wrong! Refresh page or try again later! If it doesn't help, contact administrator.", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_LOGIN:
              toast("Incorrect username and/or password!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_REGISTER:
              toast("This username is already taken!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_TIMEOUT:
              toast("Your session has expired. Please, log in!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.RESET:
              toast("The position of all persons has been set to the initial values!", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.SAVE_PERSON:
              toast("New data of the person has been saved!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_RELATIONSHIP:
              toast("New data of the relationship has been saved!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_COORDS:
              toast("New coords have been saved!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_MILESTONE:
              toast("New milestone have been saved!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVING:
              toast("Saving coordinates... Do not leave the page until the saving process is finished!", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.ADD_PERSON:
              toast("New person has been added, it should be at the top-left corner of the page!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ADD_RELATIONSHIP:
              toast("New relationship has been added, it should be visible. If not, try to move something around!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ADD_MILESTONE:
              toast("New milestone has been added, it should be visible. If not, try to reopen Edit Person modal!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.DELETE:
              toast("Everything has been deleted! Now you can start from scratch.", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_PERSON:
              toast("Person has been deleted!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_RELATIONSHIP:
              toast("Relationship has been deleted!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_MILESTONE:
              toast("Milestone has been deleted!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          default:
            toast("Why is it empty? Contact administrator, please.", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
        }
      }

      export default ShowNotification;