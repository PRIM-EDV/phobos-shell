import { Tab } from "./tab.interface";

export interface View {
  name: string;
  baseRoute: string;
  tabs: Tab[];
}

