interface StoreCredential {
  id: number;
  password: string;
}

interface RevocationResponse {
  successful: boolean;
  error: string;
}

interface IdConfiguration {
  /**
   * Your application's client ID
   */
  client_id: string;
  /**
   * Enables automatic selection.
   * @default false
   */
  auto_select?: boolean;
  /**
   * The JavaScript function that handles ID tokens. Google One Tap and the Sign In With Google button popup UX mode use this attribute.
   * @required if Google One Tap or the Sign In With Google button popup UX mode is used
   */
  callback?: (credentialResponse: CredentialResponse) => void;
  /**
   * The URL of your login endpoint. The Sign In With Google button redirect UX mode uses this attribute. Only used when ux_mode: "redirect" is set.
   */
  login_uri?: string;
  /**
   * The JavaScript function that handles password credentials.
   */
  native_callback?: (credential: Credential) => void;
  /**
   * Cancels the prompt if the user clicks outside the prompt.
   * @default true
   */
  cancel_on_tap_outside?: boolean;
  /**
   * The DOM ID of the One Tap prompt container element
   */
  prompt_parent_id?: string;
  /**
   * This field is a random string used by the ID token to prevent replay attacks
   */
  nonce?: string;
  /**
   * The title and words in the One Tap prompt
   */
  context?: 'signin' | 'signup' | 'use';
  /**
   * If you need to call One Tap in the parent domain and its subdomains, pass the parent domain to this field so that a single shared cookie is used.
   */
  state_cookie_domain?: string;
  /**
   * The Sign In With Google button UX flow
   * @default "popup"
   */
  ux_mode?: 'popup' | 'redirect';
  /**
   * The origins that are allowed to embed the intermediate iframe. One Tap will run in the intermediate iframe mode if this field presents.
   */
  allowed_parent_origin?: string | string[];
  /**
   * Overrides the default intermediate iframe behavior when users manually close One Tap.
   */
  intermediate_iframe_close_callback?: Function;
  /**
   * Determines if the upgraded One Tap UX should be enabled on browsers that support Intelligent Tracking Prevention (ITP).
   * @default false
   */
  itp_support?: boolean;
}

interface CredentialResponse {
  /**
   * This field is the returned ID token.
   */
  credential: string;
  /**
   * This field sets how the credential is selected.
   */
  select_by:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
}

interface GsiButtonConfiguration {
  /**
   * The button type
   * @default "standard"
   */
  type: 'standard' | 'icon';
  /**
   * The button theme
   * @default "outline"
   */
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  /**
   * The button size
   * @default "large"
   */
  size?: 'large' | 'medium' | 'small';
  /**
   * The button text
   * @default "signin_with"
   */
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  /**
   * The button shape
   * @default "rectangular"
   */
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  /**
   * The alignment of the Google logo
   * @default "left"
   */
  logo_alignment?: 'left' | 'center';
  /**
   * The minimum button width, in pixels. The maximum width is 400 pixels.
   */
  width?: string;
  /**
   * The pre-set locale of the button text. If it's not set, the browser's default locale or the Google session user’s preference is used
   * @example "en-US"
   */
  locale?: string;
  /**
   * JavaScript function to be called when the Sign in with Google button is clicked
   */
  click_listener?: () => void;
}

interface PromptNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface Window {
  /**
   * This callback is just a shortcut for the window.onload callback. There are no differences in behavior.
   * @example
   * window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        ...
      });
    };
  */
  onGoogleLibraryLoad: () => void;
  google?: {
    accounts: {
      id: {
        initialize: (config: IdConfiguration) => void;
        prompt: (notification: PromptNotification) => void;
        renderButton: (
          parent: HTMLElement,
          options: GsiButtonConfiguration
        ) => void;
        /**
         * When the user signs out of your website, you need to call the method google.accounts.id.disableAutoSelect to record the status in cookies. This prevents a UX dead loop
         */
        disableAutoSelect: () => void;
        /**
         * This method is a simple wrapper for the store() method of the browser's native credential manager API
         */
        storeCredential: (
          credential: StoreCredential,
          callback: () => void
        ) => void;
        cancel: () => void;
        /**
         * Revokes the OAuth grant used to share the ID token for the specified user
         */
        revoke: (
          hint: string,
          callback: (response: RevocationResponse) => void
        ) => void;
      };
    };
  };
}
