import { configureStore } from "@reduxjs/toolkit";
import  coinReducer  from "./coinSlice";
import gptReducer from "./gptSlice"

const appStore = configureStore({
    reducer:{
        coin:coinReducer,
        gpt:gptReducer
    }
});

export default appStore;