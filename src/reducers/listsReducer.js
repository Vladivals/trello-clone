import { CONSTANTS } from "../actions";

let listID = 2;
let cardID = 6;

const initialState = [
  {
    title: "Cast and characters",
    id: `list-${0}`,
    cards: [
      {
        id: `card-${0}`,
        text: "Winona Ryder as Joyce Byers, the mother of Will and Jonathan Byers."
      },
      {
        id: `card-${1}`,
        text: "David Harbour as Jim Hopper, chief of Hawkins Police Department."
      }
    ]
  },
  {
    title: "Visual effects",
    id: `list-${1}`,
    cards: [
      {
        id: `card-${2}`,
        text: "To create the aged effect for the series, a film grain was added over the footage, which was captured by scanning in film stock from the 1980s."
      },
      {
        id: `card-${3}`,
        text: "The title sequence uses closeups of the letters in the Stranger Things title with a red tint against a black background as they slide into place within the title."
      },
      {
        id: `card-${4}`,
        text:
          "we will also make some little changes I forgot in the last episode (link tags for roboto font and icons,..)"
      },
      {
        id: `card-${5}`,
        text:
          "They took inspiration from several title sequences of works from the 1980s"
      }
    ]
  }
];

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.ADD_LIST:
      const newList = {
        title: action.payload,
        cards: [],
        id: `list-${listID}`
      };
      listID += 1;
      return [...state, newList];

    case CONSTANTS.ADD_CARD: {
      const newCard = {
        text: action.payload.text,
        id: `card-${cardID}`
      };
      cardID += 1;

      console.log("action received", action);

      const newState = state.map(list => {
        if (list.id === action.payload.listID) {
          return {
            ...list,
            cards: [...list.cards, newCard]
          };
        } else {
          return list;
        }
      });

      return newState;
    }

    case CONSTANTS.DRAG_HAPPENED:
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexEnd,
        droppableIndexStart,
        draggableId,
        type
      } = action.payload;
      const newState = [...state];

      // draggin lists around
      if (type === "list") {
        const list = newState.splice(droppableIndexStart, 1);
        newState.splice(droppableIndexEnd, 0, ...list);
        return newState;
      }

      // in the same list
      if (droppableIdStart === droppableIdEnd) {
        const list = state.find(list => droppableIdStart === list.id);
        const card = list.cards.splice(droppableIndexStart, 1);
        list.cards.splice(droppableIndexEnd, 0, ...card);
      }

      // other list
      if (droppableIdStart !== droppableIdEnd) {
        // find the list where the drag happened
        const listStart = state.find(list => droppableIdStart === list.id);
        // pull out the card from this list
        const card = listStart.cards.splice(droppableIndexStart, 1);
        // find the list where the drag ended
        const listEnd = state.find(list => droppableIdEnd === list.id);

        // put the card in the new list
        listEnd.cards.splice(droppableIndexEnd, 0, ...card);
      }

      return newState;

    default:
      return state;
  }
};

export default listsReducer;