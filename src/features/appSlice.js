import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabaseClient.config";
import { showErrorToast, showSuccessToast } from "../utils/toastNotify";

const initialState = {
    allUsers: null,
    loggedUser: null,
    otherUsers: null,
    profileUser: null,
    searchedUsers: [],
    notifications: [],
    isLoading: true,
    isLoadingOtherUsers: true,
    isLoadingProfile: true,
    isUpdatingProfile: false,
    isLoadingNotifications: false,
    updated: false,
    isSendingEmail: false,
    emailSent: false,
    updatingPassword: false,
    updatedPassword: false,
    exiting: false,
    error: false
}

 const randomizeSortFilter = () => {
    const seeds = [ 'u_id', 'name', 'id', 'u_name', 'email', 'bio']
    const seed = seeds[Math.floor(Math.random() * seeds.length)]

    return seed
  }

  export const signIn = createAsyncThunk('app/signIn', async (userInput) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userInput.email,
            password: userInput.password
        });

        if (error) {
            console.error('Sign-in error:', error);
            showErrorToast("Password or email incorrect");
            return null;
        }

        showSuccessToast("Successful Login");
        window.location.replace("#");
        return data;
    } catch (err) {
        console.error('signIn failed:', err);
        showErrorToast("Unexpected login error");
        return null;
    }
});

export const register = createAsyncThunk('app/register', async (userInput) => {
    try {
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('u_name')
            .eq('u_name', userInput.u_name);

        if (checkError) {
            console.error('Username check error:', checkError);
            return null;
        }

        if (existingUser.length > 0) {
            showErrorToast(`${userInput.u_name} has been taken. Please select a username unique to you.`);
            return null;
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: userInput.email,
            password: userInput.password
        });

        if (signUpError) {
            console.error('Sign-up error:', signUpError);
            showErrorToast("Email or password already used by another user!");
            return null;
        }

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([{
                name: userInput.name,
                u_name: userInput.u_name,
                email: userInput.email,
                gender: userInput.gender,
                dob: userInput.dob,
                u_img: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${userInput.u_name}+backgroundType`,
                u_id: authData.user.id
            }])
            .select();

        if (profileError) {
            console.error('Profile creation error:', profileError);
            showErrorToast("Could not create profile. Try again later.");
            return null;
        }

        showSuccessToast("Registered Successfully");
        window.location.replace("#");

        return profileData?.[0];

    } catch (err) {
        console.error('register thunk failed:', err);
        showErrorToast("Unexpected registration error");
        return null;
    }
});


export const getUser = createAsyncThunk('app/getUser', async () => {
    try {
        const { data } = await supabase.auth.getUser();

        if (data?.user) {
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select()
                .eq('u_id', data.user.id);

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return profileData?.[0] || null;
        }

        return null;
    } catch (err) {
        console.error('getUser failed:', err);
        return null;
    }
});

export const getUsers = createAsyncThunk('app/getUsers', async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('u_id, u_name')
        .order(randomizeSortFilter(), { ascending: false });
      if (error) {
        console.error('Error fetching users:', error);
        return 'error';
      }
      return data || [];
    } catch (error) {
        console.error('getUsers failed:', error);
        return 'error';
    }
})


export const getProfile = createAsyncThunk('app/getProfile', async (profileId) => {
  try {
    if(profileId) {
      const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('u_id', profileId);

      if (error) {
          console.error('Error fetching profile:', error);
          return 'error';
      }

      return data?.[0] || null;
    }

  } catch (err) {
      console.error('getProfile failed:', err);
      return 'error';
  }
});


export const getOtherUsers = createAsyncThunk('app/getOtherUsers', async (uid) => {
    try {
        if (!uid) {
            console.error('Missing uid prop');
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('u_name, u_id, name, u_img')
            .neq('u_name', 'Pussey')
            .neq('u_id', uid.currentId)
            .neq('u_id', uid.loggedId)
            .order(randomizeSortFilter(), { ascending: false });

        if (error) {
            console.error('Error fetching other users:', error);
            return null;
        }

        return data || [];
    } catch (err) {
        console.error('getOtherUsers failed:', err);
        return null;
    }
});


export const getNotifications = createAsyncThunk('app/getNotifications', async (uid) => {
  try {
      if (!uid) return null;

      const { data, error } = await supabase
          .from('notifications')
          .select()
          .eq('receiver_id', uid.uid)
          .neq('creator_id', uid.uid);

      if (error) {
          console.error('Error fetching notifications:', error);
          return error;
      }

      return data || [];
  } catch (err) {
      console.error('getNotifications failed:', err);
      return 'error';
  }
});


export const resetPassword = createAsyncThunk('app/resetPassword', async (email) => {
    try {
        if (!email) return null;

        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.href.replace('reset', 'update')}`,
        });

        console.log("Recovery email sent");
        return 'sent';
    } catch (error) {
        console.error('resetPassword failed:', error);
        showErrorToast("Unable to send recovery email.");
        return 'error';
    }
});

export const updatePassword = createAsyncThunk('app/updatePassword', async (props) => {
    try {
        if (!props.password) return null;

        const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: props.refresh_token
        });

        if (refreshError || !sessionData) {
            console.error('Session refresh error:', refreshError);
            showErrorToast("Unable to refresh session");
            return 'error';
        }

        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            password: props.password
        });

        if (updateError) {
            console.error('Password update error:', updateError);
            showErrorToast("Failed to update password");
            return updateError;
        }

        if (updateData) {
            console.log('Password updated:', updateData);
            showSuccessToast("Password updated successfully");
            location.reload(true);
            return updateData;
        }
    } catch (err) {
        console.error('updatePassword thunk failed:', err);
        showErrorToast("Unexpected error updating password");
        return 'error';
    }
});


export const logOut = createAsyncThunk('app/logOut', async () => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return error;
        }

        window.location.replace('/#/login');
        return 'logged_out';
    } catch (err) {
        console.error('logOut thunk failed:', err);
        return 'error';
    }
});


export const searchedUserQuery = createAsyncThunk('app/searchedUserQuery', async (params) => {
  try {
      const sanitizeParams = (param) => {
          return param.id.startsWith('@') ? param.id.slice(1) : param.id;
      };

      const query = sanitizeParams(params);

      const { data, error } = await supabase
          .from('profiles')
          .select()
          .or(`name.ilike.%${query}%,u_name.ilike.%${query}%`)
          .order('name', { ascending: false });

      if (error) {
          console.error('Search query error:', error);
          return error;
      }

      return data || [];
  } catch (err) {
      console.error('searchedUserQuery thunk failed:', err);
      return 'error';
  }
});


export const profileEdit = createAsyncThunk('app/profileEdit', async (props) => {
  try {
      const { data, error } = await supabase
          .from('profiles')
          .update({
              name: props.name,
              bio: props.bio,
              dob: new Date(Date.parse(props.dob)),
              dob_privacy: props.dob_privacy,
              u_img: props.u_img
          })
          .eq('u_id', props.u_id)
          .select();

      if (error) {
          console.error('Profile update error:', error);
          showErrorToast("Could not update bio. Try again later.");
          return null;
      }

      // Cascade updates to other tables
      await supabase
          .from('posts')
          .update({ u_name: props.name, u_img: props.u_img })
          .eq('u_id', props.u_id);

      await supabase
          .from('comments')
          .update({ name: props.name, u_img: props.u_img })
          .eq('u_id', props.u_id);

      await supabase
          .from('messages')
          .update({ sender_name: props.name, sender_img: props.u_img })
          .or(`sender_id.eq.${props.u_id}`);

      await supabase
          .from('notifications')
          .update({ creator_name: props.name, creator_img: props.u_img })
          .eq('creator_id', props.u_id);

      showSuccessToast("Bio Updated Successfully!");
      location.reload(true);

      return data?.[0];
  } catch (err) {
      console.error('profileEdit failed:', err);
      showErrorToast("Unexpected error occurred during profile update.");
      return null;
  }
});

const appSlice = createSlice({
    name: 'app',
    initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loggedUser = action.payload,
        state.isLoading = false
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message
        state.loggedUser = null,
        state.isLoading = false
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loggedUser = action.payload,
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message
        state.loggedUser = null,
        state.isLoading = false
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loggedUser = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error;
        state.loggedUser = null;
        state.isLoading = false;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.error = action.error;
        state.allUsers = null;
        state.isLoading = false;
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.profileUser = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileUser = action.payload
        state.isLoadingProfile = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.error;
        state.profileUser = null
        state.isLoadingProfile = false;
      })
      .addCase(profileEdit.pending, (state) => {
        state.isLoadingProfile = true;
        state.isUpdatingProfile = true;
        state.updated = true;
        state.profileUser = null;
      })
      .addCase(profileEdit.fulfilled, (state, action) => {
        state.profileUser = action.payload;
        state.isLoadingProfile = false;
        state.isUpdatingProfile = false;
        state.updated = false;
      })
      .addCase(profileEdit.rejected, (state, action) => {
        state.error = action.error;
        state.profileUser = null;
        state.isLoadingProfile = false;
        state.isUpdatingProfile = false;
        state.updated = false;
      })
      .addCase(getOtherUsers.pending, (state) => {
        state.isLoadingOtherUsers = true;
        state.otherUsers = null;
      })
      .addCase(getOtherUsers.fulfilled, (state, action) => {
        state.otherUsers = action.payload;
        state.isLoadingOtherUsers = false;
      })
      .addCase(getOtherUsers.rejected, (state, action) => {
        state.error = action.error;
        state.otherUsers = null;
        state.isLoadingOtherUsers = false;
      })
      .addCase(getNotifications.pending, (state) => {
        state.notifications = null;
        state.isLoadingNotifications = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.isLoadingNotifications = false;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.error = action.error;
        state.notifications = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isSendingEmail = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.emailSent = true,
        state.isSendingEmail = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message
        state.isSendingEmail = false
      })
      .addCase(updatePassword.pending, (state) => {
        state.updatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.updatedPassword = true,
        state.updatingPassword = false
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.error.message
        state.updatingPassword = false
      })
      .addCase(searchedUserQuery.pending, (state) => {
        state.isLoading = true;
        state.searchedUsers = null;
      })
      .addCase(searchedUserQuery.fulfilled, (state, action) => {
        state.searchedUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(searchedUserQuery.rejected, (state, action) => {
        state.error = action.error;
        state.searchedUsers = null;
        state.isLoading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
        state.exiting = true
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loggedUser = null;
        state.profileUser = null
        state.loggedUser = null
        state.otherUsers = null
        state.searchedUsers = []
        state.notifications = []
        state.isLoading = false;
        state.exiting = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = "Logging out", action.error.message;
        state.isLoading = false;
        state.exiting = false;
      })
  }
})

export default appSlice.reducer