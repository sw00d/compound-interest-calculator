"use client";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import InvestmentChart from "../(core)/components/InvestmentChart";
import { useEffect, useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveTab,
  selectActiveTabData,
  updateTabData,
  updateLeg,
  addLeg,
} from "../(core)/store/tabs/tabsSlice";

export default function Home() {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const activeTabData = useSelector(selectActiveTabData);
  const [expandedPeriod, setExpandedPeriod] = useState(1);

  const handleLegChange = (legId, field, value) => {
    dispatch(
      updateLeg({
        tabId: activeTab.id,
        legId,
        field,
        value,
      })
    );
  };

  const handleInitialInvestmentChange = (value) => {
    dispatch(
      updateTabData({
        tabId: activeTab.id,
        data: {
          ...activeTabData,
          initialInvestment: value,
        },
      })
    );
  };

  const handleAddLeg = () => {
    dispatch(addLeg({ tabId: activeTab.id }));
    setExpandedPeriod(activeTabData.legs.length + 1);
  };

  const handleAccordionChange = (legId) => (event, isExpanded) => {
    setExpandedPeriod(isExpanded ? legId : false);
  };

  const formatPeriodTitle = (leg) => {
    return `${leg.years} years at ${leg.interestRate}% with $${leg.monthlyContribution}/month`;
  };

  const removeLeg = (legId) => {
    if (activeTabData.legs.length > 1) {
      // Prevent removing the last period
      dispatch(
        updateTabData({
          tabId: activeTab.id,
          data: {
            ...activeTabData,
            legs: activeTabData.legs.filter((leg) => leg.id !== legId),
          },
        })
      );
    }
  };

  return (
    <Box
      className="content-wrapper"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: "flex-start",
        justifyContent: "center",
        mt: { xs: 1, md: 2 },
        gap: 1,
        px: { xs: 1, md: 2 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: { xs: 0.5, md: 1 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 1, md: 2 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Investment Calculator
          </Typography>

          <TextField
            label="Initial Investment"
            type="number"
            value={activeTabData.initialInvestment}
            onChange={(e) =>
              handleInitialInvestmentChange(Number(e.target.value))
            }
            fullWidth
            margin="normal"
            size="small"
          />

          {activeTabData.legs.map((leg, index) => (
            <Box sx={{ position: "relative" }} key={leg.id}>
              <Accordion
                expanded={expandedPeriod === leg.id}
                onChange={handleAccordionChange(leg.id)}
              >
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderLeft: `4px solid ${leg.color}`,
                    "&.Mui-expanded": {
                      minHeight: "auto",
                    },
                    position: "relative", // For positioning the remove button
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography>{formatPeriodTitle(leg)}</Typography>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderLeft: `4px solid ${leg.color}`,
                  }}
                >
                  <TextField
                    label="Monthly Contribution"
                    type="number"
                    value={leg.monthlyContribution}
                    onChange={(e) =>
                      handleLegChange(
                        leg.id,
                        "monthlyContribution",
                        Number(e.target.value)
                      )
                    }
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Years"
                    type="number"
                    value={leg.years}
                    onChange={(e) =>
                      handleLegChange(leg.id, "years", Number(e.target.value))
                    }
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Interest Rate (%)"
                    type="number"
                    value={leg.interestRate}
                    onChange={(e) =>
                      handleLegChange(
                        leg.id,
                        "interestRate",
                        Number(e.target.value)
                      )
                    }
                    fullWidth
                    margin="normal"
                  />
                </AccordionDetails>
              </Accordion>
              {index === activeTabData.legs.length - 1 && index > 0 && (
                <IconButton
                  disabled={activeTabData.legs.length === 1}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion from toggling
                    removeLeg(leg.id);
                  }}
                  sx={{
                    position: "absolute",
                    right: 8, // Position it to the left of the expand icon
                    top: expandedPeriod === leg.id ? 12 : 4,
                    transition: "all 0.3s",
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                    },
                  }}
                >
                  <RemoveCircleOutlineIcon sx={{ transition: "all 0.1s" }} />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={handleAddLeg}
            sx={{ mt: 1, textTransform: "none" }}
          >
            Add Period
          </Button>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          p: { xs: 0.5, md: 1 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
        }}
      >
        <InvestmentChart
          initialInvestment={activeTabData.initialInvestment}
          legs={activeTabData.legs}
        />
      </Card>
    </Box>
  );
}
