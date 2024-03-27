import React, { useEffect, useState, } from 'react';
import {
  AppBar,
  Alert,
  Paper,
  Toolbar,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Drawer,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  Box,
  CircularProgress,
  Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip,
  Divider,
  ListItemIcon,
  Fab
} from '@mui/material';
import {
  Circle, FileUpload, Menu,
  UploadFile
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeIcon from '@mui/icons-material/Badge';
import GridViewIcon from '@mui/icons-material/GridView';

const uploadPath = '/upload';
const statusPath = '/status';
const verSigPath = '/verify/header';

const serverUrl = "https://localhost:7699/";

const RegComponent = (data) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
//   const [client, setClient] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Open drawer by default
  const [status, setStatus] = useState('Connect');
  const [selectedOption1, setSelectedOption1] = useState(data.headers["signify-resource"]); // Step 2 Selection
  const [selectedOption2, setSelectedOption2] = useState(data.credential.anchor.pre); // Step 3 Selection
//   const [activeStep, setActiveStep] = useState(0);
  const [modalError, setModalError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorUpload, setErrorUpload] = useState('');
  const [submitResult, setSubmitResult] = useState('');

//   const [aids, setAids] = useState([]);
//   const [acdcs, setAcdcs] = useState([]);

  // Define the endpoint paths
  const pingPath = '/ping';
  const loginPath = '/login';

//   // Function to handle the API request and response

  // Function to perform the ping request
  async function ping(): Promise<string> {
    const url = `${serverUrl}${pingPath}`;

    // Make the API request using the fetch function
    const response = await fetch(url);
    const responseData = await response.json();

    // Return the pong message
    return responseData;
  }

  // Function to perform the login request
  async function login(aid: string, said: string, vlei: string): Promise<any> {
    const url = `${serverUrl}${loginPath}`;

    // Create the request body object
    const requestBody = {
      aid,
      said,
      vlei
    };

    // Make the API request using the fetch function
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();

    // Return the response data
    return responseData;
  }

  const toggleDrawer = (open: any) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (status !== 'Connected')
      return;
    setOpen(false);
    setModalError('')

  };
  const renderComponent = (componentName: any) => {
    //check if the client is not null then render the component otherwise set the drwar to true
    if (selectedOption2 === '') {
      setDrawerOpen(true);
      setModalError(`Please connect to the agent first`)
      setOpen(true);
      return;
    }
    setSelectedComponent(componentName);
  };
//   const checkHeaderSignatures = async (aid: any, name: any) => {
//     console.log("Checking header signatures")
//     const response_signed = await client.signedFetch(serverUrl,`${verSigPath}`, 'GET',null,name)
//     const response_signed_data = await response_signed.json();
//     console.log("header signature verification response",response_signed_data)
//   }

  const loginReal = async () => {
    let vlei_cesr = data.credential
    console.log("vlei cesr",vlei_cesr)

    let logged_in = await login(selectedOption1, selectedOption2, vlei_cesr)
    console.log("logged in result",logged_in)
    if (logged_in.aid === data.headers["signify-resource"]) {
      setStatus('Connected')
      setModalError('')
      // await checkHeaderSignatures(getSelectedAid().prefix,getSelectedAid().name);
    }
    else if (JSON.stringify(logged_in).includes('Exception')) {
      setStatus('Failed')
      setModalError('Login Failed. Please pick different credential')
    } else {
      setStatus('Connecting')
      setModalError('Waiting for verificaiton')
    }

  }

  // const renderComponent = (componentName: any) => {
  //   //check if the client is not null then render the component otherwise set the drwar to true
  //   if (client === null || selectedOption2 === '') {
  //     setDrawerOpen(true);
  //     setModalError(`Please connect to the agent first`)
  //     setOpen(true);
  //     return;
  //   }
  //   setSelectedComponent(componentName);
  // };

//   const getSelectedAid = () => {
//     const aid_found = aids.find(aid => aid.name === selectedOption1)
//     if (aid_found !== undefined) {
//       return aid_found
//     }
//     return undefined
//     return
//   }

//   const getSelectedAcdc = () => {
//     const acdc_found = acdcs.find(acdc => acdc.sad.d === selectedOption2)
//     if (acdc_found !== undefined) {
//       return acdc_found
//     }
//     return undefined
//   }

//   const resetAidSelected = () => {
//     setActiveStep(1)
//     handleClickOpen()
//     setSelectedOption1('')
//     setSelectedOption2('')
//     setStatus('Connecting')
//     setModalError('Select a new identifier and credential')
//   }

//   const connectToAgent = async (client: SignifyClient) => {
//     try {
//       await client.connect()
//       await client.state();

//     } catch (e) {
//       await client.boot();
//       await client.connect()
//       await client.state();
//     }
//   }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '100vh',
        width: '100vw'
      }}
    >
       <AppBar position="fixed" sx={{ width: '100%' }}>
         <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
           <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(!drawerOpen)}>
             <Menu />
           </IconButton>
           <Box
             onClick={toggleDrawer(!drawerOpen)}
             sx={{
               ':hover': {
                 cursor: 'pointer'

              }
            }}
          >
            <Typography variant="h6">
              Menu
            </Typography>
          </Box>
          <Button
            sx={{
              marginLeft: 'auto', backgroundColor: 'lightblue', color: 'black', '&:hover': {
                color: 'white'
              }
            }} onClick={handleClickOpen} variant='contained'
            startIcon={
              <Circle sx={{
                color: status === 'Connected' ? 'green' : (status === 'Connecting' ? 'orange' : 'red')
              }} />
            }
          >
            {status}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Check Status', 'Upload Report'].map((text, index) => (
              <ListItem key={text} onClick={() => renderComponent(text)

              }
                sx={{
                  '&:hover': {
                    backgroundColor: 'lightblue',
                    cursor: 'pointer'
                  }
                }}
              >
                {index === 0 ? <ListItemIcon> <GridViewIcon /> </ListItemIcon> : <ListItemIcon> <FileUpload /> </ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>

      </Drawer>
      <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true}>
        <DialogTitle>
          <Button

            sx={{
              "&.Mui-disabled": {
                color: "black"
              }
            }} onClick={handleClickOpen}
            disabled={true}
            startIcon={
              <Circle sx={{
                color: status === 'Connected' ? 'green' : (status === 'Connecting' ? 'orange' : 'red')
              }} />
            }
          >
            {status}
          </Button>
          <Tooltip title="Close" key={'close'}>
            <IconButton
              component="div"
              sx={{ position: 'absolute', right: 10, top: 10 }}
              onClick={handleClose}
              disabled={status === 'Failed'}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          {modalError !== '' && <Alert severity={modalError.includes('agent') ? 'error' : 'warning'}>
            <Typography variant="body2">
              {modalError}
            </Typography>
          </Alert>}
                    <>
                    <Tooltip title={data.credential.sad.d} key={'cred sad'}><Typography variant="body2">{data.credential.sad.d}</Typography></Tooltip>
                            {/* <FormControlLabel key={index} value={acdc['sad']['d']} control={<Radio />} label={acdc.sad.a.engagementContextRole} /> */}
                          
                        
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={false}
                        onClick={
                          async () => {
                            await loginReal()
                          }
                        }
                      >
                         Next
                       </Button>
                     </>
                  )

        </DialogContent>
      </Dialog>
      {/* // <LandingComponent text='Welcome to Reg portal' />
      // {selectedComponent === 'Check Status' && <MyTable
      //   client={client}
      //   setSelectedComponent={setSelectedComponent}
      //   selectedAcdc={selectedOption2}
      //   selectedAid={selectedOption1}
      // />}
      // {selectedComponent === 'Upload Report' && <DragAndDropUploader
      //   errorUpload={errorUpload}
      //   setErrorUpload={setErrorUpload}
      //   submitResult={submitResult}
      //   setSubmitResult={setSubmitResult}
      //   selectedFile={selectedFile}
      //   setSelectedFile={setSelectedFile}
      //   setSelectedComponent={setSelectedComponent}
      //   selectedAcdc={selectedOption2}
      //   selectedAid={selectedOption1}
      // />} */}

    </Box>
  );
};

//write a function that takes a string and adds ellipses to it if it is too long in the middle of the string, only show 4 characters on each side of the ellipses
const reduceString = (str: string) => {
  if (str.length > 40) { //TODO change to smaller number
    return str.slice(0, 6) + '...' + str.slice(str.length - 6, str.length)
  }
  return str
}

interface TextComponentProps {
  text: string;
}

const TextComponent: React.FC<TextComponentProps> = ({ text }) => (
  <Grid item xs={1} lg={1} left={'50%'}><Box><Typography> {text}</Typography></Box></Grid>
)

const LandingComponent: React.FC<TextComponentProps> = ({ text }) => (
  <Grid item xs={1} lg={1} left={'50%'}>
    <Box textAlign={'center'}>
      <Typography variant='h1'>{text}</Typography>
      <br />
      <Divider />
      <br />
      <br />
      <Typography variant='h5'>Please start by connecting using the button in the top right.</Typography>
    </Box>
  </Grid>
)


// const DragAndDropUploader = ({ client, errorUpload, setErrorUpload, submitResult, setSubmitResult, selectedFile, setSelectedFile, setSelectedComponent, resetAidSelected, selectedAid, selectedAcdc }) => {

//   useEffect(() => {
//     setErrorUpload('')
//     setSelectedFile(null)
//     setSubmitResult('')
//   }
//     , [])

//   const setFile = (file: any) => {
//     const acceptedTypes = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/zip-compressed', 'application/octet-stream'];

//     if (!acceptedTypes.includes(file.type)) {
//       setSelectedFile(null);
//       setErrorUpload(`${file.name} is not a zip file. \n Please select a zip file.`)
//       setSubmitResult('')
//       return
//     }
//     setErrorUpload('')
//     setSubmitResult('')
//     setSelectedFile(file);
//   }
  const handleFileSelect = (event: any) => {
    let file = event.target.files[0]
    setFile(file)

  };


  const handleDrop = (event: any) => {
    event.preventDefault();
    let file = event.dataTransfer.files[0]
    setFile(file)
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  // Function to perform the upload request
  async function upload(aid: string, said: string, report: string): Promise<any> {
    const formData = new FormData();
    formData.append('upload', report);
    
    // // Send signed request
    console.log("Form data is",formData.get('upload'))
    const response_signed = await client.signedFetch(serverUrl,`${uploadPath}/${aid}/${said}`, 'POST',formData,aid.name)
    const response_signed_data = await response_signed.json();
    console.log("upload response",response_signed_data)


    // Return the response data
    return response_signed_data;
  }

  const handleSubmit = async () => {
    // Add your upload logic her
    setSubmitResult('uploading')
    //wait 2 seconds
    //await new Promise(r => setTimeout(r, 2000));
    await upload(selectedAid, selectedAcdc, selectedFile)

    setSubmitResult(`done|${selectedFile.name}`)
    // await new Promise(r => setTimeout(r, 2000));
    // setSubmitResult(`fail|${selectedFile.name}` )
    setSelectedFile(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        gap: 2,
        height: '80%',
      }}
    >

      <Typography variant="h4">Upload your report</Typography>


      {errorUpload !== '' && (
        <Alert
          severity="error"

        >
          {errorUpload}
        </Alert>
      )}

      {submitResult.split('|')[0] === 'fail' && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => { setSubmitResult(''), setSelectedComponent('Check Status') }}>
              Check Status
            </Button>
          }
        >
          Failed submitted the report {submitResult.split('|')[1]}
        </Alert>
      )}

      {submitResult.split('|')[0] === 'done' && (
        <Alert
          severity="success"
          action={
            <Button color="inherit" size="small" onClick={() => { setSubmitResult(''), setSelectedComponent('Check Status') }}>
              Check Status
            </Button>
          }
        >
          Successfuly submitted the report {submitResult.split('|')[1]}
        </Alert>
      )}

      {submitResult === 'uploading' && (
        <Alert
          severity="info"
        >
          Uploading {selectedFile.name}
        </Alert>
      )}

      {errorUpload === '' && selectedFile !== null && submitResult === '' && (
        <Alert
          severity="success"
        >
          Succesfully loaded report {selectedFile.name}
          {<br />}
          Submit your report next.
        </Alert>
      )}
      <Box
        sx={{
          width: '100%',
          height: '200px',
          border: '2px dashed gray',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 1
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <UploadFile /> <p>Selected File: {selectedFile.name}</p>
          </>
        ) : (<>
          <UploadFile />
          <p>Drag and drop a file here or <br /> click the button to select a file.</p>
        </>
        )}
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </label>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => { await handleSubmit() }}
        disabled={!selectedFile}
      >
        Submit Report
      </Button>
    </Box>
  );
};

const MyTable = ({ client, setSelectedComponent, selectedAid, selectedAcdc }) => {
  const [data, setData] = useState<Array<any>>();
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModalTable, setOpenModalTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const _fakedata = [
    { filename: 'File 1', size: '10 MB', message: 'last update 2023-06-01', status: 'Uploaded' },
    { filename: 'File 2', size: '5 MB', message: 'last update 2023-06-02', status: 'Failed' },
    { filename: 'File 3', size: '2 MB', message: 'last update 2023-06-03', status: 'Uploaded' },
    { filename: 'File 4', size: '1 MB', message: 'last update 2023-06-04', status: 'Processing' },
  ]
  useEffect(() => {
    // Simulating fetch request
    const fetchData = async () => {
      try {
        // Replace this with your actual fetch URL
        setLoading(true);
        let d = await checkUpload(selectedAid)
        console.log("Response data is type and data",typeof(d),d)
        let newData = new Set<any>()
        let statuses = Object.keys(d).map((item: any) => {
          return d[item].map((status: any) => {
            newData.add(status)
          })
        });
        console.log("Status data converted type and data",typeof(statuses),statuses)
        console.log("New data converted type and data",typeof(newData),newData)
        setData(Array.from(newData))
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setOpenModalTable(true);
  };

  const handleCloseModal = () => {
    setOpenModalTable(false);
  };

  // Function to perform the upload request
  async function checkUpload(aid): Promise<any> {
     // // Send signed request
    const response_signed = await client.signedFetch(serverUrl,`${statusPath}/${aid.prefix}`, 'GET',null,aid.name)
    const response_signed_data = await response_signed.json();
    console.log(response_signed_data)
    return response_signed_data;
  }

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '80%',
//         gap: 2
//       }}
//     >
//       <Typography variant="h4">Check Status</Typography>
//       {loading &&
//         <CircularProgress
//           sx={{
//             margin: 'auto'
//           }}
//         />}

//       {(!data || data.length == 0) && !loading && <Alert severity="info" action={
//         <Button color="inherit" size="small" onClick={() => {
//           setSelectedComponent('Upload Report')
//         }}>
//           Upload Report
//         </Button>
//       }>You don't have any reports yet.</Alert>}
//       {data && !loading && <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>File</TableCell>
//               <TableCell>Size</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Message</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item: any) => (
//               <TableRow key={item.filename} onClick={() => handleRowClick(item)}>
//                 <TableCell>{item.filename == undefined ? "unknown" : item.filename.substring(0,75)}</TableCell>
//                 <TableCell>{item.size == undefined ? "unknown" : item.size}</TableCell>
//                 <TableCell style={
//                   item.status === 'verified' ? {'color': 'green'} : item.status === 'failed' ? {'color': 'red'} : {'color': 'yellow'}}>
//                   {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</TableCell>
//                 <TableCell>{item.message == undefined ? "unknown" : item.message.substring(0,75)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>}

//       <Modal open={openModalTable} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             bgcolor: '#348ceb',
//             boxShadow: 24,
//             p: 4,
//             minWidth: 275,
//           }}
//         >
//           <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
//             <CloseIcon />
//           </IconButton>
//           {selectedReport && (
//             <>
//               <Typography variant="h6" gutterBottom>
//                 Report Details
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Filename: {selectedReport.filename}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Size: {selectedReport.size}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Status: {selectedReport.status}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Message: {selectedReport.message}
//               </Typography>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {!loading && <Fab
//         color="primary"
//         aria-label="add"
//         style={{ position: 'fixed', bottom: '20px', right: '20px' }}
//         onClick={async () => {
//           setData(_fakedata);

//         }}
//       >
//         <AddIcon />
//       </Fab>}
//     </Box>
//   );
};

export default RegComponent;
