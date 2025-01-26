import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addTab, setActiveTab, removeTab } from "../store/tabs/tabsSlice";

export default function Tabs() {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        padding: isMobile ? "4px 4px 0 4px" : "8px 8px 0 8px",
        gap: 0.5,
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "4px 12px" : "8px 20px",
            borderRadius: "8px 8px 0 0",
            backgroundColor: tab.active ? "#fff" : "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
            fontSize: isMobile ? "14px" : "16px",
            whiteSpace: "nowrap",
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
              sx={{
                ml: 0.5,
                p: isMobile ? 0.1 : 0.2,
                "& svg": {
                  fontSize: isMobile ? "16px" : "20px",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <IconButton
        onClick={handleAddTab}
        size="small"
        sx={{
          ml: 1,
          "& svg": {
            fontSize: isMobile ? "18px" : "24px",
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
