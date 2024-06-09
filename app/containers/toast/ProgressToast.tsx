import { Classes, Intent, Toaster, ProgressBar } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import classNames from "classnames";
import * as React from "react";
import "./ProgressToast.scss";

export function renderProgressToast(
  toaster: Toaster,
  amount: number,
  key?: string
): string {
  const classes = classNames("progress-toast", Classes.DARK);
  const initialKey = toaster.show(
    {
      className: classes,
      icon: IconNames.IMPORT,
      message: (
        <ProgressBar
          intent={amount < 1 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount}
          animate={amount < 1}
        />
      ),
      timeout: amount < 1 ? 0 : 2000,
    },
    key
  );
  return initialKey;
}
