import type { MetabaseAuthConfig } from "embedding-sdk-bundle/types/auth-config";
import type { MetabaseEmbeddingSessionToken } from "metabase/embedding-sdk/types/refresh-token";
import { createAsyncThunk } from "metabase/lib/redux";
import { PLUGIN_EMBEDDING_SDK_AUTH } from "metabase/plugins";

export const initAuth = createAsyncThunk(
  "sdk/token/INIT_AUTH",
  async (
    {
      metabaseInstanceUrl,
      preferredAuthMethod,
      apiKey,
      isLocalHost,
    }: MetabaseAuthConfig & { isLocalHost?: boolean },
    { dispatch },
  ) => {
    return await PLUGIN_EMBEDDING_SDK_AUTH.initAuth(
      {
        metabaseInstanceUrl,
        preferredAuthMethod,
        apiKey,
        isLocalHost,
      },
      { dispatch },
    );
  },
);

export const refreshTokenAsync = createAsyncThunk(
  "sdk/token/REFRESH_TOKEN",
  async (
    {
      metabaseInstanceUrl,
      preferredAuthMethod,
    }: Pick<MetabaseAuthConfig, "metabaseInstanceUrl" | "preferredAuthMethod">,
    { getState },
  ): Promise<MetabaseEmbeddingSessionToken | null> => {
    return await PLUGIN_EMBEDDING_SDK_AUTH.refreshTokenAsync(
      {
        metabaseInstanceUrl,
        preferredAuthMethod,
      },
      { getState },
    );
  },
);
