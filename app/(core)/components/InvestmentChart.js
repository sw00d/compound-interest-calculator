import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts";

export default function InvestmentChart({ initialInvestment, legs }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const calculateInvestmentGrowth = () => {
    const totalYears = legs.reduce((sum, leg) => sum + leg.years, 0);
    const years = Array.from({ length: totalYears + 1 }, (_, i) => i);

    // Initialize data series for each leg
    const data = legs.map((leg) => ({
      label: `${leg.years} years at ${leg.interestRate}%`,
      color: leg.color,
      data: new Array(totalYears + 1).fill(null),
    }));

    // Calculate growth for each period
    let currentYear = 0;
    let currentValue = initialInvestment; // Only use initialInvestment at the very start

    // Fill in initial value at year 0 for the first leg only
    data[0].data[0] = currentValue;

    legs.forEach((leg, legIndex) => {
      const monthlyRate = leg.interestRate / 100 / 12;

      // Fill in values for this leg's period
      for (
        let year = currentYear + 1;
        year <= currentYear + leg.years;
        year++
      ) {
        // Calculate growth for the year (12 months)
        for (let month = 0; month < 12; month++) {
          currentValue =
            (currentValue + leg.monthlyContribution) * (1 + monthlyRate);
        }
        data[legIndex].data[year] = currentValue;
      }

      // If there's a next leg, set its starting point
      if (legIndex < legs.length - 1) {
        data[legIndex + 1].data[currentYear + leg.years] = currentValue;
      }

      currentYear += leg.years;
    });

    return { data, years };
  };

  const { data, years } = calculateInvestmentGrowth();

  // Get ending values for each period
  const periodEndValues = data.map((series) => {
    const lastValue = series.data.filter(Boolean).pop();
    return {
      label: series.label,
      value: lastValue,
      color: series.color,
    };
  });

  return (
    <Box>
      <Box
        sx={{
          gap: 1,
          mb: { xs: 1, md: 2 },
          p: { xs: 0.5, md: 1 },
          borderRadius: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent:
            periodEndValues.length > 1 ? "space-between" : "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.02)",
        }}
      >
        {periodEndValues.length > 1 && (
          <Box>
            {periodEndValues.map((period, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: period.color,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  End of period {index + 1}:{" "}
                  <Box className="value" component="span">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(period.value)}
                  </Box>
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "#34D399",
            }}
          >
            Total:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(periodEndValues[periodEndValues.length - 1].value)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", md: "400px" },
        }}
      >
        <LineChart
          series={data.map((series) => ({
            ...series,
            area: true,
            showMark: false,
            highlightScope: {
              highlighted: "point",
              faded: "global",
            },
            valueFormatter: (value) => {
              if (value === null) return null;
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(value);
            },
          }))}
          xAxis={[
            {
              data: years,
              label: "Years",
              scaleType: "linear",
              valueFormatter: (value) => `Year ${value.toString()}`,
            },
          ]}
          slots={{
            legend: () => null,
          }}
          height={isMobile ? 300 : 400}
          margin={{
            left: isMobile ? 60 : 80,
            right: isMobile ? 10 : 20,
            top: isMobile ? 10 : 20,
            bottom: isMobile ? 30 : 40,
          }}
          sx={{
            ".MuiLineElement-root": {
              strokeWidth: 2,
            },
            ".MuiChartsAxis-line": {
              stroke: theme.palette.text.secondary,
            },
            ".MuiAreaElement-root": {
              fillOpacity: 0.15,
            },
            "& .MuiChartsAxis-tick": {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            },
          }}
          // tooltip={{
          //   trigger: "axis",
          // }}
        />
      </Box>
    </Box>
  );
}
