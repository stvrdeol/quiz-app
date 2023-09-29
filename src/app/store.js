import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "../features/quizSlice";
const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});

export default store;
