import React from "react";
import { Route, Switch } from "react-router-dom";

import List from "./list";
import View from "./view";

export default function Index() {
  return (
    <Switch>
      <Route path="/user/:id" component={View} />
      <Route path="/user" component={List} />
    </Switch>
  );
}
