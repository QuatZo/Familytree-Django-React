// frontend/src/components/Notification.js

    import {toast} from 'react-toastify';
    import NOTIFY from '../Enums.ts';
    import 'react-toastify/dist/ReactToastify.css';

     function ShowNotification(notifyEnum) {
        switch(notifyEnum){
          case NOTIFY.SUCCESS_LOGIN:
            toast.success("You logged in. Have a nice use!");
            break;
          case NOTIFY.SUCCESS_REGISTER:
            toast.success("You registered a new account and will be redirected to login page. Log in to use this website!");
            break;
          case NOTIFY.SUCCESS_LOGOUT:
            toast.success("You logged out, have a nice day!");
            break;

          case NOTIFY.ERROR:
              toast.error("Something went wrong! Refresh page or try again later! If it doesn't help, contact administrator.");
              break;
          case NOTIFY.ERROR_LOGIN:
              toast.error("Incorrect username and/or password!");
              break;
          case NOTIFY.ERROR_TIMEOUT:
              toast.error("Your session has expired. Please, log in!");
              break;

          case NOTIFY.RESET:
              toast.info("The position of all persons has been set to the initial!");
              break;

          case NOTIFY.SAVE_PERSON:
              toast.success("New data of the person has been saved!");
              break;
          case NOTIFY.SAVE_RELATIONSHIP:
              toast.success("New data of the relationship has been saved!");
              break;
          case NOTIFY.SAVE_COORDS:
              toast.success("New coords have been saved!");
              break;
          case NOTIFY.SAVE_MILESTONE:
              toast.success("New milestone have been saved!");
              break;
          case NOTIFY.SAVING:
              toast.info("Saving coordinates... Do not leave the page until the saving process is finished!");
              break;

          case NOTIFY.ADD_PERSON:
              toast.success("New person has been added, it should be at the top-left corner of the page!");
              break;
          case NOTIFY.ADD_RELATIONSHIP:
              toast.success("New relationship has been added, it should be visible. If not, try to move something around!");
              break;
          case NOTIFY.ADD_MILESTONE:
              toast.success("New milestone has been added, it should be visible. If not, try to reopen Edit Person modal!");
              break;

          case NOTIFY.DELETE:
              toast.warn("Everything has been deleted! Now you can start from scratch.");
              break;
          case NOTIFY.DELETE_PERSON:
              toast.warn("Person has been deleted!");
              break;
          case NOTIFY.DELETE_RELATIONSHIP:
              toast.warn("Relationship has been deleted!");
              break;
          case NOTIFY.DELETE_MILESTONE:
              toast.warn("Milestone has been deleted!");
              break;
          default:
            toast.error("Why is it empty? Contact administrator, please.");
            break;
        }
      }

      export default ShowNotification;