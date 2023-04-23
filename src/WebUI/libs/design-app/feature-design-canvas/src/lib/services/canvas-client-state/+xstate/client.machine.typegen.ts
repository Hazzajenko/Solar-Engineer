
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {

        };
        missingImplementations: {
          actions: "Add Entity To Multiple Selected" | "Clear Selected" | "Clear Selection Box Start" | "Set Multiple Selected Entities" | "Set Selected Entity" | "Set Selection Box Start";
          delays: never;
          guards: "Selected Is Defined";
          services: never;
        };
        eventsCausingActions: {
          "Add Entity To Multiple Selected": "Add Entity To Multiple Selected";
"Clear Selected": "Cancel Selected" | "Click Elsewhere";
"Clear Selection Box Start": "Selection Box Cancelled";
"Set Multiple Selected Entities": "Selected Multiple Entities";
"Set Selected Entity": "Clicked On Different Entity";
"Set Selection Box Start": "Start Selection Box";
"SetSelectedEntity": "Click On Entity";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "Selected Is Defined": "Cancel Selected";
        };
        eventsCausingServices: {

        };
        matchesStates: "Selected State" | "Selected State.Entity Selected" | "Selected State.Multiple Entities Selected" | "Selected State.None Selected" | "Selected State.Selected Box Start Point Set" | { "Selected State"?: "Entity Selected" | "Multiple Entities Selected" | "None Selected" | "Selected Box Start Point Set"; };
        tags: never;
      }
