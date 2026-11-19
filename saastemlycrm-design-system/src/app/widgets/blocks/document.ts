import { html } from "lit";
import { defineBlock } from "../registry.ts";

/** A printable document, drawn by `<ui-document>` (src/components/composed/data/document.ts). */
defineBlock("document", (b) => html`<ui-document .doc=${b}></ui-document>`);
