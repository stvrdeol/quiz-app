import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  data: null,
  error: null,
};

export const fetchQuestions = createAsyncThunk("fetchQuestions", async () => {
  const response = await fetch(
    `https://stvrdeol.github.io/quizApi/quizQuestions.json`
  );
  const result = await response.json();
  return result;
});

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default quizSlice.reducer;
