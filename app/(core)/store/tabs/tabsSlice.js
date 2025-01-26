import { createSlice } from "@reduxjs/toolkit";

const createInitialLegData = () => ({
  legs: [
    {
      id: 1,
      monthlyContribution: 500,
      years: 5,
      interestRate: 7,
      color: "#34D399",
    },
  ],
  initialInvestment: 1000,
  lastModified: new Date().toISOString(),
});

const initialState = {
  tabs: [
    {
      id: "tab1",
      title: "Tab 1",
      active: true,
      data: createInitialLegData(),
    },
  ],
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state) => {
      const newTabId = `tab${state.tabs.length + 1}`;
      state.tabs.forEach((tab) => (tab.active = false));
      state.tabs.push({
        id: newTabId,
        title: `Tab ${state.tabs.length + 1}`,
        active: true,
        data: createInitialLegData(),
      });
    },
    setActiveTab: (state, action) => {
      state.tabs.forEach((tab) => {
        tab.active = tab.id === action.payload;
      });
    },
    removeTab: (state, action) => {
      const tabIndex = state.tabs.findIndex((tab) => tab.id === action.payload);
      if (state.tabs.length > 1) {
        state.tabs.splice(tabIndex, 1);
        if (state.tabs[tabIndex]?.id) {
          state.tabs[tabIndex].active = true;
        } else if (state.tabs[tabIndex - 1]?.id) {
          state.tabs[tabIndex - 1].active = true;
        }
      }
    },
    updateTabData: (state, action) => {
      const { tabId, data } = action.payload;
      const tab = state.tabs.find((tab) => tab.id === tabId);
      if (tab) {
        tab.data = {
          ...tab.data,
          ...data,
          lastModified: new Date().toISOString(),
        };
      }
    },
    updateLeg: (state, action) => {
      const { tabId, legId, field, value } = action.payload;
      const tab = state.tabs.find((tab) => tab.id === tabId);
      if (tab) {
        tab.data.legs = tab.data.legs.map((leg) =>
          leg.id === legId ? { ...leg, [field]: value } : leg
        );
        tab.data.lastModified = new Date().toISOString();
      }
    },
    addLeg: (state, action) => {
      const { tabId } = action.payload;
      const tab = state.tabs.find((tab) => tab.id === tabId);
      if (tab) {
        const newId = Math.max(...tab.data.legs.map((leg) => leg.id)) + 1;
        const listOfColors = [
          "#34D399",
          "#60A5FA",
          "#F472B6",
          "#F97316",
          "#FBBF24",
          "#b18ce7",
          "#00B4D8",
          "#F472B6",
        ];

        tab.data.legs.push({
          id: newId,
          monthlyContribution: 500,
          years: 5,
          interestRate: 7,
          color: listOfColors[tab.data.legs.length % listOfColors.length],
        });
        tab.data.lastModified = new Date().toISOString();
      }
    },
  },
});

export const {
  addTab,
  setActiveTab,
  removeTab,
  updateTabData,
  updateLeg,
  addLeg,
} = tabsSlice.actions;

// Selectors
export const selectActiveTab = (state) =>
  state.tabs.tabs.find((tab) => tab.active);

export const selectActiveTabData = (state) => selectActiveTab(state)?.data;

export default tabsSlice.reducer;
