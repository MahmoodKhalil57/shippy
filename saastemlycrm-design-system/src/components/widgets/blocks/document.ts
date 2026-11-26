import { html } from "lit";
import { defineBlock } from "../registry.ts";

defineBlock("document", (b) => html`<ui-document .doc=${b}></ui-document>`);
