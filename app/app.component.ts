import { Component } from "@angular/core";
// import { deepStrictEqual } from "power-assert";
import 'nativescript-angular-webview-crypto';
import './btoa-polyfill';
import './text-encoding-polyfill';

function deepStrictEqual(a, b) {
  console.log(a, b);
}



@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {

    public counter: number = 16;
    public steps: {label: string, startTime: number, endTime?: number}[] = [];


    public get message(): string {
      return this.steps
        .map(({label, startTime, endTime}) =>
          `${label}: ${endTime ? endTime - startTime : "..."}ms `
        )
        .join("\n");
      }

    private step(message: string) {
      this.done();
      this.steps.push({
        label: message,
        startTime: Date.now(),
      })
    }

    private lastStep() {
      if (this.steps.length === 0) {
        return null;
      }
      return this.steps[this.steps.length - 1];
    }

    private done() {
      const lastStep = this.lastStep();
      if (lastStep) {
        lastStep.endTime = Date.now();
      }
    }

    public onTap() {
      const PassitSDK = require("passit-sdk-js").default;
      const sdk = new PassitSDK();

      const Api = require("passit-sdk-js/js/api").default;
      // for genymotion this refers to localhost
      // http://stackoverflow.com/a/20257547/907060
      sdk.api = new Api("http://10.0.3.2:8000/api/")

      const email = `test${new Date().getTime()}@test.com`;
      const password = "password";

      const newSecret = {
        name: "name",
        secrets: {
          password: "password"
        },
        type: "website",
        visible_data: {
          username: "username"
        },
        group_id: null,
      }

      this.steps = [];
      this.step("Sign up")
      sdk.sign_up(email, password)

      .then(_ => this.step("Log in"))
      .then(_ => sdk.log_in(email, password))

      .then(_ => this.step("Create secret"))
      .then(_ => sdk.create_secret(newSecret))

      .then(dBSecret => {
        this.step("Decrypt secret");
        sdk.decrypt_secret(dBSecret);
      }).then(_ => this.done())
      .catch(e => console.log("FAILED!", e));


      // deepStrictEqual({
      //   name: newSecret.name,
      //   type: newSecret.type,
      //   visible_data: newSecret.visible_data,
      // }, {
      //   name: dBSecret.name,
      //   type: dBSecret.type,
      //   visible_data: dBSecret.data,
      // });

      // this.step("List secrets");
      // deepStrictEqual(await sdk.list_secrets(), [dBSecret]);
      //
      // this.step("Get secret");
      // deepStrictEqual(await sdk.get_secret(dBSecret.id), dBSecret);

      // this.step("Decrypt secret");
      // const secrets = await sdk.decrypt_secret(dBSecret);
      // deepStrictEqual(secrets, newSecret.secrets);
      //
      // this.step("Delete secret");
      // await sdk.delete_secret(dBSecret.id);
      // this.done();
    }
}
