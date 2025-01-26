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
import { useState, useEffect } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const getInitialState = (currentTabId) => {
  const savedData = localStorage.getItem(
    `investmentCalculator-${currentTabId}`,
  );
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      return {
        legs: parsed.legs,
        initialInvestment: parsed.initialInvestment,
      };
    } catch (e) {
      return getDefaultState();
    }
  }

  return getDefaultState();
};

const getDefaultState = () => ({
  legs: [
    {
      id: 1,
      monthlyContribution: 500,
      years: 10,
      interestRate: 7,
      color: "#34D399",
    },
  ],
  initialInvestment: 10000,
});

export default function Home() {
  const [currentTabId] = useState("tab1"); // In the future, this will be dynamic with tab switching
  const initialState = getInitialState(currentTabId);
  const [legs, setLegs] = useState(initialState.legs);
  const [initialInvestment, setInitialInvestment] = useState(
    initialState.initialInvestment,
  );

  const [expandedPeriod, setExpandedPeriod] = useState(1);

  useEffect(() => {
    const dataToSave = {
      legs,
      initialInvestment,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(
      `investmentCalculator-${currentTabId}`,
      JSON.stringify(dataToSave),
    );
  }, [legs, initialInvestment, currentTabId]);

  const handleLegChange = (legId, field, value) => {
    setLegs(
      legs.map((leg) => (leg.id === legId ? { ...leg, [field]: value } : leg)),
    );
  };

  const addLeg = () => {
    const newId = Math.max(...legs.map((leg) => leg.id)) + 1;
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

    setLegs([
      ...legs,
      {
        id: newId,
        monthlyContribution: 500,
        years: 5,
        interestRate: 7,
        color: listOfColors[legs.length % listOfColors.length],
      },
    ]);
    setExpandedPeriod(newId);
  };

  const handleAccordionChange = (legId) => (event, isExpanded) => {
    setExpandedPeriod(isExpanded ? legId : false);
  };

  const formatPeriodTitle = (leg) => {
    return `${leg.years} years at ${leg.interestRate}% with $${leg.monthlyContribution}/month`;
  };

  const removeLeg = (legId) => {
    if (legs.length > 1) {
      // Prevent removing the last period
      setLegs(legs.filter((leg) => leg.id !== legId));
    }
  };

  return (
    <Box
      className="content-wrapper"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 2,
        gap: 1,
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Investment Calculator
          </Typography>

          <TextField
            label="Initial Investment"
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            fullWidth
            margin="normal"
          />

          {legs.map((leg, index) => (
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
                        Number(e.target.value),
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
                        Number(e.target.value),
                      )
                    }
                    fullWidth
                    margin="normal"
                  />
                </AccordionDetails>
              </Accordion>
              <IconButton
                disabled={legs.length === 1}
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
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={addLeg}
            sx={{ mt: 1, textTransform: "none" }}
          >
            Add Period
          </Button>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          p: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
        }}
      >
        <InvestmentChart initialInvestment={initialInvestment} legs={legs} />
      </Card>
    </Box>
  );
}
