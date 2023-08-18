import { d, view } from "./lib";
import blackLogo from "../assets/github-mark-black.svg";
import whiteLogo from "../assets/github-mark-white.svg";
const username = d("");
const password = d("");
let loading = false,
  msgType = "",
  msg = "";
view((_) => {
  _.$cls`session-authentication`;
  _.div(() => {
    _.$cls`pb-4 pt-5 width-full text-center`;
    _.div(() => {
      _.$css`width: 48px !important; height: 48px !important;`;
      _.$cls`octicon octicon-mark-github`;
      _.img(
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? blackLogo
          : whiteLogo,
        "logo",
      );
    });
    _.$cls`auth-form px-3`;
    _.div(() => {
      _.$cls`auth-form-header p-0`;
      _.div(() => _.h1("Sign in to GitHub"));
      if (msgType.length > 0) {
        _.$cls`flash flash-${msgType} flash-full`;
        _.div(
          () =>
            _.$cls`px-2` &&
            _.div(() => {
              _.$css`font-size: x-large; transform: translate(25px, -8px);`;
              _.$cls`flash-close octicon octicon-x`;
              if (_.button("×")) {
                msgType = "";
              }
              _._t(msg);
            }),
        );
      }
      _.$cls`auth-form-body mt-3`;
      _.div(() => {
        _.$cls`mb-2`;
        _._label({}, "Username or email address");
        _.$cls`form-control input-block`;
        _.textInput(username);
        _.$cls`position-relative`;
        _.div(() => {
          _._label({}, "Password");
          _.$cls`form-control input-block`;
          _.passwordInput(password);
          _.$cls`btn btn-block btn-primary`;
          if (_.button(loading ? "Signing in…" : "Sign in", loading)) {
            _.$preventDefault();
            loading = true;
            setTimeout(() => {
              if (username.value === "admin" && password.value === "admin") {
                msgType = "success";
                msg = "Logined successfully.";
              } else {
                msgType = "error";
                msg = "Incorrect username or password.";
              }
              loading = false;
              _.$refresh();
            }, 1000);
          }
          _.$cls`label-link position-absolute top-0 right-0`;
          _.a("Forgot password?", "/password_reset");
        });
      });
      _.$cls`login-callout mt-3`;
      _.p(() => {
        _._t("New to GitHub? ");
        _.a("Create an account", "/signup?source=login");
        _._t(".");
      });
    });
    _.$cls`footer container-lg p-responsive py-6 mt-6 f6`;
    _.div(() => {
      _.$cls`list-style-none d-flex flex-justify-center`;
      _._ul({}, () => {
        _.$cls`mr-3`;
        _._li({}, () => _.a("Terms", "/site/terms"));
        _.$cls`mr-3`;
        _._li({}, () => _.a("Privacy", "/site/privacy"));
        _.$cls`mr-3`;
        _._li({}, () => _.a("Docs", "https://docs.github.com/"));
        _._li({}, () => {
          _.$cls("Link--secondary");
          _.a("Contact GitHub Support", "/contact");
        });
      });
    });
  });
});
/**
 *<body class="" style="word-wrap: break-word;">
    <div data-turbo-body="" class="logged-out session-authentication" style="word-wrap: break-word;">
      


    <div class="position-relative">
      <a href="#start-of-content" class="px-2 py-4 color-bg-accent-emphasis color-fg-on-emphasis show-on-focus js-skip-to-content">Skip to content</a>
      <span data-view-component="true" class="progress-pjax-loader Progress position-fixed width-full">
    <span style="width: 0%;" data-view-component="true" class="Progress-item progress-pjax-loader-bar left-0 top-0 color-bg-accent-emphasis"></span>
</span>      
      


      

        <div class="header header-logged-out width-full pt-5 pb-4" role="banner">
  <div class="container clearfix width-full text-center">
    <a class="header-logo" href="https://github.com/" aria-label="Homepage" data-ga-click="(Logged out) Header, go to homepage, icon:logo-wordmark">
      <svg height="48" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="48" data-view-component="true" class="octicon octicon-mark-github">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
</svg>
    </a>
  </div>
</div>


      <div hidden="hidden" data-view-component="true" class="js-stale-session-flash flash flash-warn mb-3">
  
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
    <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
        <span class="js-stale-session-flash-signed-in" hidden="">You signed in with another tab or window. <a class="Link--inTextBlock" href="">Reload</a> to refresh your session.</span>
        <span class="js-stale-session-flash-signed-out" hidden="">You signed out in another tab or window. <a class="Link--inTextBlock" href="">Reload</a> to refresh your session.</span>
        <span class="js-stale-session-flash-switched" hidden="">You switched accounts on another tab or window. <a class="Link--inTextBlock" href="">Reload</a> to refresh your session.</span>

    <button class="flash-close js-flash-close" type="button" aria-label="Close">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>
    </button>

  
</div>
    </div>

  <div id="start-of-content" class="show-on-focus"></div>









    
    <include-fragment class="js-notification-shelf-include-fragment" data-base-src="https://github.com/notifications/beta/shelf"></include-fragment>






  <div class="application-main " data-commit-hovercards-enabled="" data-discussion-hovercards-enabled="" data-issue-and-pr-hovercards-enabled="">
      <main>
        

  <div class="auth-form px-3" id="login">


      <input type="hidden" name="ga_id" class="js-octo-ga-id-input">
      <div class="auth-form-header p-0">
        <h1>Sign in to GitHub</h1>
      </div>


      <div id="js-flash-container" data-turbo-replace="">





  <template class="js-flash-template">
    
<div class="flash flash-full   {{ className }}">
  <div class="px-2">
    <button autofocus="" class="flash-close js-flash-close" type="button" aria-label="Dismiss this message">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>
    </button>
    <div aria-atomic="true" role="alert" class="js-flash-alert">
      
      <div>{{ message }}</div>

    </div>
  </div>
</div>
  </template>
</div>


      <div class="flash js-transform-notice" hidden="">
        <button class="flash-close js-flash-close" type="button" aria-label="Dismiss this message">
          <svg aria-label="Dismiss" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>
        </button>
      </div>

      <div class="auth-form-body mt-3">

        <!-- '"` --><!-- </textarea></xmp> --><form data-turbo="false" action="/session" accept-charset="UTF-8" method="post"><input type="hidden" data-csrf="true" name="authenticity_token" value="9WUQ2zpYb/ZWuUGVCc3uGTxNbndbtC+NybZOE9J0FlIp0qfpFA+iedVQ/i7AH10sdJaNngvA5p2468H6IeP21A==">  <label for="login_field">
    Username or email address
  </label>
  <input type="text" name="login" id="login_field" class="form-control input-block js-login-field" autocapitalize="off" autocorrect="off" autocomplete="username" autofocus="autofocus">

  <div class="position-relative">
    <label for="password">
      Password
    </label>
    <input type="password" name="password" id="password" class="form-control form-control input-block js-password-field" autocomplete="current-password">
    
<input type="hidden" name="webauthn-conditional" value="undefined">
<input type="hidden" class="js-support" name="javascript-support" value="true">
<input type="hidden" class="js-webauthn-support" name="webauthn-support" value="supported">
<input type="hidden" class="js-webauthn-iuvpaa-support" name="webauthn-iuvpaa-support" value="supported">
<input type="hidden" name="return_to" id="return_to" value="https://github.com/login" autocomplete="off" class="form-control">
<input type="hidden" name="allow_signup" id="allow_signup" autocomplete="off" class="form-control">
<input type="hidden" name="client_id" id="client_id" autocomplete="off" class="form-control">
<input type="hidden" name="integration" id="integration" autocomplete="off" class="form-control">
<input class="form-control" type="text" name="required_field_d13c" hidden="hidden">
<input class="form-control" type="hidden" name="timestamp" value="1692352837377">
<input class="form-control" type="hidden" name="timestamp_secret" value="76a00fcb0a21efba6fece732adce5b37b77515588aebe3763d75aebbd19988dd">


    <input type="submit" name="commit" value="Sign in" class="btn btn-primary btn-block js-sign-in-button" data-disable-with="Signing in…" data-signin-label="Sign in" data-sso-label="Sign in with your identity provider" development="false">

    <a class="label-link position-absolute top-0 right-0" id="forgot-password" tabindex="0" href="/password_reset">Forgot password?</a>
  </div>
</form>  


      </div>


          <p class="login-callout mt-3">
            New to GitHub?
              <a data-ga-click="Sign in, switch to sign up" data-hydro-click="{&quot;event_type&quot;:&quot;authentication.click&quot;,&quot;payload&quot;:{&quot;location_in_page&quot;:&quot;sign in switch to sign up&quot;,&quot;repository_id&quot;:null,&quot;auth_type&quot;:&quot;SIGN_UP&quot;,&quot;originating_url&quot;:&quot;https://github.com/login&quot;,&quot;user_id&quot;:null}}" data-hydro-click-hmac="72d062e79bb6ab076a3b88b32943286ea51894183bd812a5038d00013946f239" href="/signup?source=login">Create an account</a>.
          </p>

  </div>

      </main>
  </div>

          <div class="footer container-lg p-responsive py-6 mt-6 f6" role="contentinfo">
    <ul class="list-style-none d-flex flex-justify-center">
        <li class="mr-3"><a href="/site/terms" data-analytics-event="{&quot;category&quot;:&quot;Footer&quot;,&quot;action&quot;:&quot;go to terms&quot;,&quot;label&quot;:&quot;text:terms&quot;}">Terms</a></li>
        <li class="mr-3"><a href="/site/privacy" data-analytics-event="{&quot;category&quot;:&quot;Footer&quot;,&quot;action&quot;:&quot;go to privacy&quot;,&quot;label&quot;:&quot;text:privacy&quot;}">Privacy</a></li>
        <li class="mr-3"><a href="https://docs.github.com/" data-analytics-event="{&quot;category&quot;:&quot;Footer&quot;,&quot;action&quot;:&quot;go to docs&quot;,&quot;label&quot;:&quot;text:docs&quot;}">Docs</a></li>
          <li><a class="Link--secondary" data-ga-click="Footer, go to contact, text:contact" href="https://github.com/contact">Contact GitHub Support</a></li>
    </ul>
  </div>



  <div id="ajax-error-message" class="ajax-error-message flash flash-error" hidden="">
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-alert">
    <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
</svg>
    <button type="button" class="flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>
    </button>
    You can’t perform that action at this time.
  </div>

    <template id="site-details-dialog">
  <details class="details-reset details-overlay details-overlay-dark lh-default color-fg-default hx_rsm" open="">
    <summary role="button" aria-label="Close dialog"></summary>
    <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast hx_rsm-dialog hx_rsm-modal">
      <button class="Box-btn-octicon m-0 btn-octicon position-absolute right-0 top-0" type="button" aria-label="Close dialog" data-close-dialog="">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>
      </button>
      <div class="octocat-spinner my-6 js-details-dialog-spinner"></div>
    </details-dialog>
  </details>
</template>

    <div class="Popover js-hovercard-content position-absolute" style="display: none; outline: none;" tabindex="0">
  <div class="Popover-message Popover-message--bottom-left Popover-message--large Box color-shadow-large" style="width:360px;"></div>
</div>

    <template id="snippet-clipboard-copy-button">
  <div class="zeroclipboard-container position-absolute right-0 top-0">
    <clipboard-copy aria-label="Copy" class="ClipboardButton btn js-clipboard-copy m-2 p-0 tooltipped-no-delay" data-copy-feedback="Copied!" data-tooltip-direction="w">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon m-2">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none m-2">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
    </clipboard-copy>
  </div>
</template>
<template id="snippet-clipboard-copy-button-unpositioned">
  <div class="zeroclipboard-container">
    <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 tooltipped-no-delay d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
    </clipboard-copy>
  </div>
</template>




    </div>

    <div id="js-global-screen-reader-notice" class="sr-only" aria-live="polite"></div>
  


</body>
 */
// import { Context } from "./context";
// import { bySelf, view, d } from "./lib";
// let n = 4;
// let s = [1, 2, 3];
// let t = d("Hello world");
// function fc(_: Context) {
//   _.button("1");
//   _.button("2");
// }
// view((_) => {
//   _.ul(s, bySelf, (i) => {
//     if (_._cbButton({}, i)) {
//       if (_.$.onClick()) n += i;
//       if (_.$.onContextmenu() && _.$.$preventDefault()) n -= i;
//     }
//   });
//   fc(_);
//   _.h1(n);
//   if (_.toggleButton("TOGGLE1" + t)) {
//     _.$noPreserve() && _.textInput("input", t);
//   }
//   _.br();
//   if (_.toggleButton("TOGGLE2" + t)) {
//     _.textInput("input", t);
//   }
//   // fc(_);
// });

// // if ((() => false as const)()) {
// //   addEventListener;
// // }
// // if (_.checkbox("ON/OFF")) {
// //   _.p("ON");
// // }
// // _.br();
// // if (_.checkbox("ON/OFF")) {
// //   _.p("ON");
// // }
// // if (_.toggleButton("1")) {
// //   _.$clear(p);
// //   if (_.$ref(p)) {
// //     _.$;
// //     _._p({}, "MENU" + n);
// //   }
// //   if (_.button("!!!")) {
// //     _.$;
// //     _.$ref(p);
// //   }
// //   if (_.cbButton("!11")) {
// //     _.$ev;
// //     _.$;
// //     if (_.$.onClick()) {
// //       _.$toggle();
// //     }
// //     _.$ref(ref<{ a: 111 }>());
// //   }
// //   //&& _.$ &&
// // }
// // _.$cls`${on.value ? "bg-blue-500" : ""}`;
// // _._pre({}, `$${t}$`);
// // if (_.$ref(btn) && _.button("Toggle")) on.value = !on.value;
// // if (_.button("+")) n++;
// // _._t(n);
// // if (_.button("-")) n--;

// // if (_._cbButton({}, "LR click")) {
// //   if (_.$.onClick()) {
// //     n++;
// //   }
// //   if (_.$.onContextmenu()) {
// //     _.$.$ev.preventDefault();
// //     n = 0;
// //   }
// // }
// // _._p({}, n);
// // if (_._cbButton({}, "LR click2")) {
// //   if (_.$.onClick()) {
// //     console.log(_.$.$ev);
// //     n++;
// //   }
// //   if (_.$.onContextmenu()) {
// //     console.log(_.$.$ev);
// //     n = 0;
// //   }
// // }
// // if (_.toggleButton("1")) {
// //   if (_.toggleButton("2")) {
// //     if (_.toggleButton("3")) {
// //       if (_.toggleButton("4")) {
// //         if (_.toggleButton("5")) {
// //           _._p({}, "MENU");
// //         }
// //       }
// //     }
// //   }
// // }

// // if (_.button("ABC")) {
// //   n++;
// //   _.$ev;
// // }
// // _.$ev;
// //_._t("1111111")
// // _.textInput("Type here: ", t);
// // _.textInput("Type here2: ", t);
// // _.forRange(n, (i) => _._p({}, i));

// /*
//    if (_.textInput("Type here: ", t)) {
//     _._p({}, "Input is focused!");
//   }

// <script setup>
// import { ref } from 'vue';
// const on = ref(false);
// const t = ref("Hello world");
// const n = ref(0);
// </script>
// <template>
//   <h1 :style="on ? `background-color:blue` : ``">{{ t }}</h1>
//   <button @click="on = !on">Toggle</button>
//   <button @click="n++">+</button>
//   {{ n }}
//   <button @click="n--">-</button>
//   Type here: <input v-model="t">
//   <p v-for="i in n" :key="i">
//     {{ i }}
//   </p>
// </template>
//  */
