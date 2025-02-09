import React from "react";
import { styled } from "styled-components";
import { Image } from "../../../../components/Image";
import { RefreshIcon, WalletFilledIcon, WarningIcon } from "../../../../components/Svg";
import { Colors } from "../../../../theme/types";
import { Variant, variants } from "./types";

const MenuIconWrapper = styled.div<{ borderColor: keyof Colors }>`
  --size: 23px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-color: ${({ theme, borderColor }) => theme.colors[borderColor]};
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  display: flex;
  height: var(--size);
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  z-index: 102;
  ${({ theme }) => theme.mediaQueries.sm} {
    --size: 25px;
    left: 8px;
    transform: translate(0, -50%);
  }
`;

const ProfileIcon = styled(Image)`
  left: 0;
  position: absolute;
  top: 0;
  z-index: 102;

  & > img {
    border-radius: 50%;
    height: 70%;
    object-fit: contain;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${({ theme }) => theme.mediaQueries.md} {
      height: 80%;
    }
  }
`;

export const NoProfileMenuIcon: React.FC<React.PropsWithChildren> = () => (
  <MenuIconWrapper borderColor="primary">
    <WalletFilledIcon color="primary" width="20px" />
  </MenuIconWrapper>
);

export const PendingMenuIcon: React.FC<React.PropsWithChildren> = () => (
  <MenuIconWrapper borderColor="secondary">
    <RefreshIcon color="secondary" width="20px" spin />
  </MenuIconWrapper>
);

export const WarningMenuIcon: React.FC<React.PropsWithChildren> = () => (
  <MenuIconWrapper borderColor="warning">
    <WarningIcon color="warning" width="20px" />
  </MenuIconWrapper>
);

export const DangerMenuIcon: React.FC<React.PropsWithChildren> = () => (
  <MenuIconWrapper borderColor="failure">
    <WarningIcon color="failure" width="20px" />
  </MenuIconWrapper>
);

const MenuIcon: React.FC<React.PropsWithChildren<{ avatarSrc?: string; variant: Variant; className?: string }>> = ({
  avatarSrc,
  variant,
  className,
}) => {
  if (variant === variants.DANGER) {
    return <DangerMenuIcon />;
  }

  if (variant === variants.WARNING) {
    return <WarningMenuIcon />;
  }

  if (variant === variants.PENDING) {
    return <PendingMenuIcon />;
  }

  if (!avatarSrc) {
    return <NoProfileMenuIcon />;
  }

  return <ProfileIcon src={avatarSrc} height={32} width={32} className={className} />;
};

export default MenuIcon;
