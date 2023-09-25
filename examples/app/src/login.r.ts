import { formData } from "@refina/fluentui";
import { view } from "refina";
import { userId } from "./store";

const form = formData({
  password: "",
  userId: NaN,
});

export default view((_) => {
  if (
    _.rCard(
      `Login to ZVMS`,
      () => {
        _.rForm(form, (_) => {
          _.rNumberInput("userId", undefined, (v) => v > 0 || "Must be positive");
          _.rPassword("password", undefined);
        });
      },
      ["Login"],
    )
  ) {
    if (!form.$form.checkValid()) return;
    if (confirm(form.$json)) {
      userId.value = form.$data.userId;
      _.$router.goto(`/user/${userId}`);
    } else {
      form.$data.password = "";
      form.$password.tempInvalid = "Password is wrong!";
    }
  }
});
