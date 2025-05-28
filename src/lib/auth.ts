// Authentication utilities for Google login

/**
 * Initialize Google OAuth client
 */
export function initGoogleAuth() {
  return new Promise<void>((resolve) => {
    // Load the Google API client library
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Handle Google sign-in
 * @returns User information from Google
 */
export async function signInWithGoogle(): Promise<{
  success: boolean;
  user?: {
    email: string;
    name: string;
    picture?: string;
    token?: string;
  };
  error?: string;
}> {
  try {
    // Initialize Google client
    await initGoogleAuth();

    return new Promise((resolve) => {
      // @ts-ignore - Google client is loaded dynamically
      window.google.accounts.id.initialize({
        client_id:
          "348859740860-bckqbgtpc6mceqe049q0joqu65a4e6g6.apps.googleusercontent.com",
        callback: async (response: any) => {
          if (response && response.credential) {
            // Decode the JWT token to get user info
            const base64Url = response.credential.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map(
                  (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                )
                .join(""),
            );

            const { email, name, picture } = JSON.parse(jsonPayload);

            resolve({
              success: true,
              user: {
                email,
                name,
                picture,
                token: response.credential,
              },
            });
          } else {
            resolve({
              success: false,
              error: "Google authentication failed",
            });
          }
        },
        auto_select: false,
      });

      // Render the button
      // @ts-ignore - Google client is loaded dynamically
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          resolve({
            success: false,
            error: "Google sign-in prompt could not be displayed",
          });
        }
      });
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during Google sign-in",
    };
  }
}

/**
 * Sign out from Google
 */
export function signOutFromGoogle() {
  try {
    // @ts-ignore - Google client is loaded dynamically
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // @ts-ignore - Google client is loaded dynamically
      window.google.accounts.id.disableAutoSelect();
    }
  } catch (error) {
    console.error("Error signing out from Google:", error);
  }
}
