import { useState, useCallback, FormEventHandler } from 'react';
import { NextPage } from 'next';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
} from '@material-ui/core';
import update from 'immutability-helper';

// Types
import { User } from '@/types/auth';

// API
import API from '@/api';

// HOCs
import { withAuth } from '@/hocs';

// Custom Hooks
import { useAuth } from '@/hooks';

// Redux Actions
import { setUser as setUserRedux } from '@/redux/actions/auth';

// Components
import { AppLayout } from '@/components/app';

interface UpdateUserNameFormData {
  name: User['name'];
}

interface UpdateUserEmailFormData {
  email: User['email'];
  password: User['password'];
}

interface UpdateUserPasswordFormData {
  password: User['password'];
  passwordConfirm: User['password'];
  currentPassword: User['password'];
}

interface FieldChangeState {
  name: boolean;
  email: boolean;
  password: boolean;
}

const SettingsPage: NextPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [changes, setChanges] = useState<FieldChangeState>({
    name: false,
    email: false,
    password: false,
  });
  const [updateNameFormData, setUpdateNameFormData] =
    useState<UpdateUserNameFormData>({
      name: '',
    });
  const [updateEmailFormData, setUpdateEmailFormData] =
    useState<UpdateUserEmailFormData>({
      email: '',
      password: '',
    });
  const [updatePasswordFormData, setUpdatePasswordFormData] =
    useState<UpdateUserPasswordFormData>({
      password: '',
      passwordConfirm: '',
      currentPassword: '',
    });

  // Async Change Handlers
  const handleChangeName = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      try {
        e.preventDefault();

        setLoading(true);

        await API.patch('/users/name', {
          name: updateNameFormData.name,
        });

        setLoading(false);

        setChanges(
          update(changes, {
            name: {
              $set: false,
            },
          }),
        );

        dispatch(
          setUserRedux(
            update(auth.user, {
              name: {
                $set: updateNameFormData.name,
              },
            }),
          ),
        );
      } catch (err) {
        setLoading(false);
      }
    },
    [updateNameFormData],
  );
  const handleChangeEmail = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      try {
        setLoading(true);

        await API.patch('/users/email', {});

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    },
    [updateEmailFormData],
  );

  return (
    <AppLayout title='Settings'>
      <Grid container direction='column' spacing={4}>
        {/* Header */}
        <Grid item>
          <Typography className={classes.bold} variant='h5' gutterBottom>
            Settings
          </Typography>
        </Grid>

        {/* Account Details */}
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography className={classes.bold} variant='h6' gutterBottom>
              Account Details
            </Typography>
          </Grid>

          {/* Change Name */}
          {changes.name ? (
            <Grid
              item
              container
              component='form'
              onSubmit={handleChangeName}
              direction='column'
              spacing={2}
            >
              <Grid item>
                <Typography className={classes.bold} variant='subtitle1'>
                  Change Name
                </Typography>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='New name'
                  onChange={(e) =>
                    setUpdateNameFormData({
                      name: e.target.value,
                    })
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                container
                direction='row'
                justifyContent='flex-end'
                spacing={1}
              >
                <Grid item>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() =>
                      setChanges(
                        update(changes, {
                          name: {
                            $set: false,
                          },
                        }),
                      )
                    }
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button type='submit' variant='contained' color='primary'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item container direction='column'>
              <Grid
                item
                container
                direction='row'
                alignItems='center'
                spacing={1}
              >
                <Grid item>
                  <Typography className={classes.bold} variant='subtitle1'>
                    Name
                  </Typography>
                </Grid>

                <Grid item>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() =>
                      setChanges(
                        update(changes, {
                          name: {
                            $set: true,
                          },
                        }),
                      )
                    }
                  >
                    Change
                  </Button>
                </Grid>
              </Grid>

              <Grid item>
                <Typography variant='subtitle2'>{auth.user?.name}</Typography>
              </Grid>
            </Grid>
          )}

          {/* Change Email */}
          {changes.email ? (
            <Grid
              item
              container
              component='form'
              direction='column'
              spacing={2}
            >
              <Grid item>
                <Typography className={classes.bold} variant='subtitle1'>
                  Change Email
                </Typography>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='New Email'
                  onChange={(e) =>
                    setUpdateEmailFormData(
                      update(updateEmailFormData, {
                        email: {
                          $set: e.target.value,
                        },
                      }),
                    )
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='Confirm Your Password'
                  onChange={(e) =>
                    setUpdateEmailFormData(
                      update(updateEmailFormData, {
                        password: {
                          $set: e.target.value,
                        },
                      }),
                    )
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                container
                direction='row'
                justifyContent='flex-end'
                spacing={1}
              >
                <Grid item>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() =>
                      setChanges(
                        update(changes, {
                          email: {
                            $set: false,
                          },
                        }),
                      )
                    }
                  >
                    Cancel
                  </Button>
                </Grid>

                <Grid item>
                  <Button variant='contained' color='primary'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item container direction='column'>
              <Grid
                item
                container
                direction='row'
                alignItems='center'
                spacing={1}
              >
                <Grid item>
                  <Typography className={classes.bold} variant='subtitle1'>
                    Email
                  </Typography>
                </Grid>

                <Grid item>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() =>
                      setChanges(
                        update(changes, {
                          email: {
                            $set: true,
                          },
                        }),
                      )
                    }
                  >
                    Change
                  </Button>
                </Grid>
              </Grid>

              <Grid item>
                <Typography variant='subtitle2'>{user?.email}</Typography>
              </Grid>
            </Grid>
          )}

          {/* Change Password */}
          {changes.password ? (
            <Grid item container direction='column' spacing={2}>
              <Grid item>
                <Typography className={classes.bold} variant='subtitle1'>
                  Change Password
                </Typography>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='New Password'
                  onChange={(e) =>
                    setUpdatePasswordFormData(
                      update(updatePasswordFormData, {
                        password: {
                          $set: e.target.value,
                        },
                      }),
                    )
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='Confirm New Password'
                  onChange={(e) =>
                    setUpdatePasswordFormData(
                      update(updatePasswordFormData, {
                        passwordConfirm: {
                          $set: e.target.value,
                        },
                      }),
                    )
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  required
                  label='Current Password'
                  onChange={(e) =>
                    setUpdatePasswordFormData(
                      update(updatePasswordFormData, {
                        currentPassword: {
                          $set: e.target.value,
                        },
                      }),
                    )
                  }
                  disabled={loading}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                container
                direction='row'
                justifyContent='flex-end'
                spacing={1}
              >
                <Grid item>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() =>
                      setChanges(
                        update(changes, {
                          password: {
                            $set: false,
                          },
                        }),
                      )
                    }
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='primary'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={() =>
                  setChanges(
                    update(changes, {
                      password: {
                        $set: true,
                      },
                    }),
                  )
                }
              >
                Change Password
              </Button>
            </Grid>
          )}
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        {/* Account Deletion */}
        <Grid item container direction='column' spacing={2}>
          <Grid item>
            <Typography className={classes.bold} variant='h6' gutterBottom>
              Account Deletion
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant='caption'>
              This will immediately delete all of your data including todos,
              lists, and more. This can’t be undone.
            </Typography>
          </Grid>

          <Grid item>
            <Button fullWidth variant='contained' color='secondary'>
              Permanently delete account
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default withAuth(SettingsPage);

const useStyles = makeStyles((theme) =>
  createStyles({
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
