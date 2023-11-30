/// <reference types="vite/client" />
import Basics from "@refina/basic-components";
import { app, d } from "refina";
import logo from "../assets/github-mark-white.svg";

function login() {
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
    $app.update();
  }, 1000);
}

const username = d("");
const password = d("");

let loading = false,
  msgType = "",
  msg = "";

const $app = app.use(Basics)(_ => {
  if (_.$updateState) {
    _.$root
      .addCls(`font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    m-auto bg-[#0d1117] text-[#e6edf3] text-sm h-[100vh]`);
  }
  _.$cls`pb-6 pt-8 w-full text-center`;
  _.div(_ => {
    _.$cls`inline-block fill-current align-bottom w-12 h-[47px]`;
    _.img(logo, "logo");
  });
  _.$cls`w-[340px] m-auto px-4 pt-1`;
  _.div(_ => {
    _.$cls`mb-4 text-center text-2xl font-light p-0 tracking-tight` &&
      _.h1("Sign in to GitHub");
    if (msgType.length > 0) {
      _.$cls`p-4 m-auto mb-2 border rounded-[6px] ${
        {
          error: "border-[rgb(248,81,73,0.4)] bg-[rgb(248,81,73,0.1)]",
          success: "border-[rgb(46,160,67,0.4)] bg-[rgb(46,160,67,0.15)]",
        }[msgType]
      }`;
      _.div(_ => {
        _.$cls`px-2`;
        _.div(_ => {
          _.$css`font-size: x-large; transform: translate(25px, -10px);`;
          _.$cls`h-10 mr-3 float-right ${
            {
              error: "text-[#f85149]",
              success: "text-[#3fb950]",
            }[msgType]
          }`;
          if (_.button("×")) {
            msgType = "";
          }
          _.t(msg);
        });
      });
    }
    _.$cls`border border-[#21262d] rounded-md bg-[#161b22] p-4 mt-3`;
    _.div(_ => {
      _.$cls`block mb-2` && _._label({}, "Username or email address");
      _.$cls`mt-1 mb-4 block w-full px-3 py-[5px] bg-[#0d1117] outline-none rounded-[6px]
        border-2 border-[#21262d] focus-visible:border-2 focus-visible:border-[#aac6ec]`;
      _.textInput(username);
      _.$cls`relative`;
      _.div(_ => {
        _.$cls`block mb-2` && _._label({}, "Password");
        _.$cls`mt-1 mb-4 block w-full px-3 py-[5px] bg-[#0d1117] outline-none rounded-[6px]
          border-2 border-[#21262d] focus-visible:border-2 focus-visible:border-[#2f81f7]`;
        _.passwordInput(password);
        _.$cls`mt-4 block w-full text-center bg-[#238636] px-4 py-[5px] rounded-[6px] font-[500] text-white
          disabled:bg-[#23863699] disabled:text-[#ffffff80] disabled:border-[#f0f6fc1a]`;
        if (_.button(loading ? "Signing in…" : "Sign in", loading)) {
          _.$ev.preventDefault();
          login();
        }
        _.$cls`float-right text-xs absolute top-0 right-0 text-[#2f81f7]`;
        _.a("/password_reset", "Forgot password?");
      });
    });
    _.$cls`p-4 text-center border border-[#30363d] rounded-[6px] mt-4 mb-[10px] `;
    _.p(_ => {
      _.t`New to GitHub? `;
      _.$cls`text-[#2f81f7]` &&
        _.a("https://github.com/signup?source=login", "Create an account");
      _.t`.`;
    });
  });
  _.$cls`py-10 mt-10 f6 text-xs`;
  _.div(_ => {
    _.$cls`flex justify-center`;
    _._ul({}, _ => {
      _.$cls`mr-4` &&
        _._li(
          {},
          _ =>
            _.$cls`text-[#2f81f7]` &&
            _.a("https://github.com/site/terms", "Terms"),
        );
      _.$cls`mr-4` &&
        _._li(
          {},
          _ =>
            _.$cls`text-[#2f81f7]` &&
            _.a("https://github.com/site/privacy", "Privacy"),
        );
      _.$cls`mr-4` &&
        _._li(
          {},
          _ =>
            _.$cls`text-[#2f81f7]` && _.a("https://docs.github.com/", "Docs"),
        );
      _._li(
        {},
        _ =>
          _.$cls`text-[#7d8590]` &&
          _.a("https://github.com/contact", "Contact GitHub Support"),
      );
    });
  });
});
