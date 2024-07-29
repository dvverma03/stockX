"use client";

import appStore from "@/components/store/appStore";
import { Provider } from "react-redux";

export function ReduxProvider({ children }) {
  return <Provider store={appStore}>{children}</Provider>;
}