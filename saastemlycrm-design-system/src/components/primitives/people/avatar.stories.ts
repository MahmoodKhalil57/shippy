import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./avatar.ts";
import "../media/icon.ts";
import type { AvatarData } from "./avatar.ts";

const photos = {
  ana: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M0 0H64V64H0Z' fill='%23c9d6f2'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%236d7fc4'/%3E%3Cpath d='M10 64C12 46 52 46 54 64Z' fill='%236d7fc4'/%3E%3C/svg%3E",
  omar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M0 0H64V64H0Z' fill='%23f2dcc9'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%23b4774a'/%3E%3Cpath d='M10 64C12 46 52 46 54 64Z' fill='%23b4774a'/%3E%3C/svg%3E",
};

const team: AvatarData[] = [
  { src: photos.ana, alt: "Ana Silva" },
  { initials: "OH", alt: "Omar Haddad" },
  { src: photos.omar, alt: "Mei Tanaka" },
  { initials: "LM", alt: "Lucas Moreau" },
  { initials: "PN", alt: "Priya Nair" },
  { initials: "JB", alt: "Jonas Berg" },
  { initials: "SR", alt: "Sofia Rossi" },
];

const unnamed: AvatarData[] = [{ src: photos.ana }, { initials: "OH" }, {}];

const meta = preview.type<{ args: { max: number; overlap: "sm" | "md" | "lg" } }>().meta({
  title: "Primitives/People/Avatar",
  component: "ui-avatar",
  args: {
    src: photos.ana,
    alt: "Ana Silva",
    initials: "AS",
    presence: undefined,
    size: "xl",
    shape: "circle",
    ring: undefined,
    tone: "neutral",
    max: 4,
    overlap: "md",
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    initials: { control: "text" },
    presence: { control: "inline-radio", options: [undefined, "online", "offline"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    shape: {
      control: "select",
      options: ["square", "circle", "rounded", "rounded-xl", "squircle", "hexagon", "triangle", "heart"],
    },
    ring: { control: "inline-radio", options: [undefined, "primary", "secondary", "accent", "neutral"] },
    tone: { control: "inline-radio", options: ["neutral", "secondary"] },
    max: { control: { type: "number", min: 0, max: 7, step: 1 }, description: "Group only: how many to show." },
    overlap: { control: "inline-radio", options: ["sm", "md", "lg"], description: "Group only: how far they overlap." },
  },
  render: (args) => html`
    <ui-avatar
      src=${ifDefined(args.src)}
      alt=${ifDefined(args.alt)}
      initials=${ifDefined(args.initials)}
      presence=${ifDefined(args.presence)}
      size=${ifDefined(args.size)}
      shape=${ifDefined(args.shape)}
      ring=${ifDefined(args.ring)}
      tone=${ifDefined(args.tone)}
    ></ui-avatar>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the avatar; an image is named by its alt text." } },
  },
  play: async ({ canvas }) => {
    const image = canvas.getByRole("img", { name: "Ana Silva" });
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("src", photos.ana);
  },
});

export const InitialsPlaceholder = meta.story({
  name: "Initials placeholder",
  args: {
    src: undefined,
    initials: "OH",
    alt: "Omar Haddad",
    tone: "secondary",
    presence: "online",
    shape: "squircle",
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("img")).toBeNull();
    await expect(canvas.getByText("OH")).toBeVisible();
  },
});

export const GroupWithOverflow = meta.story({
  name: "Group with overflow",
  args: { size: "sm", ring: "primary" },
  render: (args) => html`
    <ui-avatar-group
      .avatars=${team}
      max=${ifDefined(args.max)}
      size=${ifDefined(args.size)}
      shape=${ifDefined(args.shape)}
      ring=${ifDefined(args.ring)}
      overlap=${ifDefined(args.overlap)}
    ></ui-avatar-group>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Ana Silva" })).toBeVisible();
    await expect(canvas.getByText("OH")).toBeVisible();
    await expect(canvas.queryByText("PN")).toBeNull();
    await expect(canvas.getByText("+3")).toBeVisible();
  },
});

export const ImageAndInitials = meta.story({
  name: "Image and initials",
  parameters: {
    docs: {
      description: {
        story: "Without an image the avatar shows initials on a placeholder; alt names it for assistive tech.",
      },
    },
  },
  render: () => html`
    <ui-avatar src=${photos.ana} alt="Ana Silva"></ui-avatar>
    <ui-avatar initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar initials="OH" alt="Omar Haddad" tone="secondary"></ui-avatar>
    <ui-avatar alt="Unknown person"><ui-icon name="user" size="lg"></ui-icon></ui-avatar>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  render: () => html`
    <ui-avatar size="xs" initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar size="sm" initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar size="md" initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar size="lg" initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar size="xl" initials="AS" alt="Ana Silva"></ui-avatar>
    <ui-avatar size="2xl" initials="AS" alt="Ana Silva"></ui-avatar>
  `,
});

export const Shapes = meta.story({
  name: "Shapes",
  render: () => html`
    <ui-avatar size="md" shape="circle" src=${photos.ana} alt="Circle"></ui-avatar>
    <ui-avatar size="md" shape="square" src=${photos.ana} alt="Square"></ui-avatar>
    <ui-avatar size="md" shape="rounded" src=${photos.ana} alt="Rounded"></ui-avatar>
    <ui-avatar size="md" shape="rounded-xl" src=${photos.ana} alt="More rounded"></ui-avatar>
    <ui-avatar size="md" shape="squircle" src=${photos.ana} alt="Squircle"></ui-avatar>
    <ui-avatar size="md" shape="hexagon" src=${photos.ana} alt="Hexagon"></ui-avatar>
    <ui-avatar size="md" shape="triangle" src=${photos.ana} alt="Triangle"></ui-avatar>
    <ui-avatar size="md" shape="heart" src=${photos.ana} alt="Heart"></ui-avatar>
  `,
});

export const RingsAndPresence = meta.story({
  name: "Rings and presence",
  render: () => html`
    <ui-avatar size="md" ring="primary" src=${photos.ana} alt="Ana Silva"></ui-avatar>
    <ui-avatar size="md" ring="secondary" initials="OH" alt="Omar Haddad"></ui-avatar>
    <ui-avatar size="md" ring="accent" initials="MT" alt="Mei Tanaka"></ui-avatar>
    <ui-avatar size="md" ring="neutral" initials="LM" alt="Lucas Moreau"></ui-avatar>
    <ui-avatar size="md" presence="online" src=${photos.ana} alt="Ana Silva, online"></ui-avatar>
    <ui-avatar size="md" presence="offline" initials="OH" alt="Omar Haddad, offline"></ui-avatar>
  `,
});

export const Group = meta.story({
  name: "Group",
  parameters: { docs: { description: { story: "max caps how many show; the rest collapse into a +N avatar." } } },
  render: () => html`
    <ui-avatar-group .avatars=${team}></ui-avatar-group>
    <ui-avatar-group .avatars=${team} max="4"></ui-avatar-group>
    <ui-avatar-group .avatars=${team} max="3" size="md" ring="primary"></ui-avatar-group>
  `,
});

export const GroupOverlap = meta.story({
  name: "Group overlap",
  render: () => html`
    <ui-avatar-group .avatars=${team} max="5" overlap="sm"></ui-avatar-group>
    <ui-avatar-group .avatars=${team} max="5" overlap="md"></ui-avatar-group>
    <ui-avatar-group .avatars=${team} max="5" overlap="lg" size="md"></ui-avatar-group>
  `,
});

export const DecorativeAndOwnContent = meta.story({
  name: "Decorative and own content",
  parameters: {
    docs: {
      description: {
        story:
          "Avatars without alt are decorative (an empty alt, no label), one without a photo or initials is a blank placeholder, and a group without avatars shows its own children.",
      },
    },
  },
  render: () => html`
    <ui-avatar-group data-testid="decorative" .avatars=${unnamed}></ui-avatar-group>
    <ui-avatar-group>
      <ui-avatar initials="AS" alt="Ana Silva"></ui-avatar>
      <ui-avatar initials="MT" alt="Mei Tanaka"></ui-avatar>
    </ui-avatar-group>
  `,
  play: async ({ canvas }) => {
    const decorative = canvas.getByTestId("decorative");
    await expect(decorative.querySelector("img")).toHaveAttribute("alt", "");
    const spans = decorative.querySelectorAll("span");
    await expect(spans).toHaveLength(2);
    await expect(spans[0]).toHaveTextContent("OH");
    await expect(spans[0]).not.toHaveAttribute("aria-label");
    await expect(spans[1]).toBeEmptyDOMElement();
    await expect(canvas.getByLabelText("Ana Silva")).toHaveTextContent("AS");
    await expect(canvas.getByLabelText("Mei Tanaka")).toHaveTextContent("MT");
  },
});
