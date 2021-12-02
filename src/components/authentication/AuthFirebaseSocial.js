import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
import React from 'react';
import MuiAlert from '@mui/material/Alert';
// ----------------------------------------------------------------------
const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function AuthFirebaseSocials() {
   const { login, loginWithFaceBook, loginWithTwitter } = useAuth();
   const [checkLogin, setCheckLogin] = React.useState(false);

   React.useEffect(() => {
      if (checkLogin === true) {
         document.getElementById('error').style.display = 'block';
         setTimeout(() => {
            document.getElementById('error').style.display = 'none'
            setCheckLogin(false)
         }, 5000)
      } else {
         document.getElementById('error').style.display = 'none';
      }
   }, [checkLogin])

   const handleLoginGoogle = async () => {
      try {
         await login().then(result => {
            try {
               if (result[1].message) {
                  setCheckLogin(true)
               }
            } catch (err) {
               setCheckLogin(false)
            }
         });
      } catch (error) {
         console.error(error);
      }
   };

   const handleLoginFaceBook = async () => {
      try {
         await loginWithFaceBook();
      } catch (error) {
         console.error(error);
      }
   };

   const handleLoginTwitter = async () => {
      try {
         await loginWithTwitter();
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <>
         <div style={{ display: 'none' }} id="error">
            <Alert severity="error" sx={{ width: '100%' }}>
               You do not have permission to access this page
            </Alert>
            <br></br>
         </div>
         <Stack direction="row" spacing={2}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginGoogle}>
               <Icon icon={googleFill} color="#DF3E30" height={24} />
            </Button>

            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginFaceBook}>
               <Icon icon={facebookFill} color="#1877F2" height={24} />
            </Button>

            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginTwitter}>
               <Icon icon={twitterFill} color="#1C9CEA" height={24} />
            </Button>
         </Stack>

         <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Don’t have an account?
            </Typography>
         </Divider>
      </>
   );
}
