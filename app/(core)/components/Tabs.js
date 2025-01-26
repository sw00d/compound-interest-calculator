import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addTab, setActiveTab, removeTab } from "../store/tabs/tabsSlice";

export default function Tabs() {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);

  const handleAddTab = () => {
    dispatch(addTab());
  };

  const handleTabClick = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    dispatch(removeTab(tabId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f3f4",
        padding: "8px 8px 0 8px",
        gap: 0.5,
      }}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: "8px 8px 0 0",
            backgroundColor: tab.active ? "#fff" : "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: tab.active ? "#fff" : "#e8eaed",
            },
          }}
        >
          {tab.title}
          {tabs.length > 1 && (
            <IconButton
              size="small"
              onClick={(e) => handleCloseTab(e, tab.id)}
              sx={{ ml: 1, p: 0.2 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      <IconButton onClick={handleAddTab} size="small" sx={{ ml: 1 }}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
