import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listItems: null,
    isPending : false,
    isError : false,
}

export const PrescSlice = createSlice({
    name: 'prescSlice',
    initialState,
    reducers: {
        setPending: (state) => {
            state.isPending = true;
            state.isError = false;
        },
        prescSuccess: (state, action) => {
            state.listItems = action.payload;
            state.isPending = false;
            state.isError = false;
        },
        setError: (state) => {
            state.isError = true;
            state.isPending = false;
        },
    },
})

export const { setPending, prescSuccess, setError } = PrescSlice.actions

export default PrescSlice.reducer;