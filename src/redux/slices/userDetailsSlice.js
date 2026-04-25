import { createSlice } from "@reduxjs/toolkit";



export const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: {
        userDetails: {},
    },
    reducers: {
        userDetailsSuccess: (state, action) => {
            state.userDetails = action.payload;
        },
        userLogout : (state, action) => {
            state.userDetails = null;
        }
    }
})


export const { userDetailsSuccess,userLogout } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
