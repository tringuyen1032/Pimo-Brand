import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Stack, TextField, Alert, Autocomplete, Chip } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
   'Toy Story 3',
   'Logan',
   'Full Metal Jacket',
   'Dangal',
   'The Sting',
   '2001: A Space Odyssey',
   "Singin' in the Rain",
   'Toy Story',
   'Bicycle Thieves',
   'The Kid',
   'Inglourious Basterds',
   'Snatch',
   '3 Idiots'
 ];

export default function RegisterForm() {
   const { register } = useAuth();
   const isMountedRef = useIsMountedRef();
   const { enqueueSnackbar, closeSnackbar } = useSnackbar();

   const RegisterSchema = Yup.object().shape({
      firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
      lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
      phoneNumber: Yup.number().required('Phone number is required'),
      password: Yup.string().required('Password is required'),
      email: Yup.string().required('Email is required')
   });

   const formik = useFormik({
      initialValues: {
         firstName: '',
         lastName: '',
         email: '',
         password: ''
      },
      validationSchema: RegisterSchema,
      onSubmit: async (values, { setErrors, setSubmitting }) => {
         try {
            await register(values.email, values.password, values.firstName, values.lastName);
            enqueueSnackbar('Register success', {
               variant: 'success',
               action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                     <Icon icon={closeFill} />
                  </MIconButton>
               )
            });
            if (isMountedRef.current) {
               setSubmitting(false);
            }
         } catch (error) {
            console.error(error);
            if (isMountedRef.current) {
               setErrors({ afterSubmit: error.message });
               setSubmitting(false);
            }
         }
      }
   });

   const { errors, values, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

   return (
      <FormikProvider value={formik}>
         <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
               {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                     fullWidth
                     label="First name"
                     {...getFieldProps('firstName')}
                     error={Boolean(touched.firstName && errors.firstName)}
                     helperText={touched.firstName && errors.firstName}
                  />

                  <TextField
                     fullWidth
                     label="Last name"
                     {...getFieldProps('lastName')}
                     error={Boolean(touched.lastName && errors.lastName)}
                     helperText={touched.lastName && errors.lastName}
                  />
               </Stack>

               <TextField
                  fullWidth
                  autoComplete="username"
                  type="email"
                  label="Email address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
               />

               <TextField
                  fullWidth
                  autoComplete="phoneNumber"
                  type="number"
                  label="Phone number"
                  {...getFieldProps('phoneNumber')}
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
               />

               <Autocomplete
                  multiple
                  freeSolo
                  value={values.tags}
                  onChange={(event, newValue) => {
                     setFieldValue('tags', newValue);
                  }}
                  options={TAGS_OPTION.map((option) => option)}
                  renderTags={(value, getTagProps) =>
                     value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                     ))
                  }
                  renderInput={(params) => <TextField {...params} label="Category" />}
               />

               <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                  Register
               </LoadingButton>
            </Stack>
         </Form>
      </FormikProvider>
   );
}
