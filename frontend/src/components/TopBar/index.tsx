import React, { useContext } from "react";
import { Button, ButtonGroup } from "@shopify/polaris";
import { ColorSchemeContext } from "..";

export type TopBarProps = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  user?: React.ReactNode;
  showSubtitle: boolean;
};

export default function TopBar({
  title,
  subtitle,
  user,
  showSubtitle = true,
}: TopBarProps) {
  // access and change the colorsScheme through the context
  const colorScheme = useContext(ColorSchemeContext);
  return (
    <div className="topbar">
      <div className="topbar__header">
        <p className="topbar__title">{title}</p>
        <p className={`topbar__subtitle${showSubtitle ? "" : "__hidden"}`}>
          {subtitle}
        </p>
      </div>
      <div className="topbar__theme">
        <div style={{display: 'flex', alignItems: 'center', width: '400px', justifyContent: 'space-between'}}>
          <ButtonGroup segmented>
            <Button
              pressed={colorScheme.scheme === "light"}
              onClick={() => colorScheme.switchColorScheme("light")}
            >
              Light
            </Button>
            <Button
              pressed={colorScheme.scheme === "dark"}
              onClick={() => colorScheme.switchColorScheme("dark")}
            >
              Dark
            </Button>
          </ButtonGroup>
          {user}
        </div>
      </div>
    </div>
  );
}
