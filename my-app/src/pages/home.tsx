import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { trySettingVendorUrl } from "signify-polaris-web";
import Hero from "../components/home/hero.tsx";
import ExtensionInfo from "../components/home/ext-info.tsx";
import SignifyInfo from "../components/home/signify-info.tsx";

const extConf = "https://api.npoint.io/52639f849bb31823a8c0";

const HomePage = ({
  devMode,
  selectedId,
  selectedAcdc,
  handleCredSignin,
  removeData,
  signatureData,
  extensionInstalled,
  loginUrl,
}) => {
  const [vendorConf, setVendorConf] = useState(false);
  
  const handleSettingVendorUrl = async (url) => {
    await trySettingVendorUrl(url);
    setVendorConf(true);
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Hero />
      </Grid>
      <Grid item xs={4}>
        <ExtensionInfo
          installed={extensionInstalled}
          signedDataReceived={Boolean(signatureData)}
          vendorConfigued={vendorConf}
          removeData={removeData}
          devMode={devMode}
          handleCredSignin={handleCredSignin}
          signatureData={signatureData}
          handleConfigExt={() => handleSettingVendorUrl(extConf)}
        />
      </Grid>
      <Grid item xs={8}>
        <Box sx={{paddingX: "32px" }}>
          {extensionInstalled ? (
            <>
              {(vendorConf || devMode) && signatureData && (
                <SignifyInfo
                  selectedId={selectedId}
                  selectedAcdc={selectedAcdc}
                  devMode={devMode}
                  loginUrl={loginUrl}
                  signatureData={signatureData}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
