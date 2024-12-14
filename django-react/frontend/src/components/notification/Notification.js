// frontend/src/components/Notification.js

    import {toast} from 'react-toastify';
    import {NOTIFY} from '../Enums.ts';
    import 'react-toastify/dist/ReactToastify.css';
    import './Notification.css'

    // function which shows specific notification, depending on given NOTIFY enum
     function ShowNotification(notifyEnum, theme) {
        switch(notifyEnum){
          case NOTIFY.CHANGE_THEME:
            toast("Zmieniono motyw", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.CHANGE_COLOR:
            toast("Zmieniono kolor motywu", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
            case NOTIFY.CHANGE_BUTTONS:
              toast("Zmieniono widoczność przycisków", {
                  className: 'custom-toast info ' + theme,
                  bodyClassName: 'body',
                  progressClassName: 'progress',
              });
              break;

          case NOTIFY.SUCCESS_LOGIN:
            toast("Zalogowano!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.SUCCESS_REGISTER:
            toast("Założono nowe konto. Za chwilę nastąpi przekierowanie. Zaloguj się aby korzystać z witryny!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
          case NOTIFY.SUCCESS_LOGOUT:
            toast("Wylogowano!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;

          case NOTIFY.ERROR:
              toast("Oops, coś poszło nie tak! Odśwież stronę i spróbuj ponownie. Jeśli to nie pomoże, skontaktuj się z administratorem", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_LOGIN:
              toast("Niepoprawne dane logowania!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_REGISTER:
              toast("Nazwa użytkownika zajęta!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ERROR_TIMEOUT:
              toast("Sesja wygasła. Zaloguj się ponownie!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.RESET:
              toast("Zresetowano położenie wszystkich osób!", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

            case NOTIFY.SNEAKY_PASSWORD:
              toast("Don't you try to fool us by deleting 'disabled' attribute from Submit button! You wanted to outsmart us, we outsmarted you!", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.SAVE_PERSON:
              toast("Zapisano osobę!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_RELATIONSHIP:
              toast("Zapisano relację!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_COORDS:
              toast("Zapisano współrzędne osób!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVE_MILESTONE:
              toast("Zapisano kamień milowy!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.SAVING:
              toast("Zapisywanie współrzędnych... Nie wychodź z witryny póki trwa zapisywanie!", {
                className: 'custom-toast info ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.ADD_PERSON:
              toast("Dodano nową osobę!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ADD_RELATIONSHIP:
              toast("Dodano nową relację!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.ADD_MILESTONE:
              toast("Dodano nowy kamień milowy!", {
                className: 'custom-toast success ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;

          case NOTIFY.DELETE:
              toast("USUNIĘTO CAŁĄ BAZĘ!!!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_PERSON:
              toast("Usunięto osobę!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_RELATIONSHIP:
              toast("Usunięto relację!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          case NOTIFY.DELETE_MILESTONE:
              toast("Usunięto kamień milowy!", {
                className: 'custom-toast warn ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
              break;
          default:
            toast("Błąd, skontaktuj się z administratorem", {
                className: 'custom-toast error ' + theme,
                bodyClassName: 'body',
                progressClassName: 'progress',
            });
            break;
        }
      }

      export default ShowNotification;