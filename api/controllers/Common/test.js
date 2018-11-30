module.exports = async function (req, res) {
  const userInfo = {
    email: "ttdung001@gmail.com",
    displayName: "Dung Tran",
    firstName: "Dung",
    lastName: "Tran",
    name: "Smartdev"
  };

  const admins = [{
    displayName: 'Dung',
    email: "ttdung001@gmail.com"
  }]

  const verificationToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dGR1bmcwMDFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkSmRkZDZhWlZSVjRYeGJFVG5LN0d4dUE3S3Vuby9jZ1hsOS9wekU2QllBb3V3SHJRMTQ3d3UiLCJ0b2tlbl90eXBlIjoiQUNDRVNTX1RPS0VOIiwicm9sZSI6InN0dWRlbnQiLCJqd3RpZCI6ImF1dGhfdG9rZW5faWQ6WHZnN1BJMmE3IiwiaWF0IjoxNTQzNDI4MDMxLCJleHAiOjE1NDM1MTQ0MzF9.a1pYVe6hQg_Lf3ebJRXGvv4OeMWxL5cDa7d8W77qudY-NkUJMn3NZH0H4_Nul3TIIgEH9tdS_F1TUU997sC1h2GAHMvDXHCKF_kmGpjji2_9nIc9MxBxqZ7lKQdkoiVjHtPaRTu0Mtm3a25KjS3mYX_Hf6jfn3WTRi-G9v409MUhNfFdTSAL0wk9m-RayL1Dpn3MxzYNEIuDwoMpTdyXdwy50kG_PmmcUpXN8AVs3JKRilkwnW7tyNe3jJf2pPEBPbhZIHVPJAG9sfMDHegFXOf64r30FSy1tUZj18gVdrzKEGY7chVPtUzZEjwYWFoDJXbJ4gGllu-CWqO2nBvmyw";

  await EmailService.sendToAdmins(admins, 'verify-admin-email', {
    verificationLink: `${process.env.WEB_URL}/admin/verify-account?token=${verificationToken}`,
    userInfo
  });

  res.ok("Sent");
}