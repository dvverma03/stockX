import { createSlice } from "@reduxjs/toolkit"

const coinSlice = createSlice({
    name:"coin",
    initialState:null,
    reducers:{
        addCoin:(state, action)=>{
            return action.payload;
        }
    },
});
export const  {addCoin} = coinSlice.actions;
export default coinSlice.reducer;