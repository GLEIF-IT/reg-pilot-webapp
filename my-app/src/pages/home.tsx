import React from "react";
import { Box, Grid } from "@mui/material";
import Hero from "../components/home/hero.tsx";
import ExtensionInfo from "../components/home/ext-info.tsx";
import SignifyInfo from "../components/home/signify-info.tsx";

const extConf = "https://api.npoint.io/52639f849bb31823a8c0";

const HomePage = ({
  devMode,
  selectedId,
  selectedAcdc,
  handleCredSignin,
  handleAutoSignin,
  handleAidSignin,
  removeData,
  signatureData,
  loginUrl,
  handleSettingVendorUrl,
  vendorConf,
}) => {
  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Hero />
      </Grid>
      <Grid item xs={4}>
        <ExtensionInfo
          signedDataReceived={Boolean(signatureData)}
          vendorConfigued={vendorConf}
          removeData={removeData}
          devMode={devMode}
          handleCredSignin={handleCredSignin}
          handleAutoSignin={handleAutoSignin}
          handleAidSignin={handleAidSignin}
          signatureData={signatureData}
          handleConfigExt={() => handleSettingVendorUrl(extConf)}
        />
      </Grid>
      <Grid item xs={8}>
        <Box sx={{ paddingX: "32px" }}>
          {signatureData && (
            <SignifyInfo
              selectedId={selectedId}
              selectedAcdc={selectedAcdc}
              devMode={devMode}
              loginUrl={loginUrl}
              signatureData={signatureData}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
