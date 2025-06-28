import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabaseClient.config";
import { Flip, toast } from "react-toastify";

const initialState = {
    profileUser: null,
    loggedUser: null,
    otherUsers: null,
    searchedUsers: [],
    notifications: [],
    isLoading: true,
    isLoadingOtherUsers: false,
    isLoadingProfile: true,
    isUpdatingProfile: false,
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

export const signIn = createAsyncThunk('app/signIn', async (userInput) =>{

    const {data, error} = await supabase.auth.signInWithPassword({
        email: userInput.email,
        password: userInput.password
    })

    if(error) {
        toast.error("Password or email incorrect", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
        console.log(error)
        return null
    }

    if(data) {
      toast.success("Successful Login", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})

      window.location.replace("#");
      return data
    }
})

export const register = createAsyncThunk('app/register', async (userInput) =>{

  // check if username is already registered 
  const {data, error} = await supabase
  .from('profiles')
  .select('u_name')
  .eq('u_name', userInput.u_name) 

    if(error) {
        console.log(error)
        return null
    }

    if(data.length < 1) {
      const { data, error } = await supabase.auth.signUp({
        email: userInput.email,
        password: userInput.password
      })

      if(error) {
          toast.error("Email password already used by another user!", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          console.log(error)
          return null
      }

      if(data) {
          const { data:profileData, error:profileError } = await supabase
          .from('profiles')
          .insert([{ 
            name: userInput.name,
            u_name: userInput.u_name,
            email: userInput.email,
            gender: userInput.gender,
            dob: userInput.dob,
            u_img: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${userInput.u_name}+backgroundType`,
            u_id: data.user.id
          }]).select()

          if(profileError) {
              toast.error(profileError, {className: "text-sm  font-semibold", autoClose: 4000, position: 'top-right', closeOnClick: true})
              console.log(profileError)

              return null
          }

          if(profileData) {
              toast.success("Registered Successfully", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true});

              window.location.replace("#");
              return profileData[0]
          }
    }

    } else {
      toast.error("Please select a username unique to you.", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true})
    }

})

export const getUser = createAsyncThunk('app/getUser', async()=> {
    const { data } = await supabase.auth.getUser()

   if(data.user !== null) {
      const { data:profileData, error } = await supabase
      .from('profiles')
      .select()
      .eq("u_id", data.user.id)

      if(error) {
          console.log(error)
          return null
      }
      
      if(profileData) {
          return profileData[0]
      }
    } else {
      return data.user
    }
})

export const getProfile = createAsyncThunk('app/getProfile', async (profileId) => {
  const {data, error} = await supabase.from('profiles')
  .select()
  .eq("u_id", profileId)

  if(error) {
    return "error"
  }

  if(data) {
    return data[0]
  }
})

export const getOtherUsers = createAsyncThunk('app/getOtherUsers', async (uid) => {
  if(uid !== null) {
    const {data, error} = await supabase.from('profiles')
    .select()
    .neq("u_name", "Pussey")
    .or(`u_id.neq.${uid.currentId}, u_id.neq.${uid.loggedId}`)
    // .neq("u_id", uid.currentId)
    // .neq("u_id", uid.loggedId)
    .order(randomizeSortFilter(), {ascending: false})
    // .limit(4)

    if(error) {
      return
    }

    if(data) {
      return data
    }
  } else {
    console.log("Error with uid prop")
  }
})

export const getNotifications = createAsyncThunk('app/getNotifications', async (uid) => {
  if(uid !== null) {
    const {data, error} = await supabase.from('notifications')
    .select()
    .eq('receiver_id', uid.uid)
    .neq('creator_id', uid.uid)
    // .eq('viewed', false)


    if(error) return error

    if(data) return data
  }    
})

export const resetPassword = createAsyncThunk('app/resetPassword', async (email) => {
  if(email !== '' || email !== null) {
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.href.replace('reset', 'update')}`,
        // redirectTo: 'http://localhost:5173/#/account/update-password',
      })
      console.log("Recovery email sent")
    } catch (error) {
      console.log(error)

      toast.error(error, {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
    }

  }
})

export const updatePassword = createAsyncThunk('app/updatePassword', async (props) => {
  if(props.password !== '' || props.password !== null) {
    try {
      console.log(props.password)
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: props.refresh_token })

      if(data !== null) {
        const {data: updateData, error} = await supabase.auth.updateUser({ password: props.password })
        if (updateData){
          console.log(updateData)
          console.log("success")

          toast.success("Password updated successfully", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})

          location.reload(true);
        }

        if (error) console.log(error)
      }

      if(error) {
        console.log(error)
        return error
      }

    } catch (error) {
      console.log(error)

      toast.error(error, {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
    }

  }
})

export const logOut = createAsyncThunk('app/logOut', async()=> {
  const {error} = await supabase.auth.signOut()

  if(error) throw error

  window.location.replace("/#/");
})

export const searchedUserQuery = createAsyncThunk('app/searchedUserQuery', async (params) => {

  const sanitizeParams = (param) => {
    const getFirstChar = param.id.slice(0, 1)
    if(getFirstChar == "@") {
      return param.id.slice(1)
    }

    return param.id
  }

    const { data,error } = await supabase
    .from('profiles')
    .select()
    .or(`name.ilike.%${sanitizeParams(params)}%,u_name.ilike.%${sanitizeParams(params)}%`)
    .order('name', {ascending: false})

    if(error) {
      console.log(error)
      return error
    }

    if(data ) {
      return data
    }

})

export const profileEdit = createAsyncThunk('app/profileEdit', async (props) => {

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
      .select()

      if(data) {
        const { error: response } = await supabase
        .from('posts')
        .update({ u_name: props.name, u_img: props.u_img})
        .eq('u_id', props.u_id)

        if(response === null) {
          // update comments table 
          await supabase
          .from('comments')
          .update({ name: props.name, u_img: props.u_img})
          .eq('u_id', props.u_id)


          // update messages table 
          await supabase
          .from('messages')
          .update({ sender_name: props.name, sender_img: props.u_img})
          // .or(`sender_id.eq.${loggedUser?.u_id}, receiver_id.eq.${loggedUser?.u_id}`)
          .or(`sender_id.eq.${props.u_id}`)

          // update notifications table 
          await supabase
          .from('notifications')
          .update({ creator_name: props.name, creator_img: props.u_img})
          .eq('creator_id', props.u_id)
          toast.success("Bio Updated Successfully!", {className: "bg-success text-white bg-success text-xs", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          location.reload(true);
        }

        // console.log("Data Output", data[0])
        return data[0]
      } 
      
      if(error) {
        console.log(error)
        toast.error("Could not Update bio. Try again later", {className: "bg-error text-white text-xs", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
      }
})

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
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
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