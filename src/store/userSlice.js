import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = "https://api.github.com";

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (login, { getState }) => {
    const state = getState();
    if (state.user.cache[login]?.details) {
      return state.user.cache[login].details;
    }
    const response = await axios.get(`/users/${login}`);
    return { login, data: response.data };
  }
);

export const fetchUserRepos = createAsyncThunk(
  "user/fetchUserRepos",
  async (login, { getState }) => {
    const state = getState();
    if (state.user.cache[login]?.repos) {
      return state.user.cache[login].repos;
    }
    const response = await axios.get(`/users/${login}/repos`);
    return { login, repos: response.data };
  }
);

export const fetchRepoDetails = createAsyncThunk(
  "user/fetchRepoDetails",
  async ({ login, repoName }, { getState }) => {
    const state = getState();

    const cachedRepo = state.user.cache[login]?.repos.find(
      (repo) => repo.name === repoName
    );
    if (cachedRepo?.details) {
      return { login, repoName, details: cachedRepo.details };
    }

    const response = await axios.get(`/repos/${login}/${repoName}`);
    return { login, repoName, details: response.data };
  }
);

export const fetchUserFollowers = createAsyncThunk(
  "user/fetchUserFollowers",
  async (login, { getState }) => {
    const state = getState();
    if (state.user.cache[login]?.followers) {
      return state.user.cache[login].followers;
    }
    const response = await axios.get(`/users/${login}/followers`);
    return { login, followers: response.data };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    cache: {},
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserDetails
    builder.addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      const { login, data } = action.payload;
      state.cache[login] = {
        ...(state.cache[login] || {}),
        details: data,
      };
      state.currentUser = login;
      state.loading = false;
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handle fetchUserRepos
    builder.addCase(fetchUserRepos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserRepos.fulfilled, (state, action) => {
      const { login, repos } = action.payload;
      state.cache[login] = {
        ...(state.cache[login] || {}),
        repos,
      };
      state.loading = false;
    });
    builder.addCase(fetchUserRepos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //details of a repo
    builder.addCase(fetchRepoDetails.fulfilled, (state, action) => {
      const { login, repoName, details } = action.payload;

      const repos = state.cache[login]?.repos || [];
      state.cache[login] = {
        ...(state.cache[login] || {}),
        repos: repos.map((repo) =>
          repo.name === repoName ? { ...repo, details } : repo
        ),
      };
    });

    // Handle fetchUserFollowers
    builder.addCase(fetchUserFollowers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserFollowers.fulfilled, (state, action) => {
      const { login, followers } = action.payload;
      state.cache[login] = {
        ...(state.cache[login] || {}),
        followers,
      };
      state.loading = false;
    });
    builder.addCase(fetchUserFollowers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
